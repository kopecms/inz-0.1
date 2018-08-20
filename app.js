const config = require('config');
const express = require('express');
const fs = require('fs');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const session = require('express-session');
const http = require('http');
const https = require('https');

const views = require('./backend/views');
const socket = require('./backend/socket-events');

const ExpressPeerServer = require('peer').ExpressPeerServer;
const app = express();

const options = {
  key: fs.readFileSync('./certs/kopciu.xyz.key'),
  cert: fs.readFileSync('./certs/kopciu.xyz.crt'),
  ca: fs.readFileSync('./certs/myCA.pem'),
  requestCert: true,
  rejectUnauthorized: false
};

http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(config.get('server.port'), config.get('server.host'));
const server = https.createServer(options, app).listen(4443, config.get('server.host'));

const io = require('socket.io').listen(server);

const optionsPeerjs = {
  debug: true
}
peerServer = ExpressPeerServer(server, optionsPeerjs);
app.use('/peerjs', peerServer);

peerServer.on('connection', function(id) {
  console.log(id)
});
// Add headers
app.use(function (req, res, next) {
  var allowedOrigins = ['https://kopciu.xyz', 'http://kopciu.xyz', 'http://192.168.0.102:4200', 'https://192.168.0.102', 'http://192.168.0.102:4200'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.setHeader('Access-Control-Allow-Origin', 'https://kopciu.xyz');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/static'));

views.init(app);
socket.init(io);


