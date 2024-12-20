import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async ()=>{
    try {
        const connectionResponse = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`DataBase Connected Succesfully : ${connectionResponse.connection.host}`)
    } catch (error) {
        console.error(`Error Occured While Connecting the Data Base : ${error}`)
    }
}

export {connectDB}