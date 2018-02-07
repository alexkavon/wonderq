const db = require('./db')

module.exports = function(app) {

    app.get('/messages', function(req, res) {
        //Send messages to client and add timeout for expiration (requeue)
        db.get('*', function(err, result) {
            res.json(result);
        });
    });

    app.post('/messages', function(req, res) {
        //Add a new message and respond with msgID
        db.set('mykey', 'This is my key');
        res.json(true)
    });
}