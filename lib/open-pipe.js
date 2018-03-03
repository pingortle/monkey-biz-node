const SERVER_IP_ADDRESS = '127.0.0.1'
const SERVER_PORT = 6789

module.exports = OpenPipe

const Pipe = require('./pipe')

function OpenPipe(socket) {
  this.socket = socket
  this.promise = Promise.resolve()
}

OpenPipe.prototype = {
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
    this.promise = this.promise.then(
      () => this.socket.close(),
      (error) => {
        this.socket.close()
        console.log('SOCKET ERROR: ', error)
      }
    )

    return new Pipe(this.socket)
  },

  send: function (message) {
    this.promise = this.promise.then(() =>
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

    return this
  },

  receive: function (handler) {
    this.promise = this.promise.then(() => new Promise(resolve => {
          this.socket.once('message', message => {
            resolve(message.toString())
          })
        }
      )
    )
    .then(handler)

    return this
  }
}
