import { connectDB } from "./db/index.js";
import dotenv from "dotenv"
import {app,server} from "./app.js";

dotenv.config({path:'./.env'})

connectDB()
.then(()=>{
    server.listen(process.env.PORT,()=>{
        console.log(`APP LISTENING ON PORT : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.error(`App failed to Start : ${err}`);
})