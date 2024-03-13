var express = require('express');
const cors  = require('cors');
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  fetch = require('node-fetch');
app.use(cors());
app.use(express.static(__dirname + '/'));

var fields = ["currencyPair", "timestamp", "bidBig", "bidPips", "offerBig", "offerPips", "high", "low", "open"]
var cachedData;
var connected = 0;

var interval = setInterval(updateData, 1000);

io.on('connection', function (socket) {
  connected++;
  io.sockets.emit('data', cachedData);
  socket.on('disconnect', function () {
    connected--;
  });
});

const processData = (fields, valid) => data => data.split("\n")
  .map(row => row.split(",")
  .reduce((acc, val, i) => { acc[fields[i]] = val; return acc }, {}))
  .filter(obj => obj.hasOwnProperty(valid))

  var cachedData;

  function updateData() {
    fetch('https://api.fastforex.io/fetch-multi?from=USD&to=LBP&api_key=216a2f0888-f740f9f26b-s9z4kw')
      .then(response=>response.text())
      .then(processData(fields, "timestamp"))
      .then(result => {
        cachedData = result;
        io.sockets.emit('data', cachedData);
        console.log(result);
    })
  }
  
app.listen(1000, function () {
  console.log('listening on: 1000');
});
  app.get('/api/data', (req, res) => {
    res.json(cachedData);
  });

 




