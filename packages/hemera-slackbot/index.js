'use strict'

const SlackBot = require('slackbots')
const Hp = require('hemera-plugin')
const Joi = require('joi')

function hemeraSlackbot(hemera, opts, done) {
  const topic = 'slackbot'

  const bot = new SlackBot({
    token: opts.token,
    name: opts.name
  })

  // Gracefully shutdown
  hemera.ext('onClose', (ctx, done) => {
    hemera.log.debug('Websocket connection closed!')
    if (wsConnected) {
      bot.ws.close(done)
    } else {
      done()
    }
  })

  const Joi = hemera.joi
  let subscribed = false
  let wsConnected = false

  const validMethods = [
    'getChannels',
    'getGroups',
    'getUsers',
    'getChannel',
    'getGroup',
    'getUser',
    'getUserByEmail',
    'getChannelId',
    'getGroupId',
    'getUserId',
    'getChatId',
    'postMessage',
    'updateMessage',
    'postTo',
    'postMessageToUser',
    'postMessageToGroup',
    'postMessageToChannel'
  ]

  validMethods.forEach(method => {
    hemera
      .add({
        topic,
        cmd: method,
        params: Joi.array().default([])
      })
      .use(req => validateParams(req.payload.pattern.params))
      .end((req, cb) => {
        // eslint-disable-next-line promise/catch-or-return
        bot[method]
          .apply(bot, req.params)
          .then(resp => cb(null, resp))
          .fail(err => cb(err))
      })
  })

  hemera.add(
    {
      topic,
      cmd: 'subscribe'
    },
    function(req, reply) {
      if (subscribed) {
        reply(null, true)
        return
      }

      bot.on('message', data => {
        // all ingoing events https://api.slack.com/rtm
        this.reply.next(data)
      })

      subscribed = true

      reply(null, true)
    }
  )

  bot.on('start', function() {
    hemera.log.debug('Websocket connection open!')
    wsConnected = true
    done()
  })

  bot.on('error', err => {
    hemera.log.error(err)
    hemera.fatal()
  })

  bot.on('close', () => {
    hemera.log.info('Websocket connection closed!')
  })
}

function validateParams(payload) {
  return Joi.validate(payload, Joi.array().default([]))
}

const plugin = Hp(hemeraSlackbot, {
  hemera: '>=5.0.0-rc.1',
  name: require('./package.json').name
})

module.exports = plugin
