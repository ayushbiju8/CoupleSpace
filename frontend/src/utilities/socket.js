import { io } from "socket.io-client";

const socket = io("https://couplespace.onrender.com",{
    withCredentials: true,
    // autoConnect: false
})

export default socket