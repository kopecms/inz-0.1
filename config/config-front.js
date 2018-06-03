const config = {
  peerjsServer: {
    port: 9000,
    host: '0.0.0.0',
    messageInterval: 100,
  },
  socket: {
    messageInterval: 100,
  },
  colors: {
    darkBlue: 0x38618c,
    blue: 0x35a7ff,
    white: 0xf6f6f6,
    red: 0xff5964,
    yellow: 0xffe74c,
    green: 0xcaff70,
  },
  game: {
    font: '/fonts/Arial_Regular.json',
    player: {
      speed: 30,
    }
  },
  keyboard: {
    rotateCameraSpeed: 0.1,
  }
}

export default config;