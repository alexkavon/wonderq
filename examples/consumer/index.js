#!/usr/bin/env node
const r = require('request');

setInterval(() => {
    r.get('http://localhost:8080/messages', (err, res, data) => {
        if (err) {
            console.error(err);
            return;
        }

        data = JSON.parse(data)

        if (data.status == 'error' || res.statusCode != 200) {
            console.log('Error retrieving data:\r\n', data);
            return;
        }

        //process data and notify wonderq
        for (let i = 0; i < data.payload.length; i++) {
            let msg = data.payload[i];
            //processing would happen here
            //then we send delete request to notify wonderq
            r.delete('http://localhost:8080/messages/'+msg.id, (err, res, body) => {
                if (err) {
                    console.log(err);
                    return;
                }

                if (res.statusCode != 200 || body.status == 'error') {
                    console.log('Error removing processed message:\r\n', msg.id);
                    return;
                }

                console.log('Message removed in WonderQ: ', msg.id);
            });
        }
    })
}, 5360);