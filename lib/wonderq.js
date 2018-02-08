const Joi = require('joi');
const uuid = require('uuid/v4');
const db = require('./db');

const MessageSchema = Joi.object().keys({
    id: Joi.string().guid().default(uuid(), 'UUID/v4'),
    topic: Joi.string().alphanum().min(3).max(256).required(),
    payload: Joi.object().keys({
        message: Joi.string().required(),
    }),
    ip: Joi.string().ip().required()
});

function queue(data, cb) {
    Joi.validate(data, MessageSchema)
        .then((vdata) => {
            db.lpush('queue', vdata.id)
            db.set(vdata.id, JSON.stringify(vdata))
            cb(undefined, vdata)
        }).catch((err) => {
            cb(err)
        });
}

function consume(cb) {
    let msgs = [];
    let msgids = [];
    let qlen;
    db.llena('queue')
    .then(l => {
        //set queue length
        qlen = l;

        //loop through and push messages to process queue
        for (let i = 0; i < qlen; i++) {
            let m = db.brpoplpusha('queue', 'process');
            msgids.push(m);
        }

        return Promise.all(msgids);
    }).then(msgids => {
        //set lock
        for (let i = 0; i < qlen; i++) {
            db.setex('lock:message:' + msgids[i], 60, true);
        }

        return (msgids.length > 0) ? db.mgeta(msgids) : [];
    }).then(msgs => {
        msgs = msgs.map(m => JSON.parse(m));
        cb(undefined, msgs);
    }).catch(err => {
        cb(err);
    });
}

module.exports = {
    validate: Joi.validate,
    schema: MessageSchema,
    queue: queue,
    consume: consume
}