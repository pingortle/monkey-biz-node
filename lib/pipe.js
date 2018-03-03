module.exports = Pipe

const OpenPipe = require('./open-pipe')

function Pipe(socket) {
  this.socket = socket
}

Pipe.prototype = {
  open: function () {
    const openPipe = new OpenPipe(this.socket)
    return openPipe
  }
}
