const config = require('config');
const express = require('express');
const fs = require('fs');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const session = require('express-session');
const http = require('http');
const https = require('https');

const views = require('./backend/views');
const socket = require('./backend/socket');

const app = express();

var ExpressPeerServer = require('peer').ExpressPeerServer;
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
let server = https.createServer(options, app).listen(8443, config.get('server.host'));
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
  server: server
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});


const io = require('socket.io').listen(server);
io.on('connection', client => {
  client.emit('news', { hello: 'world' });
  client.on('my other event', function (data) {
    console.log(data);
  });});
// Add headers
app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', 'https://kopciu.xyz');
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
//socket.init(io);


