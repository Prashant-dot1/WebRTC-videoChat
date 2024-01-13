const express = require("express");
const { Server } = require("socket.io");

const app = express();
const io = new Server({ cors : true});


app.use(express.json());
let emailTosocketMapping = new Map();
let socketToEmailMapping = new Map();


io.on("connection", (socket) => {
    console.log("New connecttion")
    socket.on("join-room", (data) => {
        const {roomId , emailId} = data;
        console.log(`Email - ${emailId} has joined room ${roomId}`);
        emailTosocketMapping.set(emailId , socket.id);
        socketToEmailMapping.set(socket.id , emailId);
        socket.join(roomId); // socket.io 

        socket.emit("joined-room" , roomId)
        socket.broadcast.to(roomId).emit("user-joined", {emailId : emailId});
    });

    socket.on("call-user", (data) => {
        const {emailId , offer} = data;

        const sockectId = emailTosocketMapping.get(emailId);
        const fromEmail = socketToEmailMapping.get(socket.id);
        socket.to(sockectId).emit("incoming-call" , {
            from : fromEmail,
            offer
        })
    });

    socket.on("call-accepted" , (data) => {
        const {emailId , answer} = data;
        const sockectId = emailTosocketMapping.get(emailId);
        socket.to(sockectId).emit("call-accepted" , {answer});
    })
})


app.listen(3000, () => {
    console.log("Runing on port 3000")
})
io.listen(3001);
