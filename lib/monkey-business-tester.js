module.exports = MonkeyBusinessTester

function MonkeyBusinessTester(pipe) {
  this.pipe = pipe
}

MonkeyBusinessTester.prototype.run = async function () {
  const pipe = this.pipe

  await pipe.connect()
  await pipe.train()
  await pipe.fast()
  await pipe.target()
  await pipe.shoot({ angle: 0.5, force: 100.0 })
  await pipe.result()
  await pipe.reset()
  await pipe.quit()
  await pipe.disconnect()
  await pipe.close()
}
