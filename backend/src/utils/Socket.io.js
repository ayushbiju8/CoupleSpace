import { Server } from "socket.io";
import http from "http";
import express from "express";
import { verifyJWTForSocket } from "../middlewares/socketauth.middleware.js";
import { Chat } from "../models/chat.models.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);


const allowedOrigins = [
  process.env.FRONTEND_URL_LOCAL, // e.g., "http://localhost:5173"
  process.env.FRONTEND_URL_PROD   // e.g., "https://couplespace.in"
];

const io = new Server(server, {
  cors: {
    origin: "https://couplespace.in",  // 👈 Allow ONLY your frontend
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    transports: ["websocket", "polling"]
  },
  allowEIO3: true,
  pingTimeout: 60000
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
