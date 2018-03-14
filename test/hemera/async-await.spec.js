'use strict'

if (Number(process.versions.node[0]) >= 8) {
  require('./async-await')
  require('./plugin.async-await')
  require('./server-extension.async-await')
  require('./client-extension.async-await')
  require('./middleware.async-await')
}
