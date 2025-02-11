import { Server } from "socket.io";
import http from "http";
import express from "express";
import { verifyJWTForSocket } from "../middlewares/socketauth.middleware.js";
import { Chat } from "../models/chat.models.js";


const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN, 
    credentials: true,
  },
});

io.use(verifyJWTForSocket);

io.on("connection", (socket) => {

  console.log("A user connected:", socket.user?.userName); 

  const socketId = socket.user?.coupleId?.toString()
  socket.join(socketId)
  console.log(socket.rooms);

  socket.on("send",async (data)=>{
    // console.log(`Received Message : ${data}`);
    // console.log(socket.user?.partner);
    // console.log(socket.user?._id);
    const newMessage = await Chat.create({
      senderId: socket.user?._id,
      receiverId: socket.user?.partner._id,
      text: data?.text,
      image: data?.image || null
    })
    if(!newMessage){
      console.log("failed to create new message");
    }
    io.to(socketId).emit("sendBack",newMessage)
  })

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });

});

export { io, app, server };
