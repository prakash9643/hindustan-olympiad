import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { EoiStudent } from "@/utils/models/eoistudent";

connectDB().catch(console.error);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      region,
      district,
      phoneNumber,
      schoolName,
      schoolCoordinatorContact,
      class: studentClass,
    } = body;

    // Validate required fields
    if (
      !name ||
      !region ||
      !district ||
      !phoneNumber ||
      !schoolName ||
      !schoolCoordinatorContact ||
      !studentClass
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid student phone number" },
        { status: 400 }
      );
    }

    if (!phoneRegex.test(schoolCoordinatorContact)) {
      return NextResponse.json(
        { error: "Invalid school coordinator contact number" },
        { status: 400 }
      );
    }

    // Create a new student document
    const result = await EoiStudent.create({
      name,
      region,
      district,
      phoneNumber,
      schoolName,
      schoolCoordinatorContact,
      class: studentClass,
    });

    return NextResponse.json(
      {
        message: "Student registered successfully",
        student: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering student:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
