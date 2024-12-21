const invitationSchema = new Schema(
    {
        coupleId: { 
            type: Schema.Types.ObjectId, 
            ref: "Couple", required: true 
        },
        invitedUserEmail: { 
            type: String, 
            required: true, 
            trim: true },
        status: { 
            type: String, 
            enum: ["pending", "accepted", "declined"], 
            default: "pending" 
        },
    },
    { timestamps: true }
);

export const Invitation = mongoose.model("Invitation", invitationSchema);
