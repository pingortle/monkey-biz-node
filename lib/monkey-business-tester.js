module.exports = MonkeyBusinessTester

function MonkeyBusinessTester(pipe) {
  this.pipe = pipe
}

MonkeyBusinessTester.prototype.test = function () {
  this.pipe.open()
    .connect()
    .wait()
    .train()
    .wait()
    .quit()
    .disconnect()
    .wait()
    .close()
}
