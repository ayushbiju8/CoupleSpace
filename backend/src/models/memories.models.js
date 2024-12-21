import mongoose, { Schema } from "mongoose"

const memoriesSchema = mongoose.Schema(
    {
        coupleId : {
            type : Schema.Types.ObjectId,
            ref : "Couple",
            required: true,
        },
        title : {
            type : String,
            required : true,
            trim: true,
        },
        media : [
            {
                type : String,
                required: true,
            }
        ]
    },{timestamps:true}
)

export const Memories = mongoose.model("Memories",memoriesSchema)