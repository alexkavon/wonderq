#!/usr/bin/env node
const r = require('request');

setInterval(() => {
    let rand = Math.floor((Math.random() * 3) + 1);
    let id = Math.floor((Math.random() * 100) + 1);
    let payload;

    switch (rand) {
        case 1:
        payload = {
            topic: 'index',
            message: 'users'
        };
        break;
        case 2:
        payload = {
            topic: 'update',
            message: 'blog/'+id
        };
        break;
        case 3:
        payload = {
            topic: 'delete',
            message: 'user/'+id
        };
        break;
    }

    r.post({
        uri: 'http://localhost:8080/messages',
        json: payload
    }, function(err, res, data) {
        if (err) {
            console.log(err);
            return;
        }

        if (data.status == 'error') {
            console.log('Error: Cannot create message:\r\n', data);
        } else {
            console.log('Message produced:\r\n', data);
        }
    });
}, 3000);