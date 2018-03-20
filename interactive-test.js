const udp = require('dgram')
const readline = require('readline')

const { OpenPipe } = require('./index')

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const socket = udp.createSocket('udp4')
const pipe = new OpenPipe(socket)

runGame(pipe).catch(failOnError)
process.on('SIGINT', () => {
  quit(pipe)
    .then(process.exit)
    .catch(failOnError)
})

async function runGame(pipe) {
  await begin(pipe)
  await run(pipe)
  await quit(pipe)
}

async function run(pipe) {
  while (true) {
    await next(pipe)
  }
}

async function next(pipe) {
  const answer = await question()
  await runTurn(pipe, optionsFromInput(answer))
}

async function begin(pipe) {
  await pipe.connect()
  await pipe.train()
}

async function runTurn(pipe, { angle, force }) {
  await pipe.target()
  await pipe.shoot({ angle, force })
  await pipe.result()
  await pipe.reset()
}

async function quit(pipe) {
  await pipe.quit()
  await pipe.disconnect()
  await pipe.close()
}

function question() {
  return new Promise(
    resolve => input.question('Enter "angle, force": ', resolve)
  )
}

function optionsFromInput(input) {
  const [angle, force] = input.trim()
    .split(',')
    .map(parseFloat)

  return { angle, force }
}

function failOnError(error) {
  console.log(error)
  process.exit(1)
}
