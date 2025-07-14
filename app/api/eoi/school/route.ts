import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { EoiSchool } from "@/utils/models/eoischool";

connectDB().catch(console.error);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      schoolName,
      schoolCoordinatorContact,
      schoolCoordinatorEmail,
      schoolAddress,
      region,
      district,
    } = body;

    // Validate required fields
    if (
      !schoolName ||
      !schoolCoordinatorContact ||
      !schoolCoordinatorEmail ||
      !schoolAddress ||
      !region ||
      !district
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Optional: Validate email & phone format
    if (!/^\d{10}$/.test(schoolCoordinatorContact)) {
      return NextResponse.json(
        { error: "Invalid contact number" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolCoordinatorEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create a new school document
    const result = await EoiSchool.create({
      schoolName,
      schoolCoordinatorContact,
      schoolCoordinatorEmail,
      schoolAddress,
      region,
      district,
    });

    return NextResponse.json(
      {
        message: "School registered successfully",
        school: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering school:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
