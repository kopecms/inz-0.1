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
    ball: {
      maxDistanceDifference: 50,
    },
    font: '/fonts/Arial_Regular.json',
    player: {
      speed: 150,
      maxDistanceDifference: 100,
    },
    coin: {
      r: 4,
      h: 1,
      rSegments: 10,
      initQuantity: 10,
    }
  },
  keyboard: {
    rotateCameraSpeed: 0.1,
  }
}

export default config;