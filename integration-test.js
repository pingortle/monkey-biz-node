const udp = require('dgram')

const { MonkeyBusinessTester, Pipe } = require('./index')

const tester = new MonkeyBusinessTester(new Pipe(udp.createSocket('udp4')).open())

tester.run().catch(error => {
  console.error(error)
  process.exit(1)
})
