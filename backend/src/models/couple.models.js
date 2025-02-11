import mongoose, { Schema } from "mongoose"


// Wishlist Item Model
const wishlistItemSchema = mongoose.Schema({
    item: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
    },
}, { timestamps: true });

const WishlistItem = mongoose.model("WishlistItem", wishlistItemSchema);

// Achievement Model
const achievementSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    progress: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
    },
}, { timestamps: true });

const Achievement = mongoose.model("Achievement", achievementSchema);

// Calendar Task Model
const calendarTaskSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // New field
    endTime: { type: String, required: true },   // New field
}, { timestamps: true });

const CalendarTask = mongoose.model("CalendarTask", calendarTaskSchema);

// Roadmap Model
const roadmapSchema = mongoose.Schema({
    heading: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String, // URL to the image
    },
}, { timestamps: true });

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

// Couple Model with references to each section
const coupleSchema = mongoose.Schema(
    {
        partnerOne: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        partnerTwo: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        coupleName: {
            type: String,
            required: true,
            trim: true,
        },
        coverPhoto: {
            type: String,
        },
        wishlist: [{
            type: Schema.Types.ObjectId,
            ref: "WishlistItem",
        }],
        achievements: [{
            type: Schema.Types.ObjectId,
            ref: "Achievement",
        }],
        calendar: [{
            type: Schema.Types.ObjectId,
            ref: "CalendarTask",
        }],
        roadmap: [{
            type: Schema.Types.ObjectId,
            ref: "Roadmap",
        }],
        memories: [String],
    },
    { timestamps: true }
);

export const Couple = mongoose.model("Couple", coupleSchema);
export { WishlistItem, Achievement, CalendarTask, Roadmap };
