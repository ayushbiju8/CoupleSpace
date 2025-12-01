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
  "https://couplespace.in",               // Web frontend (production)
  "http://localhost:19000",               // Expo local dev
  "http://192.168.1.5:19000",             // LAN dev (change based on your machine IP)
  "exp://*",                              // Expo Go app (wildcard)
  "expo://*",                             // Expo standalone builds
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
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
