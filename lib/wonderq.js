const Joi = require('joi');
const uuid = require('uuid/v4');
const db = require('./db');

const MessageSchema = Joi.object().keys({
    id: Joi.string().guid(),
    topic: Joi.string().alphanum().min(3).max(256).required(),
    payload: Joi.object().keys({
        message: Joi.string().required(),
    }),
    ip: Joi.string().ip().required()
});

function queue(data, cb) {
    data.id = uuid();
    Joi.validate(data, MessageSchema)
        .then((vdata) => {
            data = vdata;
            return db.seta(data.id, JSON.stringify(data));
        }).then(ret => {
            return db.lpusha('queue', data.id);
        }).then(l => {
            cb(undefined, data)
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

function rm(id, cb) {
    db.dela('lock:message:'+id)
    .then(n => {
        return db.lrema('process', 1, id)
    }).then(n => {
        return db.dela(id);
    }).then(n => {
        return cb(undefined, true);
    })
    .catch(err => {
        cb(err);
    });
}

function keyCount(queues, cb) {
    let results = [];

    for (q of queues) {
        results.push(db.llena(q));
    }
    
    Promise.all(results)
    .then(results => {
        return cb(undefined, results);
    }).catch(err => {
        return cb(err);
    })
}

function tail(queue, n, cb) {
    db.lrangea(queue, 0, n)
    .then(keys => {
        return (keys.length > 0) ? db.mgeta(keys) : [];
    }).then(msgs => {
        msgs = msgs.map(m => JSON.parse(m));
        return cb(undefined, msgs);
    }).catch(err => {
        return cb(err);
    })
}

function flush(queues, cb) {
    Promise.resolve(db.dela(...queues))
    .then(t => {
        return cb(undefined, t);
    }).catch(err => {
        return cb(err);
    });
}

module.exports = {
    validate: Joi.validate,
    schema: MessageSchema,
    queue: queue,
    consume: consume,
    rm: rm,
    keyCount: keyCount,
    flush: flush,
    tail: tail
}