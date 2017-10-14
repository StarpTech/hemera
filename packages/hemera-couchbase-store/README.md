# Hemera-couchbase-store package

[![npm](https://img.shields.io/npm/v/hemera-couchbase-store.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-couchbase-store)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](#badge)

This is a plugin to use [Couchbase](https://www.couchbase.com/nosql-databases/couchbase-server) with Hemera.

## Windows
Requires to set `npm config set msvs_version 2013` to build the package

## Start Couchbase with Docker

```js
docker run -d --name db -p 8091-8094:8091-8094 -p 11210:11210 couchbase
```

Visit http://localhost:8091

## Dependencies
- hemera-joi

## Install

```
npm i hemera-couchbase-store --save
```

## API

See [Store](https://github.com/hemerajs/hemera/tree/master/packages/hemera-store) Interface.

## Database specific interface

* [Couchbase API](#couchbase-api)
  * [query](#query)
  
 
-------------------------------------------------------
### query

The pattern is:

* `topic`: is the store name to publish to `couchbase-store`
* `cmd`: is the command to execute `query`
* `collection`: the name of the table or collection `string`
* `bucket`: the couchbase bucket name `string` (*optional*)
* `query`: the search criteria `string`
* `vars`: the search variables `object` (*optional*)

Example:
```js
hemera.act({
  topic: 'couchbase-store',
  cmd: 'query',
  query: 'SELECT FROM default LIMIT 1'
}, function(err, resp) ...)
```
