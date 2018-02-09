#!/usr/bin/env node
const program = require('commander');
const wonderq = require('../../lib/wonderq');

program.version('1.0.0')

program.command('list [queues...]', 'list queues and how many keys each queue contains')
    .option('-f, --flush', 'flush the queue(s)')
    .action(listFunc);

program.command('flush [queues...]', 'flush queues of all messages')
    .action(flushFunc);

program.command('messages <queue> <n>', 'tail the last N number of messages from a queue')
    .action(messagesFunc);

function listFunc(queues, cmd) {
    console.log('Currently active queues...');
    //Get queue counts
    wonderq.keyCount(queues, (err, lens) =>{
        if (err !== undefined) {
            console.error(err);
            process.exit(1);
        }

        for (let i = 0; i < queues.length; i++) {
            console.log('    Queue: ' + queues[i] + '...' + lens[i] + ' keys');
        }

        if (cmd.flush) {
            flushFunc(queues)
        } else {
            process.exit(1);
        }
    })
}

function messagesFunc(queue, n, cmd) {
    n = n || 10;

    wonderq.tail(queue, n, (err, msgs) => {
        if (err !== undefined) {
            console.error(err);
            process.exit(1);
        }

        if (msgs.length == 0) {
            console.log('Queue: ' + queue + ' is empty.');
        } else {
            console.log(...msgs);
        }
        process.exit(1);
    });
}

function flushFunc(queues, cmd) {
    wonderq.flush(queues, (err) => {
        if (err !== undefined) {
            console.error(err);
            process.exit(1);
        }

        console.log('Successfully flushed Queues:', ...queues);
        process.exit(1);
    })
}

program.parse(process.argv);