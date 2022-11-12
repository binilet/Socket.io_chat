const express = require('express')
const app = express();
const http = require('http');
const cors = require('cors');

const {Server}  = require('socket.io');

app.use(cors());



const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
    }
});

let _clients = [];

io.on('connection',(socket)=>{
    console.log(`user [ ${socket.id} ] connected`);

    socket.on('join_room',(data) => {
        socket.join(data.room);

        _clients.push({socket_id : socket.id,user_name:data.username,online:true});
        console.log(_clients);
        socket.to(data.room).emit('user_joined',_clients);
        socket.emit('user_joined',_clients); 
    });

    socket.on("send_message",(data)=>{
        console.log(data);
        console.log(`the room is ${data.room}`);
        if(data.selectedSocket.length == 0) data.selectedSocket = null;
        socket.to(data.selectedSocket ?? data.room).emit("receive_message",data);
    });

    socket.on("user_is_typing",(data)=>{
        console.log(data);
        socket.to(data.room).emit('is_user_typing',data)
    });

    //logic to perform when user is disconnected from the socket
    
    socket.on('disconnect', (event_msg) => {
        console.log('user disconnected: ', socket.id, event_msg);
        const disconneted_user = _clients.filter(id=> id.socket_id === socket.id);
        socket.broadcast.emit('user_offline',
        _clients = _clients.map(usr=>{
                if(usr.user_name == disconneted_user[0]?.user_name){
                    return {...usr,online:!usr.online}
                }
                return usr;
            })
        );
    });
});




server.listen(3001,()=>{
    console.log('chat server running ...');
})