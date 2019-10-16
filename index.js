const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const names = [
  'Irena Ivory',
  'Ivan Inniss',
  'Clyde Cramer',
  'Cristine Cybulski',
  'Pura Peart',
  'William Walko',
  'Kemberly Kidwell',
  'Dionna Duhe',
  'Marvel Mooney',
  'Waltraud Whetstone'
];

const connected = [];

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  io.on('connect', socket => {
    const user = {
      name: names[Math.floor(Math.random() * names.length)],
      id: socket.id
    };
    connected.push(user);
    socket.broadcast.emit('user_connected', user);
  });

  socket.on('disconnect', socket => {
    const user = connected.filter(user => user.id === socket.id);
    io.emit('user_disconnected', socket);
  });

  socket.on('chat message', function(msg) {
    socket.broadcast.emit('chat message', socket.id + ':' + msg);
  });
  socket.on('typing', () => {
    socket.broadcast.emit('update status', socket.id + ' is typing...');
  });
});
http.listen(3000, function() {
  console.log('listening on *:3000');
});
