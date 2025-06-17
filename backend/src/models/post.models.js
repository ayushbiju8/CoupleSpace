import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    heading: {
        type: String,
        required: true
    },
    content: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            user: { type: Schema.Types.ObjectId, ref: "User" },
            text: String,
            createdAt: { type: Date, default: Date.now },
        }
    ]
}, { timestamps: true })

export const Post = mongoose.model("Post", postSchema) 