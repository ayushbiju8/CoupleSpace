import mongoose, { Schema } from "mongoose";

const wishListSchema = new Schema(
    {
        coupleId: {
            type: Schema.Types.ObjectId,
            ref: "Couple",
            required: true,
        },
        wishes: [
            {
                title: {
                    type: String,
                    required: true,
                    trim: true,
                },
                description: {
                    type: String,
                    trim: true,
                },
                addedBy: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true, 
                },
                isCompleted: {
                    type: Boolean,
                    default: false,
                },
                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

export const Wishlist = mongoose.model("Wishlist", wishListSchema);
