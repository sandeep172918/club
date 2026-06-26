import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import Club from '@/models/Club';

export async function POST(req: NextRequest, context: any) {
  const params = await context.params;
  await dbConnect();
  try {
    const { studentId } = await req.json();

    // Verify club exists
    const club = await Club.findById(params.id);
    if (!club) {
      return NextResponse.json({ success: false, error: 'Club not found' }, { status: 404 });
    }

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    // Set student's club to this one and set status to Pending
    student.clubId = club._id;
    student.clubJoinStatus = 'Pending';
    // If they were coordinator or member of another club, demote to student role while pending approval
    if (student.role !== 'super_admin') {
      student.role = 'student';
    }
    
    await student.save();

    return NextResponse.json({ success: true, data: student });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
