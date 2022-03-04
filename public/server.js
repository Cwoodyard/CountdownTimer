const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/overlayFinal.html');
});
io.on('connection', (socket) => {
    socket.on('updateTimer', msg => {
      io.emit('updateTimer', msg);
    });
  });
  
  http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
  });
