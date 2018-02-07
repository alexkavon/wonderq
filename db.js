/**
 * Redis client for db storage
 */
const redis = require('redis');
const client = redis.createClient();

/**
 * Redis client logging on error
 */
client.on_connect('error', function(err) {
    console.log('REDIS ERROR: ', err);
});

module.exports = client;