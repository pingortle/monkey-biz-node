module.exports = MonkeyBusinessTester

function MonkeyBusinessTester(pipe) {
  this.pipe = pipe
}

MonkeyBusinessTester.prototype.test = function () {
  this.pipe.open()
    .connect().wait()
    .train().wait()
    .fast()
    .target().wait()
    .shoot({ angle: 0.5, force: 100.0 }).wait()
    .wait()
    .reset().wait()
    .quit().wait()
    .disconnect().wait()
    .close()
}
