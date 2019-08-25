const app = require('express')();
const http = require('http').Server(app)
const io = require('socket.io')(http);

let clients = {};

app.get('/', (req, res) => {
    res.send('server is running');
});

//SocketIO

http.listen(3000, () => console.log('listening on port 3000'));

io.on('connection', (client) => {
    client.on("join", (name) => {
        console.log(`Joined: ${name}`);
        clients[client.id] = name;
        client.emit("update", `Welcome ${name}! You have connected to the server.`);
        client.broadcast.emit("update", `${name} has joined the server.`);
    });

    client.on("send", (msg) => {
        console.log(`Message: ${msg}`);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", () => {
        console.log("Disconnect");
        io.emit("update", `${clients[client.id]} has left the server.`);
        delete clients[client.id];
    });
});