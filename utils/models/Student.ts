import mongoose from "mongoose";

export interface IStudent extends mongoose.Document {
  studentId: string;
  name: string;
  class: string;
  section: string;
  gender: string;
  stream: string;
  parentName: string;
  parentContact: string;
  schoolId: string;
  schoolName: string;
  branch: string;
  city: string;
  district: string;
  region: string;
  pincode: string;
  paymentVerified: boolean;
}


const studentSchema = new mongoose.Schema(
  {
    studentId: String,
    name: String,
    class: String,
    section: String,
    gender: String,
    stream: String,
    parentName: String,
    parentContact: String,
    schoolId: String,
    schoolName: String,
    branch: String,
    city: String,
    district: String,
    region: String,
    pincode: String,
    paymentVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Student =
  mongoose.models.Student || mongoose.model <IStudent>("Student", studentSchema);
