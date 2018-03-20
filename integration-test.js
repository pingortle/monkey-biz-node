const udp = require('dgram')

const { MonkeyBusinessTester, OpenPipe } = require('./index')

const tester = new MonkeyBusinessTester(new OpenPipe(udp.createSocket('udp4')))

tester.run().catch(error => {
  console.error(error)
  process.exit(1)
})
