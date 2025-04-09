const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { exec } = require('child_process');
const io = require('socket.io')(http);

let nodeProcess = null;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('start', ({ command }) => {
    if (!nodeProcess) {
      nodeProcess = exec(command, (error, stdout, stderr) => {
        if (error) {
          socket.emit('output', `Error: ${error.message}`);
          nodeProcess = null;
          return;
        }
        if (stderr) {
          socket.emit('output', `Stderr: ${stderr}`);
          nodeProcess = null;
          return;
        }
        socket.emit('output', `Output: ${stdout}`);
        nodeProcess = null;
      });
      socket.emit('output', `Started: ${command}`);
    } else {
      socket.emit('output', 'A process is already running.');
    }
  });

  socket.on('stop', () => {
    if (nodeProcess) {
      nodeProcess.kill();
      nodeProcess = null;
      socket.emit('output', 'Process stopped.');
    } else {
      socket.emit('output', 'No process running.');
    }
  });
});

http.listen(3000, () => {
  console.log('Server running at http://your_public_ip:3000');
});
