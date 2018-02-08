const db = require('./db')
const wonderq = require('./wonderq')

module.exports = function(app) {

    app.get('/messages', function(req, res) {
        //Consume messages from wonderq
        wonderq.consume()
        .then(data => {
            res.status(200).json({
                status: 'success',
                count: data.length,
                payload: data
            });
        }).catch(err => {
            console.log(msgs)
            res.status(400).json({status: 'error', error: err});
        });
    });

    app.post('/messages', function(req, res) {
        //Add a new message and respond with msgID
        wonderq.queue({
            topic: 'update',
            payload: {
                message: 'My message'
            },
            ip: req.ip
        }, (err, result) => {
            if (err !== undefined) {
                return res.status(400).json(err)
            }

            res.json({
                status: 'success',
                message_id: result.id
            });
        });
    });
}