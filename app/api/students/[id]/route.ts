import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Student } from "@/utils/models/Student";
import { School } from "@/utils/models/School";
import { checkForAccessOfStudent } from "@/lib/checkForAccess";

connectDB().catch(console.error);

export async function GET(req: NextRequest,
    { params }: { params: { id: string } }) {
    const id = params.id;
    const headers = req.headers;
    const authorization = headers.get("authorization") || "";

    const { access, message, accessType, user, student } = await checkForAccessOfStudent(authorization, id, "GET");

    
    if (!access) {
        return NextResponse.json({ error: message }, { status: 401 });
    }
    try {
        if (!id)
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        if (id.length === 11) {
            const student = await Student.findOne({ studentId: id });
            if (!student)
                return NextResponse.json({ error: "Can find student" }, { status: 404 });
            return NextResponse.json(student);
        }
        else {
            const student = await Student.findById(id);
            if (!student)
                return NextResponse.json({ error: "Can find student" }, { status: 404 });
            return NextResponse.json(student);
        }
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch student", details: (error as Error).message },
            { status: 500 }
        );
    }
}


export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const headers = req.headers;
    const authorization = headers.get("authorization") || "";
    const { access, message, accessType, user } = await checkForAccessOfStudent(authorization, id, "DELETE");

    if (!access) {
        return NextResponse.json({ error: message }, { status: 401 });
    }

    const student = await Student.findById(id);
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Delete the student
    await Student.findByIdAndDelete(id);

    // Decrement the student count from the school
    const school = await School.findOne({ schoolId: student.schoolId });
    if (!school) return NextResponse.json({ error: "Can't find school" }, { status: 500 });

    await school.updateOne({ $inc: { studentsCount: -1 } });
    if(student.paymentVerified === true){
        await school.updateOne({ $inc: { paymentVerifiedStudentsCount: -1 } });
    }

    return NextResponse.json({ message: "Deleted" });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const data = await req.json();
    const headers = req.headers;
    const authorization = headers.get("authorization") || "";

    const { access, message, accessType, user , student } = await checkForAccessOfStudent(authorization, id, "PUT");

    if (!access) {
        return NextResponse.json({ error: message }, { status: 401 });
    }

    if (!data.schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

    if(!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    if(data && data.confirmPayment && data.confirmPayment === true){
        const existingStudent = await Student.findById(id);

        if (!existingStudent) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        existingStudent.paymentVerified = true;
        await existingStudent.save();
        return NextResponse.json({ message: "Payment verified" }, { status: 200 });
    }

    const existing = await Student.findById(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // Only update fields that have changed
    const updatedFields: any = {};
    for (const key in data) {
        if (key === "schoolId" || key === "_id" || key === "__v" || key === "updatedAt" || key === "createdAt" || key === "studentId" || key === "schoolName" || key === "branch" || key === "district" || key === "region" || key === "city" || key === "pincode") continue;
        if (data[key] !== undefined && data[key] !== existing[key]) {
            updatedFields[key] = data[key];
        }
    }

    console.log(updatedFields);
    await Student.findByIdAndUpdate(existing._id, { $set: updatedFields }, { new: true });
    return NextResponse.json({ message: "Updated" } , { status: 200 });

}