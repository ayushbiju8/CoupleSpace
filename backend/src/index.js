import { connectDB } from "./db/index.js";
import {app,server} from "./app.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });


connectDB()
.then(()=>{
    server.listen(process.env.PORT,()=>{
        console.log(`APP LISTENING ON PORT : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.error(`App failed to Start : ${err}`);
})