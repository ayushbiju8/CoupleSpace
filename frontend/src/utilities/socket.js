import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_DEVELOPMENT_URL}`,{
    withCredentials: true,
    transports: ['websocket', 'polling']
})

export default socket