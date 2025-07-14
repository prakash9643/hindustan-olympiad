import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
    {
        name: String,
        phone: { type: String, unique: true, required: true },
        email: String,
        region: String,
        OTP: String,
        lastOTPSent: Date,
    },
    { timestamps: true }
);

export const TeamMember =
    mongoose.models.TeamMember || mongoose.model("TeamMember", teamMemberSchema);