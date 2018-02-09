/**
 * Redis client for db storage
 */
const util = require('util');
const redis = require('redis');
const client = redis.createClient();
const sub = redis.createClient();

/**
 * Promisify redis calls
 */
client.brpoplpusha = util.promisify(client.rpoplpush);
client.llena = util.promisify(client.llen);
client.lrema = util.promisify(client.lrem);
client.dela = util.promisify(client.del);
client.mgeta = util.promisify(client.mget);
client.seta = util.promisify(client.set);
client.lpusha = util.promisify(client.lpush);
/**
 * Redis client logging on error
 */
client.on_connect('error', function(err) {
    console.log('REDIS ERROR: ', err);
});

sub.on('message', function(channel, message) {
    console.log('Message unprocessed:', message);
    let id = message.split(':')[2]
    client.lrem('process', 1, id, (err, num) => {
        client.rpush('queue', id)
        console.log('Requeued message: '+id)
    })
});

sub.subscribe('__keyevent@0__:expired');

module.exports = client;