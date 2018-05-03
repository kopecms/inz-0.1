module.export = {
  onJoin(data) {
    console.log('join');
  },
  onHello(data) {
    console.log('hello');
  },
  onPosition(data) {
    console.log('position');
  },
  onCollision(data) {
    console.log('collision');
  },
  onShot(data) {
    console.log('shot');
  },
  onDisconnect() {
    console.log('disconnect');
  }
}