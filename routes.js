const db = require('./db')
const schema = require('./message')

module.exports = function(app) {

    app.get('/messages', function(req, res) {
        //Send messages to client and add timeout for expiration (requeue)

        //Create result array
        result = []

        //get all keys from redis
        db.keys('*', function(err, keys) {
            //get all values
            db.mget(keys, (err, r) => {
                //TODO: update as timeout
                //perhaps secondary index to track timed out keys
                for (var v of r) {
                    result.push(JSON.parse(v));
                }
                res.json(result)
            });
        });
    });

    app.post('/messages', function(req, res) {
        //Add a new message and respond with msgID
        const valid = schema.validate({
            topic: 'data',
            payload: {
                message: 'My message',
                valid: true
            },
            ip: req.ip,
            timeout: false
        }, schema.schema).then((value) => {
            db.set(value.id, JSON.stringify(value));
            res.json({status: 'success', id: value.id});
        }).catch((err) => {
            console.log(err);
            res.status(400).json(err);
        })
    });
}