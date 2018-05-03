var fs = require('fs');
var PeerServer = require('peer').PeerServer;

var server = PeerServer({
  debug: true,
  port: 9000,
  ssl: {
    cert: fs.readFileSync('./certs/kopciu.xyz.crt'),
    key: fs.readFileSync('./certs/kopciu.xyz.key'),
    ca: fs.readFileSync('./certs/myCA.pem')
  }
});