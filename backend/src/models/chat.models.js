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
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 259200, // TTL in seconds (3 days = 3 * 24 * 60 * 60 = 259200 seconds)
        },
    },
    { timestamps: false }
);

export const Chat = mongoose.model("Chat", chatSchema);
