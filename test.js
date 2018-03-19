const assert = require('assert')

const { MonkeyBusinessTester } = require('./index')

testMonkeyBusinessTester_run()

async function testMonkeyBusinessTester_run() {
  const context = {}
  const client = {}
  const clientSpy = () => spy({ result: client, context })

  Object.assign(
    client,
    {
      connect: clientSpy(),
      train: clientSpy(),
      disconnect: clientSpy(),
      close: clientSpy(),
      quit: clientSpy(),
      fast: clientSpy(),
      target: clientSpy(),
      shoot: clientSpy(),
      result: clientSpy(),
      reset: clientSpy(),
    }
  )

  const subject = new MonkeyBusinessTester(client)
  await subject.run()

  assert.deepEqual(context.calls.map((call) => call.spy),
    [
      client.connect,
      client.train,
      client.fast,
      client.target,
      client.shoot,
      client.result,
      client.reset,
      client.quit,
      client.disconnect,
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
