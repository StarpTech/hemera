# Hemera-nsq package

[![npm](https://img.shields.io/npm/v/hemera-nsq.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-nsq)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](#badge)

This is a plugin to use [NSQ](http://nsq.io/) with Hemera.

NSQ promotes distributed and decentralized topologies without single points of failure, enabling fault tolerance and high availability coupled with a reliable message delivery guarantee. It is complementary to the primary NATS transport system. 

The client use JSON to transfer data.

### Start NSQ with Docker

[Steps](http://nsq.io/deployment/docker.html)

### How does it work with NATS and Hemera
We use a seperate topic for every NSQ Topic/Channels because with that you can listen in every hemera service for events. Every message will be forwarded to the NATS subscriber. As you can see NSQ give you new possibilities how to distribute your data but without lossing the benefits of nats-hemera with regard to load balancing and service-discovery.

#### Example

```js
'use strict'

const Hemera = require('nats-hemera')
const HemeraJoi = require('hemera-joi')
const nats = require('nats').connect()
const HemeraNsq = require('hemera-nsq')

const hemera = new Hemera(nats, {
  logLevel: 'info'
})

const options = {
  reader: {
    lookupdHTTPAddresses: 'http://127.0.0.1:4161'
  },
  writer: {
    url: '127.0.0.1',
    port: 4150
  }
}

hemera.use(HemeraJoi)
hemera.use(HemeraNsq, { nsq: options })

hemera.ready(() => {
  // create subscriber which listen on NSQ events
  // can be subcribed in any hemera service
  hemera.add({
    topic: 'nsq.newsletter.germany',
    cmd: 'subscribe'
  }, function (req, cb) {
    this.log.info(req, 'Data')

    cb()
  })

  // create NSQ subscriber
  hemera.act({
    topic: 'nsq',
    cmd: 'subscribe',
    subject: 'newsletter',
    channel: 'germany'
  }, function (err, resp) {
    this.log.info(resp, 'Subscribed ACK')
  })

  // Send a message to NSQ
  hemera.act({
    topic: 'nsq',
    cmd: 'publish',
    subject: 'newsletter',
    data: {
      to: 'klaus',
      text: 'You got a gift!'
    }
  }, function (err, resp) {
    this.log.info(resp, 'Publish ACK')
  })
})
```

## Dependencies
- hemera-joi

## Interface

* [NSQ API](#NSQ-api)
  * [publish](#publish)
  * [Create subscriber](#create-subscribe)
  * [Consume events](#consume-events)
  
 
-------------------------------------------------------
### publish

The pattern is:

* `topic`: is the service name to publish to `nsq`
* `cmd`: is the command to execute `publish`
* `subject`: the name of the NSQ topic `string`
* `data`: the data to transfer `object`

Example:
```js
hemera.act({
  topic: 'nsq',
  cmd: 'publish',
  subject: 'newsletter',
  data: {
    to: 'klaus',
    text: 'You got a gift!'
  }
}, ...)
```

-------------------------------------------------------
### Create subscriber

The pattern is:

* `topic`: is the service name to publish to `nsq`
* `cmd`: is the command to execute `subscribe`
* `subject`: the name of the NSQ topic `string`
* `channel`: the name of the NSQ channel `string`

Example:
```js
hemera.act({
  topic: 'nsq',
  cmd: 'subscribe',
  subject: 'newsletter',
  channel: 'germany'
}, ...)
```

-------------------------------------------------------
### Consume events

The pattern is:

* `topic`: is a combination of the subject and channel name `nsq.<subject>.<channel>`
* `cmd`: is the command to execute `subscribe`

Example:
```js
hemera.add({
  topic: 'nsq.newsletter.germany',
  cmd: 'subscribe'
}, ...)
```
