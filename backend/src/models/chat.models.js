import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
    {
        coupleId: {
            type: Schema.Types.ObjectId,
            ref: "Couple",
            required: true,
        },
        messages: [
            {
                sender: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true, 
                },
                message: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
