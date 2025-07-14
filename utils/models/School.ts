import mongoose from "mongoose";


const schoolSchema = new mongoose.Schema(
  {
    schoolId : String,
    schoolName: String,
    branch: String,
    serialNumber: String,
    district: String,
    region: String,
    city: String,
    pincode: String,
    board: String,
    principalName: String,
    principalPhone: String,
    principalEmail: String,
    coordinatorName: String,
    coordinatorPhone: String,
    coordinatorEmail: String,
    studentsCount: { type: Number, default: 0 },
    paymentVerification: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const School =
  mongoose.models.School || mongoose.model("School", schoolSchema);
