const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views','./views');

const server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(3000);

const userList = [];

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on('Client-send-register-data', (data)=>{
        if(userList.indexOf(data) >= 0) {
            socket.emit('Server-send-failed-register');
        } else {
            userList.push(data);
            socket.Username = data;
            socket.emit('Server-send-success-register', data);
            io.sockets.emit('Server-send-userList', userList);
        }
    });

    socket.on('User-send-message', (data)=>{
        let response = {
            'username': socket.Username,
            'message': data
        };
        socket.broadcast.emit('Server-send-message', response);
    });

    socket.on('start-typing-message', ()=>{
        socket.broadcast.emit('Someone-typing');
    });

    socket.on('end-typing-message', ()=>{
        socket.broadcast.emit('Someone-stop-typing');
    });

    socket.on('logout', ()=>{
        userList.splice(userList.indexOf(socket.Username), 1);
        socket.broadcast.emit('Server-send-userList', userList);
    });

    socket.on('disconnect', function() {
        console.log(`User ${socket.id} disconnected`);
    });
});

app.get('/', function(req, res) {
    res.render('home');
});
