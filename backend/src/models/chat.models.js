import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
    {
        senderId :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        receiverId :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        text :{
            type : String
        },
        image :{
            type : String
        }
    },
    { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
