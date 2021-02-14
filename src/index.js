// push to github
// server side

const path = require('path');
// Node.js has a built-in module called HTTP, which allows Node.js to transfer data over the Hyper Text Transfer Protocol (HTTP).
const http = require('http');  
// Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
// Layer built on top of Node.js that helps manage a server and our routes.

const express = require('express');

// Socket.IO is composed of two parts:

// A server that integrates with (or mounts on) the Node.JS HTTP Server: socket.io
// A client library that loads on the browser side: socket.io-client
const socketio = require('socket.io');

const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages.js');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();  // sets up an http server useing the express web interface.

// The HTTP module can create an HTTP server that listens to server ports and gives a response back to the client.
// Use the createServer() method to create an HTTP server

// The http.createServer() method turns your computer into an HTTP server.
// The http.createServer() method creates an HTTP Server object.
// The HTTP Server object can listen to ports on your computer and execute a function, a requestListener,
// each time a request is made.

// http.createServer(requestListener);


// The parameter to the createServer function is a function be executed every time the server gets a request.
// This function is called a requestListener, and handles request from the user, as well as response back to 
// the user.  In this case the fuction is express().

const server = http.createServer(app);  // created the server outside of the express library

const io = socketio(server);   // configure socketio to work with a specific server.  It expects to be called 
// with the raw http server.


const port = process.env.PORT  ||  3000;

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

// let count = 0;

// server emits an event that the client receives (countUpdated)
// client emits an event that the server receives (increment)

// This is called when a new connection comes in to the server.
io.on('connection', (socket) => {
    console.log('New WebSocet connection');

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({id: socket.id, username, room });

        if (error) {
           return callback(error);
        }
        
        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', 'Welcome Message'));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`));
        
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        callback();

        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit
    });

    socket.on('sendMessage', (message, callback) => {
        
        const user = getUser(socket.id);
        
        const filter = new Filter();
        
        if (filter.isProfane(message))
        {
            return callback('Profanity is not allowed');
        }
        else {
           
            io.to(user.room).emit('message', generateMessage(user.username, message));                // emits to all connected clients
            callback('Delivered'); // called to acknowlege the event.
        }
        
    });

    socket.on('sendLocation', (coords, callback) => {
        
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', 
                generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback('Location Received by Server');
    });    

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `USER ${user.username} HAS LEFT`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

        
    });

    
})
    // sends event and data to the client
    // socket.emit('countUpdated', count);

    // Listen for an event from the client.
    // socket.on('increment', () => 
    //    count++;
        // socket.emit('countUpdated', count);  // emitting to a particular connection.
    //    io.emit('countUpdated', count);
    //})


// changed app.listen to server.listen
// The function passed into the http.createServer() method, will be executed when 
// someone tries to access the computer on 'port'.
server.listen(port, () => {
    console.log('Server is up on port ' + port)
})