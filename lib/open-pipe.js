const SERVER_IP_ADDRESS = '127.0.0.1'
const SERVER_PORT = 6789

module.exports = OpenPipe

function OpenPipe(socket) {
  this.socket = socket
}

OpenPipe.prototype = {
  wait: function () {
    return this.receive(() => {})
  },

  connect: function () {
    return this.request('CONNECT')
  },

  train: function () {
    return this.request('TRAIN')
  },

  fast: function () {
    return this.request('SPEED', 'FAST')
  },

  slow: function () {
    return this.request('SPEED', 'SLOW')
  },

  reset: function () {
    return this.request('RESET')
  },

  target: function () {
    return this.request('TARGET')
  },

  shoot: function ({ angle, force }) {
    return this.request('SHOOT', angle, force)
  },

  quit: function () {
    return this.request('QUIT')
  },

  disconnect: function () {
    return this.request('DISCONNECT')
  },

  result: function () {
    return this.receive({ timeout: 60 * 1000, matcher: /RESULT/ })
  },

  close: function () {
    return new Promise(this.socket.close.bind(this.socket))
  },

  request: function (action, ...params) {
    const received = this.receive({ matcher: new RegExp(`${action}.*`) })
    const sent = this.send([action, ...params].join(','))
    return Promise.all([sent, received])
  },

  send: function (message) {
    return new Promise((resolve, reject) => {
      this.socket.send(message, SERVER_PORT, SERVER_IP_ADDRESS, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  },

  receive: function ({ timeout = 1000, matcher = /./ } = {}) {
    const timer = delay(timeout)
    const receiver = waitForResponseMatching(this.socket, 'message', matcher)
      .then(message => message.toString())

    return Promise.race([timer, receiver])
  }
}

function delay(timeout) {
  return new Promise((_, reject) => {
    if (typeof timeout === 'undefined') {
      reject(new Error('undefined timeout not allowed'))
    } else if (isFinite(timeout)) {
      setTimeout(() => {
        reject(new Error(`Timed out waiting for response. Waited ${timeout}ms`))
      }, timeout).unref()
    }
  })
}

function waitForResponseMatching(emitter, eventName, matcher) {
  return new Promise((resolve) => {
    const listener = (response) => {
      if (matcher.test(response)) {
        emitter.removeListener(eventName, listener)
        resolve(response)
      }
    }

    emitter.addListener(eventName, listener)
  })
}
