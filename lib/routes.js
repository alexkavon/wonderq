const db = require('./db')
const wonderq = require('./wonderq')

module.exports = function(app) {

    app.get('/messages', function(req, res) {
        //Consume messages from wonderq
        wonderq.consume((err, data) => {
            if (err !== undefined) {
                return res.status(400).json({
                    status: 'error',
                    error: err
                });
            }

            res.status(200).json({
                status: 'success',
                count: data.length,
                payload: data
            });
        });
    });

    app.post('/messages', function(req, res) {
        //Add a new message and respond with msgID
        wonderq.queue({
            topic: req.body.topic,
            payload: {
                message: req.body.message
            },
            ip: req.ip
        }, (err, result) => {
            if (err !== undefined) {
                return res.status(400).json({
                    status: 'error',
                    error: err
                });
            }

            res.status(200).json({
                status: 'success',
                message_id: result.id
            });
        });
    });

    app.delete('/messages/:id', (req, res) => {
        wonderq.rm(req.params.id, (err) => {
            if (err !== undefined) {
                return res.status(400).json({
                    status: 'error',
                    error: err
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'Message ' + req.params.id + ' deleted'
            })
        })
    })
}