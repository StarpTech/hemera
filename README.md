<p align="center">
<img src="https://github.com/StarpTech/hemera/raw/master/media/hemera-logo.png" alt="Hemera" style="max-width:100%;">
</p>

<p align="center">
<a href="http://opensource.org/licenses/MIT"><img src="https://camo.githubusercontent.com/11ad3ffb000cd7668567587af947347c738b6472/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f657870726573732e7376673f7374796c653d666c61742d737175617265266d61784167653d33363030" alt="License MIT" data-canonical-src="https://img.shields.io/npm/l/express.svg?amp;maxAge=3600" style="max-width:100%;"></a>
<a href="https://travis-ci.org/hemerajs/hemera"><img src="https://travis-ci.org/hemerajs/hemera.svg?branch=master" alt="Build Status" data-canonical-src="https://travis-ci.org/hemerajs/hemera.svg?branch=master" style="max-width:100%;"></a>
<a href="https://ci.appveyor.com/project/StarpTech/hemera"><img src="https://ci.appveyor.com/api/projects/status/s3to4boq8yawulpn?svg=true" alt="Build Status" data-canonical-src="https://ci.appveyor.com/project/StarpTech/hemera" style="max-width:100%;"></a>
<a href='https://coveralls.io/github/hemerajs/hemera?branch=master'><img src='https://coveralls.io/repos/github/hemerajs/hemera/badge.svg?branch=master' alt='Coverage Status' /></a>
<a href="https://gitter.im/hemerajs/hemera"><img src="https://camo.githubusercontent.com/e7536e01bc9c129b974e11c26b174f54e50c6d69/68747470733a2f2f696d672e736869656c64732e696f2f6769747465722f726f6f6d2f6e776a732f6e772e6a732e7376673f7374796c653d666c61742d737175617265266d61784167653d33363030" alt="Gitter" data-canonical-src="https://img.shields.io/gitter/room/nwjs/nw.js.svg?maxAge=3600" style="max-width:100%;"></a>
<img src="https://camo.githubusercontent.com/58fbab8bb63d069c1e4fb3fa37c2899c38ffcd18/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636f64655f7374796c652d7374616e646172642d627269676874677265656e2e737667" alt="JavaScript Style Guide" data-canonical-src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" style="max-width:100%;">
<a href="https://snyk.io/test/github/hemerajs/hemera"><img src="https://snyk.io/test/github/hemerajs/hemera/badge.svg?targetFile=packages%2Fhemera%2Fpackage.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/hemerajs/hemera?targetFile=packages%2Fhemera%2Fpackage.json" style="max-width:100%;"></a>
<a href="https://lernajs.io/"><img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" alt="lerna" data-canonical-src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" style="max-width:100%;"></a>
</p>

<p align="center">
A <a href="http://nodejs.org/">Node.js</a> microservices toolkit for the <a href="https://nats.io">NATS messaging system</a>
<br>Run on <a href="https://runkit.com/starptech/hemera-example">runkit.com</a>
</p>

- __Node:__ v6+
- __Documentation:__ https://hemerajs.github.io/hemera/
- __Website:__ https://hemerajs.github.io/hemera-site/
- __Lead Maintainer:__ [Dustin Deus](https://github.com/StarpTech)

## 📓 Getting Started

Hemera (/ˈhɛmərə/; Ancient Greek: Ἡμέρα [hɛːméra] "day") is a small wrapper around the NATS driver. NATS is a simple, fast and reliable solution for the internal communication of a distributed system. It chooses simplicity and reliability over guaranteed delivery. We want to provide a toolkit to develop micro services in an easy and powerful way. We provide a pattern matching RPC style. You don't have to worry about the transport. NATS is powerful.

With Hemera you have the best of both worlds. Efficient pattern matching to have the most flexibility in defining your RPC's. It doesn't matter where your server or client lives. You can add the same `add` as many as you want on different hosts to ensure maximal availability. The only dependency you have is a single binary of 7MB. Mind your own business NATS do the rest for you:

The key features of NATS in combination with Hemera are:
* **Lightweight**: The Hemera core is small as possible and can be extended by extensions or plugins.
* **Location transparency**: A service may be instantiated in different locations at different times. An application interacting with an service and does not know the service physical location.
* **Service Discovery**: You don't need a service discovery all subscriptions are managed by NATS.
* **Load Balancing**: Requests are load balanced (random) by NATS mechanism of "queue groups".
* **Packages**: Providing reliable and modern plugins to the community.
* **High performant**: NATS is able to handle million of requests per second.
* **Scalability**: Filtering on the subject name enables services to divide work (perhaps with locality) e.g. `topic:auth:germany`. Queue group name allow load balancing of services.
* **Fault tolerance**: Auto-heals when new services are added. Configure cluster mode to be more reliable.
* **Auto-pruning**: NATS automatically handles a slow consumer and cut it off.
* **Pattern driven**: Define the signatures of your RPC's in JSON and use the flexibility of pattern-matching.
* **Request & Reply**: By default point-to-point involves the fastest or first to respond.
* **Publish & Subscribe**: Hemera supports all features of NATS. This includes wildcards in subjects and normal publish and fanout mechanism.
* **Tracing**: Any distributed system need good tracing capabilities. We provide support for Zipkin or Jaeger tracing systems which manages both the collection and lookup of this data.
* **Monitoring**: Your NATS server can be monitored by cli or a dashboard.
* **Payload validation**: Create your own validator or use existing plugins e.g Hemera-Joi.
* **Serialization**: Use custom serializer e.g MessagePack.
* **Metadata**: Transfer metadata across services or attach contextual data to tracing systems.
* **Dependencies**: NATS is a single binary of 7MB and can be deployed in seconds.
* **Typescript**: We provide a definition file to support auto-intellisense. 

## Built in protection
* **Process policy**: Will exit the process when the policy (memory, event loop) could not be fullfilled (Option: `heavy`).
* **Message loop detection**: Will return an error if you call a route recursively (Option: `maxRecursion`). 

## What Hemera code looks like

**We support:**
- Async/Await (Node 8+)
- Promise
- Error-first-callback style

```js
const Hemera = require('nats-hemera')
const HemeraJoi = require('hemera-joi')
const nats = require('nats').connect('nats://demo.nats.io:4222')

const hemera = new Hemera(nats, {
  logLevel: 'info'
})

// set payload validator of your choice
hemera.use(HemeraJoi)
hemera.setOption('payloadValidator', 'hemera-joi')

const start = async () => {
  try {
    // establish connection and bootstrap hemera
    await hemera.ready()
    // use exposed lib from plugin
    let Joi = hemera.joi

    // define your first server action
    hemera.add(
      {
        topic: 'math',
        cmd: 'add',
        a: Joi.number().required(),
        b: Joi.number().required()
      },
      async function(req) {
        return req.a + req.b
      }
    )
    hemera.log.info(`service listening`)
    // start first request
    let response = await hemera.act({
      topic: 'math',
      cmd: 'add',
      a: 10,
      b: 10
    })
    hemera.log.info(response.data)
    // keep the parent "context" to retain meta and trace informations
    response = await response.context.act({
      topic: 'math',
      cmd: 'add',
      a: 10,
      b: 10
    })
    hemera.log.info(response.data)
  } catch (err) {
    hemera.log.error(err)
    process.exit(1)
  }
}
start()
```

## Documentation
* <a href="https://hemerajs.github.io/hemera/getting-started.html"><code><b>Getting Started</b></code></a>
* <a href="https://hemerajs.github.io/hemera/1_request_reply.html"><code><b>Request & Reply</b></code></a>
* <a href="https://hemerajs.github.io/hemera/1_pattern_matching.html"><code><b>Pattern Matching</b></code></a>
* <a href="https://hemerajs.github.io/hemera/1_pub_sub.html"><code><b>Publish & Subscribe</b></code></a>
* <a href="https://hemerajs.github.io/hemera/1_payload_validation.html"><code><b>Payload validation</b></code></a>
* <a href="https://hemerajs.github.io/hemera/1_middleware.html"><code><b>Middlewares</b></code></a>
* <a href="https://hemerajs.github.io/hemera/1_extension_points.html"><code><b>Extensions</b></code></a>
* <a href="https://github.com/hemerajs/hemera/blob/master/examples/basic/decorators.js"><code><b>Decorators</b></code></a>
* <a href="https://hemerajs.github.io/hemera/1_logging.html"><code><b>Logging</b></code></a>
* <a href="https://hemerajs.github.io/hemera/1_plugins.html"><code><b>Plugins</b></code></a>
* <a href="https://hemerajs.github.io/hemera/1_metadata.html"><code><b>Metadata</b></code></a>
* <a href="https://hemerajs.github.io/hemera/1_context.html"><code><b>Context</b></code></a>
* <a href="https://hemerajs.github.io/hemera/1_delegate.html"><code><b>Delegate</b></code></a>
* <a href="https://hemerajs.github.io/hemera/1_life_cycle_events.html"><code><b>Lifecycle events</b></code></a>
* <a href="https://hemerajs.github.io/hemera/2_basic.html"><code><b>Error handling</b></code></a>
* <a href="https://hemerajs.github.io/hemera/5_testing.html"><code><b>Testing</b></code></a>
* <a href="https://hemerajs.github.io/hemera/4_api.html"><code><b>Api</b></code></a>
* <a href="https://github.com/hemerajs/hemera/tree/master/examples"><code><b>Examples</b></code></a>

## Who's using Hemera?

| [![appcom-interactive](http://www.appcom-interactive.de/images/appcom-logo.svg)](http://www.appcom-interactive.de/) | [![amerbank](https://github.com/hemerajs/hemera/blob/master/media/companies/amerbank.png?raw=true)](https://amerbank.com/) | [![amerbank](https://github.com/hemerajs/hemera/blob/master/media/companies/savi.png?raw=true)](https://www.savicontrols.com/) |
| -------------| --- | --- |
| appcom interactive | amerbank | savicontrols |

## Get Involved

- **Contributing**: Pull requests are welcome!
    - Read [`CONTRIBUTING.md`](https://github.com/hemerajs/hemera/blob/master/CONTRIBUTING.md) and check out our [help-wanted](https://github.com/hemerajs/hemera/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) issues
    - Submit github issues for any feature enhancements, bugs or documentation problems
- **Support**: Join our [gitter chat](https://gitter.im/hemerajs/hemera) to ask questions to get support from the maintainers and other Hemera developers
    - Questions/comments can also be posted as [github issues](https://github.com/hemerajs/hemera/issues)
- **Discuss**: Tweet using the `#HemeraJs` hashtag

## Be aware of your requirements

Hemera has not been designed for high performance on a single process. It has been designed to create lots of microservices doesn't matter where they live. It choose simplicity and reliability as primary goals. It act together with NATS as central nervous system of your distributed system. Transport independency was not considered to be a relevant factor. In addition we use pattern matching which is very powerful. The fact that Hemera needs a broker is an argument which should be taken into consideration when you compare hemera with other frameworks. The relevant difference between microservice frameworks like senecajs, moleculer is not the performance or modularity its about the complexity you need to manage. Hemera is expert in providing an interface to work with lots of services in the network, NATS is the expert to deliver the message at the right place. Hemera is still a subscriber of NATS with some magic in routing and extensions. We don't have to worry about all different aspects in a distributed system like routing, load-balancing, service-discovery, clustering, health-checks ...

### Characteristics
- Max payload size `1MB` but it's configurable in NATS Server
- Messages are delivered `at-most-once`
- SSL Support
- Rely on a publish-subscribe (pub/sub) distribution model
- Cluster support
- Do you need reliable message delivery ? Look at [hemera-nats-streaming](https://github.com/hemerajs/hemera-nats-streaming)

## Packages

The `hemera` repo is managed as a monorepo, composed of multiple npm packages.

| General | Version |
|--------|-------|
| [nats-hemera](https://github.com/hemerajs/hemera/tree/master/packages/hemera) | [![npm](https://img.shields.io/npm/v/nats-hemera.svg?maxAge=3600)](https://www.npmjs.com/package/nats-hemera)
| [hemera-plugin](https://github.com/hemerajs/hemera/tree/master/packages/hemera-plugin) | [![npm](https://img.shields.io/npm/v/hemera-plugin.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-plugin)
| [hemera-testsuite](https://github.com/hemerajs/hemera-testsuite) | [![npm](https://img.shields.io/npm/v/hemera-testsuite.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-testsuite)
| [hemera-store](https://github.com/hemerajs/hemera/tree/master/packages/hemera-store) | [![npm](https://img.shields.io/npm/v/hemera-store.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-store)
| [hemera-stats](https://github.com/hemerajs/hemera/tree/master/packages/hemera-stats) | [![npm](https://img.shields.io/npm/v/hemera-stats.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-stats)
| [hemera-controlplane](https://github.com/hemerajs/hemera/tree/master/packages/hemera-controlplane) | [![npm](https://img.shields.io/npm/v/hemera-controlplane.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-controlplane)
| [hemera-cli](https://github.com/hemerajs/hemera-cli) | [![npm](https://img.shields.io/npm/v/hemera-cli.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-cli)
| [hemera-mail](https://github.com/hemerajs/hemera/tree/master/packages/hemera-mail) | [![npm](https://img.shields.io/npm/v/hemera-mail.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-mail)
| [hemera-slackbot](https://github.com/hemerajs/hemera/tree/master/packages/hemera-slackbot) | [![npm](https://img.shields.io/npm/v/hemera-slackbot.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-slackbot)
| [hemera-graceful-shutdown](https://github.com/hemerajs/hemera/tree/master/packages/hemera-graceful-shutdown) | [![npm](https://img.shields.io/npm/v/hemera-graceful-shutdown.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-graceful-shutdown)
| [hemera-safe-promises](https://github.com/hemerajs/hemera/tree/master/packages/hemera-safe-promises) | [![npm](https://img.shields.io/npm/v/hemera-safe-promises.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-safe-promises)

| Tracer | Version |
|--------|-------|
| [hemera-zipkin](https://github.com/hemerajs/hemera/tree/master/packages/hemera-zipkin) | [![npm](https://img.shields.io/npm/v/hemera-zipkin.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-zipkin)
| [hemera-jaeger](https://github.com/hemerajs/hemera/tree/master/packages/hemera-jaeger) | [![npm](https://img.shields.io/npm/v/hemera-jaeger.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-jaeger)

| Metrics | Version |
|--------|-------|
| [hemera-prometheus](https://github.com/hemerajs/hemera/tree/master/packages/hemera-prometheus) | [![npm](https://img.shields.io/npm/v/hemera-prometheus.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-prometheus)

| Messaging bridges | Version |
|--------|-------|
| [hemera-nats-streaming](https://github.com/hemerajs/hemera-nats-streaming) | [![npm](https://img.shields.io/npm/v/hemera-nats-streaming.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-nats-streaming)
| [hemera-rabbitmq](https://github.com/hemerajs/hemera-rabbitmq) | [![npm](https://img.shields.io/npm/v/hemera-rabbitmq.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-rabbitmq)
| [hemera-nsq](https://github.com/hemerajs/hemera/tree/master/packages/hemera-nsq) | [![npm](https://img.shields.io/npm/v/hemera-nsq.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-nsq)
| [hemera-web](https://github.com/hemerajs/hemera/tree/master/packages/hemera-web) | [![npm](https://img.shields.io/npm/v/hemera-web.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-web)
| [hemera-sqs](https://github.com/hemerajs/hemera/tree/master/packages/hemera-sqs) | [![npm](https://img.shields.io/npm/v/hemera-sqs.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-sqs)

| Database adapter | Version |
|--------|-------|
| [hemera-arango-store](https://github.com/hemerajs/hemera-arango-store) | [![npm](https://img.shields.io/npm/v/hemera-arango-store.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-arango-store)
| [hemera-sql-store](https://github.com/hemerajs/hemera-sql-store) | [![npm](https://img.shields.io/npm/v/hemera-sql-store.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-sql-store)
| [hemera-elasticsearch](https://github.com/hemerajs/hemera-elasticsearch) | [![npm](https://img.shields.io/npm/v/hemera-elasticsearch.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-elasticsearch)
| [hemera-mongo-store](https://github.com/hemerajs/hemera-mongo-store) | [![npm](https://img.shields.io/npm/v/hemera-mongo-store.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-mongo-store)
| [hemera-rethinkdb-store](https://github.com/hemerajs/hemera-rethinkdb-store) | [![npm](https://img.shields.io/npm/v/hemera-rethinkdb-store.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-rethinkdb-store)

| Payload validation | Version |
|--------|-------|
| [hemera-joi](https://github.com/hemerajs/hemera/tree/master/packages/hemera-joi) | [![npm](https://img.shields.io/npm/v/hemera-joi.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-joi)

| Data serialization | Version |
|--------|-------|
| [hemera-msgpack](https://github.com/hemerajs/hemera/tree/master/packages/hemera-msgpack) | [![npm](https://img.shields.io/npm/v/hemera-msgpack.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-msgpack)

| Cache | Version |
|--------|-------|
| [hemera-redis-cache](https://github.com/hemerajs/hemera-redis-cache) | [![npm](https://img.shields.io/npm/v/hemera-redis-cache.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-redis-cache)

| Granting / Authenticating | Version |
|--------|-------|
| [hemera-jwt-auth](https://github.com/hemerajs/hemera/tree/master/packages/hemera-jwt-auth) | [![npm](https://img.shields.io/npm/v/hemera-jwt-auth.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-jwt-auth)

## Framwork Integrations

| Name | Version |
|--------|-------|
| [fastify-hemera](https://github.com/hemerajs/fastify-hemera) | [![NPM version](https://img.shields.io/npm/v/fastify-hemera.svg?style=flat)](https://www.npmjs.com/package/fastify-hemera)
| [hapi-hemera](https://github.com/hemerajs/hapi-hemera) | [![npm](https://img.shields.io/npm/v/hapi-hemera.svg?maxAge=3600)](https://www.npmjs.com/package/hapi-hemera)
| [graphql boilerplate](https://github.com/hemerajs/graphql-hemera) | -

## Changelog

See [Releases](https://github.com/hemerajs/hemera/releases)

## Contributing

Please read [CONTRIBUTING.md](https://github.com/hemerajs/hemera/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. Available versions [tags on this repository](https://github.com/hemerajs/hemera/tags). 

## Authors

* **Dustin Deus** - [StarpTech](https://github.com/StarpTech)

See also the list of [contributors](https://github.com/StarpTech/hemera/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Inspiration

[Seneca](https://github.com/senecajs/seneca) - A microservices toolkit for Node.js.

## Professional services
Hemera is free for any use (MIT license). If you are in production don't miss the professional support service. For courses and training send me an email to [deusdustin@gmail.com](deusdustin@gmail.com) or contact me private on <a href="https://gitter.im/hemerajs/hemera"><img src="https://camo.githubusercontent.com/e7536e01bc9c129b974e11c26b174f54e50c6d69/68747470733a2f2f696d672e736869656c64732e696f2f6769747465722f726f6f6d2f6e776a732f6e772e6a732e7376673f7374796c653d666c61742d737175617265266d61784167653d33363030" alt="Gitter" data-canonical-src="https://img.shields.io/gitter/room/nwjs/nw.js.svg?maxAge=3600" style="max-width:100%;"></a>

## Support / Donate
<p>
  <a href="https://www.patreon.com/starptech">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" height="40px" />
  </a>
</p>
