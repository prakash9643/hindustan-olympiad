import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { TeamMember } from "@/utils/models/team-members";

// Initialize database connection
connectDB().catch(console.error);

export async function GET(req: NextRequest) {
  const teamMembers = await TeamMember.find();
  return NextResponse.json(teamMembers);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const teamMember = new TeamMember(data);
  await teamMember.save();
  return NextResponse.json(teamMember, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  if (!data._id) return NextResponse.json({ error: "_id required" }, { status: 400 });

  const updated = await TeamMember.findByIdAndUpdate(data._id, data, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const deleted = await TeamMember.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
