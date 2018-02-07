module.exports = function(app) {
    app.get('/', function(req, res) {
        res.json({message: 'Hello world!'})
    })
    app.get('/messages', function(req, res) {
        //Send messages to client and add timeout for expiration (requeue)
    });

    app.post('/messages', function(req, res) {
        //Add a new message and respond with msgID
    });
}