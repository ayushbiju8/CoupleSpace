import { io } from "socket.io-client";

const socket = io("https://couplespace.onrender.com",{
    withCredentials: true,
    transports: ['websocket', 'polling']
})

export default socket