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

async function consume() {
    let msgs = [];
    let qlen;
    
    try {
        let msgids = [];
        qlen = await db.llena('queue');

        for (let i = 0; i < qlen; i++) {
            let m = db.brpoplpusha('queue', 'processing');
            msgids.push(m);
        }
        
        msgids = await Promise.all(msgids);

        //set lock
        for (let i = 0; i < qlen; i++) {
            db.setex('lock:message:' + msgids[i], 60, true)
        }

        msgs = await db.mgeta(msgids);
    } catch(err) {

        return err;
    }

    msgs = msgs.map(m => JSON.parse(m))

    return msgs;
}

module.exports = {
    validate: Joi.validate,
    schema: MessageSchema,
    queue: queue,
    consume: consume
}