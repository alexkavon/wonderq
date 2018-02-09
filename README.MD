# WonderQ
The world famous Simple Queue Service

## About
WonderQ is a simple queue service with an http library. However you may also just use the library (located in lib).

## Requirements
- NodeJS
- Redis (v >3.0.0)

For more information about installing redis, please visit http://redis.io

Once Redis is running, you will need to configure it using the redis-cli and set the following configuration option:
~~~
redis-cli config set notify-keyspace-events KE$x
~~~

This option can also be set in the /etc/redis/redis.conf config to ease the process.

## Installation
Inside the wonderq folder, run the following command:

~~~
npm install
~~~

WonderQ will install it's dependencies, then to start use:

~~~
npm start
~~~

This will start the WonderQ HTTP service.

## Using WonderQ

WonderQ operates on a simple HTTP API.

###Message Template
WonderQ has a simple API. It exects messages in the form of JSON:

~~~
{topic: 'index', message: 'users'}
~~~
- topic: topic/category of the message (perhaps an action to take)
- message: The payload of the message

###POST /messages
Get started by submitting a POST request containing your message to the following endpoint:

```localhost:8080/messages```

This will index your message and return a message ID which can be used by a consumer to track already processed messages.

###GET /messages
Easily get all the lastest messages by sending a GET request to the following endpoint:

```localhost:8080/messages```

This will return any messages waiting in the "queue" and move them over for processing (the "process" queue). These messages will then be locked for 60 seconds. If the consumer does not respond within that amount of time, WonderQ will move the message back to the queue and allow another consumer to pick it up.

###DELETE /messages/<id>

This endpoint will allow a message to be labeled as processed and removed from the queue and remove any locks placed on the message.

Simple submit a DELETE HTTP request to:
```localhost:8080/messages/<id>```

####Message <id>
A message ID is a simple UUID/v4 key that allows for consumeres and producers to track which messages they've processed.

## Examples
This package contains 3 example projects to demonstrate the power of WonderQ

### HTTP API Demo
To demonstrate the power of WonderQ consumers and producers, navigate to the examples folders and start a consumer and producer.

```cd examples/consumer```
```npm install && npm start```

(new terminal)
```cd examples/producer```
```npm install && npm start```

The producer will push messages to WonderQ and the consumer will Consume said messages using the previously mentioned endpoints.

### WONQ
You may tail, flush, list queues and messages using the wonQ command line tool.

1. Navigate to examples/wonq
2. npm install -g
3. Use a wonq <command>

### WONQ Commands

Easily use a WONQ command via:
```wonq <command> --flag```

~~~
list [queues...]      list queues and how many keys each queue contains
flush [queues...]     flush queues of all messages
messages <queue> <n>  tail the last N number of messages from
a queue
help [cmd]            display help for [cmd]
~~~

## Tests