const SERVER_IP_ADDRESS = '127.0.0.1'
const SERVER_PORT = 6789

module.exports = OpenPipe

const Pipe = require('./pipe')

function OpenPipe(socket) {
  this.socket = socket
  this.promise = Promise.resolve()
}

OpenPipe.prototype = {
  then: function (...params) {
    this.promise = this.promise.then(...params)
    return this
  },

  catch: function (...params) {
    this.promise = this.promise.catch(...params)
    return this
  },

  wait: function () {
    return this.receive(() => {})
  },

  connect: function () {
    return this.send('CONNECT')
  },

  train: function () {
    return this.send('TRAIN')
  },

  fast: function () {
    return this.send('SPEED,FAST')
  },

  slow: function () {
    return this.send('SPEED,SLOW')
  },

  reset: function () {
    return this.send('RESET')
  },

  target: function () {
    return this.send('TARGET')
  },

  shoot: function ({ angle, force }) {
    return this.send(`SHOOT,${angle},${force}`)
  },

  quit: function () {
    return this.send('QUIT')
  },

  disconnect: function () {
    return this.send('DISCONNECT')
  },

  close: function () {
    this.then(
      () => this.socket.close(),
      (error) => {
        this.socket.close()
        console.log('SOCKET ERROR: ', error)
      }
    )

    return new Pipe(this.socket)
  },

  send: function (message) {
    return this.then(() =>
      new Promise(
        (resolve, reject) => {
          this.socket.send(
            message,
            SERVER_PORT,
            SERVER_IP_ADDRESS,
            (error) => {
              if (error) {
                reject()
              } else {
                resolve()
              }
            }
          )
        }
      )
    )
  },

  receive: function (handler, { timeout } = { timeout: 1000 }) {
    return this.then(() => new Promise((resolve, reject) => {
          let timeoutHandle = null
          if (isFinite(timeout)) {
            timeoutHandle = setTimeout(reject, timeout)
          }

          this.socket.once('message', message => {
            clearTimeout(timeoutHandle)
            resolve(message.toString())
          })
        }
      )
    )
    .then(
      handler,
      () => { throw new Error(`Timed out waiting for response. Waited ${timeout}ms`) }
    )
  }
}
