const udp = require('dgram')
const readline = require('readline')

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const Pipe = require('./lib/pipe')

const socket = udp.createSocket('udp4')
const pipe = new Pipe(socket)

const game = begin(pipe)

game.then(next)
process.on('SIGINT', () => quit(game))

function next() {
  input.question('Enter "angle, force": ', answer =>
    runTurn(game, optionsFromInput(answer))
      .then(next)
  )
}

function begin(pipe) {
  return pipe.open()
    .connect()
    .receive(console.log)
    .train()
    .receive(console.log)
}

function runTurn(pipe, { angle, force }) {
  return pipe.target()
    .receive(console.log)
    .shoot({ angle, force })
    .receive(console.log)
    .receive(console.log)
    .reset()
    .receive(console.log).promise
}

function quit(pipe) {
  return pipe.quit().receive(console.log)
    .disconnect()
    .receive(() => process.exit())
    .close()
}

function optionsFromInput(input) {
  const [angle, force] = input.trim()
    .split(',')
    .map(parseFloat)

  return { angle, force }
}
