
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const students = await Student.find({});
    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    
    // Check if email or handle already exists
    const existing = await Student.findOne({ 
        $or: [
            { email: body.email }, 
            { codeforcesHandle: body.codeforcesHandle }
        ] 
    });

    if (existing) {
        return NextResponse.json({ 
            success: false, 
            error: "A student with this email or Codeforces handle already exists." 
        }, { status: 400 });
    }

    const student = await Student.create({
        ...body,
        role: 'student', // Default role
        currentRating: 0,
        ratingHistory: [],
        contestParticipation: []
    });
    
    return NextResponse.json({ success: true, data: student }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
