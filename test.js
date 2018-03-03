const assert = require('assert')

const { MonkeyBusinessTester } = require('./index')

testMonkeyBusinessTester_test()

function testMonkeyBusinessTester_test() {
  const context = {}
  const client = {}
  const clientSpy = () => spy({ result: client, context })

  Object.assign(
    client,
    {
      open: clientSpy(),
      connect: clientSpy(),
      train: clientSpy(),
      disconnect: clientSpy(),
      close: clientSpy(),
      wait: clientSpy(),
      quit: clientSpy(),
      receive: clientSpy()
    }
  )

  const subject = new MonkeyBusinessTester(client)
  subject.test()

  assert.deepEqual(context.calls.map((call) => call.spy),
    [
      client.open,
      client.connect,
      client.wait,
      client.train,
      client.wait,
      client.quit,
      client.disconnect,
      client.wait,
      client.close
    ]
  )
}

/***** SUPPORT *****/

function spy({ result, context } = {}) {
  if (result && result.call) {
    result = result.call()
  }

  const spy = (...params) => {
    context && context.calls.push({ params, spy })
    spy.calls.push({ params, spy })
    return result
  }

  context && (context.calls = [])
  spy.calls = []

  return spy
}
