const assert = require('assert')

const { MonkeyBusinessTester } = require('./index')

testMonkeyBusinessTester_run()

function testMonkeyBusinessTester_run() {
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
      fast: clientSpy(),
      target: clientSpy(),
      shoot: clientSpy(),
      reset: clientSpy(),
      catch: clientSpy()
    }
  )

  const subject = new MonkeyBusinessTester(client)
  subject.run()

  assert.deepEqual(context.calls.map((call) => call.spy),
    [
      client.open,
      client.connect,
      client.wait,
      client.train,
      client.wait,
      client.fast,
      client.target,
      client.wait,
      client.shoot,
      client.wait,
      client.wait,
      client.reset,
      client.wait,
      client.quit,
      client.wait,
      client.disconnect,
      client.wait,
      client.catch,
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
