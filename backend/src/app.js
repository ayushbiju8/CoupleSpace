import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { app, server, io } from "./utils/Socket.io.js"


const allowedOrigins = [
    process.env.FRONTEND_URL_LOCAL,
    process.env.FRONTEND_URL_PROD
];

app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({
    limit: "16kb"
}))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())



// Routes

import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users", userRouter)
// http://localhost:8000/api/v1/users/register

import coupleRouter from "./routes/couple.routes.js"
app.use("/api/v1/couples", coupleRouter)


import chatRouter from "./routes/chat.routes.js"
app.use("/api/v1/chat", chatRouter)

export { app, server }