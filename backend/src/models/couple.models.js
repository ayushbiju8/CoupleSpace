import mongoose, { Schema } from "mongoose";

const coupleSchema = mongoose.Schema(
    {
        partnerOne : {
            type : Schema.Types.ObjectId,
            ref : "User"   
        },
        partnerTwo : {
            type : Schema.Types.ObjectId,
            ref : "User"   
        },
        coupleName : {
            type : String,
            required : true,
            trim : true,
        },
        coverPhoto : {
            type : String,
        }
    },{timestamps:true}
)

export const Couple = mongoose.model("Couple",coupleSchema)