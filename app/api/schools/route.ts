import { connectDB } from "@/utils/config/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { School } from "@/utils/models/School";
import { Counter } from "@/utils/models/Counter";
import { SchoolCoordinator } from "@/utils/models/SchoolCoordinator";
import { TeamMember } from "@/utils/models/team-members";

connectDB().catch(console.error);

async function generateSchoolId(region: string, district: string) {
  // Region: 1 digit (0-9)
  // District: 2 digits (01-99)
  // Serial: 4 digits, auto incremented per region+district

  const regionCode = region[0]; // assuming region code is one digit string
  const districtCode = district.padStart(2, "0");

  const counterId = `${regionCode}_${districtCode}`;
  let counter = await Counter.findById(counterId);

  if (!counter) {
    counter = new Counter({ _id: counterId, seq: 0 });
  }

  counter.seq += 1;
  await counter.save();

  const serial = counter.seq.toString().padStart(4, "0");
  return `${regionCode}${districtCode}${serial}`;
}

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url);
  const headers = req.headers;
  const authorization = headers.get("authorization");
  var isTeamMember = false;
  if (!authorization) {
    return NextResponse.json({ error: "Authorization header required" }, { status: 400 });
  }

  const token = authorization.split(" ")[0];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized : No token provided" }, { status: 401 });
  }

  if (token.length !== 24) {
    return NextResponse.json({ error: "Unauthorized : Invalid token" }, { status: 401 });
  }

  const schoolCoordinator = await SchoolCoordinator.findById(token);
  const teamMember = await TeamMember.findById(token);

  if (!schoolCoordinator && !teamMember) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (teamMember) {
    isTeamMember = true;
  }
  if (schoolCoordinator) {
    return NextResponse.json({ error: "Unauthorized : Schools cords cant view schools" }, { status: 401 });
  }

  // Pagination
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const sortBy = searchParams.get("sortBy") || "schoolName";
  const skip = (page - 1) * limit;

  // Search
  const query = searchParams.get("query");

  const filter: any = {};

  if (query) {
    const regex = new RegExp(query, "i");

    const orConditions = [{ schoolName: regex }];

    if (/^[A-Za-z0-9_-]+$/.test(query)) {
      orConditions.push({ schoolId: query } as any);
    }

    filter.$or = orConditions;
  }

  // if (district) filter.district = district;
  // if (region.length > 0) filter.region = { $in: region };
  // if (board) filter.board = board;

  if (isTeamMember) {
    filter.region = { $in: teamMember.region.split(",") };
  }
  try {
    const schools = await School.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: 1 });

    const total = await School.countDocuments(filter);

    return NextResponse.json({
      schools: schools,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch schools", details: error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const headers = req.headers;
  const authorization = headers.get("authorization");
  var isTeamMember = false;
  if (!authorization) {
    return NextResponse.json({ error: "Authorization header required" }, { status: 400 });
  }

  const token = authorization.split(" ")[0];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized : No token provided" }, { status: 401 });
  }

  if (token.length !== 24) {
    return NextResponse.json({ error: "Unauthorized : Invalid token" }, { status: 401 });
  }

  const schoolCoordinator = await SchoolCoordinator.findById(token);
  const teamMember = await TeamMember.findById(token);

  if (!schoolCoordinator && !teamMember) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (schoolCoordinator) {
    return NextResponse.json({ error: "Unauthorized : Schools cords cant add schools" }, { status: 401 });
  }

  if (!data.region || !data.district) {
    return NextResponse.json({ error: "region and district required" }, { status: 400 });
  }

  if (teamMember) {
    if (teamMember.region.split(",").includes(data.region)) {
      console.log("Team member region matches");
    }
    else {
      return NextResponse.json({ error: "Unauthorized : Regions dont match" }, { status: 401 });
    }

  }

  // Generate schoolId
  const schoolId = await generateSchoolId(data.region, data.district);
  data.schoolId = schoolId;

  const school = new School(data);
  await school.save();

  if (school._id) {
    console.log(data);
    const schoolCoordinator = new SchoolCoordinator({
      name: data.coordinatorName,
      phone: data.coordinatorPhone,
      email: data.coordinatorEmail,
      schoolId: school._id,
      school_id: school.schoolId,
    });
    await schoolCoordinator.save();
  }

  return NextResponse.json(school, { status: 201 });
}
