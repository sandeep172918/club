import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import Club from '@/models/Club';

export async function POST(req: NextRequest, context: any) {
  const params = await context.params;
  await dbConnect();
  try {
    const { action } = await req.json(); // action: 'approve' | 'reject'
    const studentId = params.studentId;

    const club = await Club.findById(params.id);
    if (!club) {
      return NextResponse.json({ success: false, error: 'Club not found' }, { status: 404 });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    if (action === 'approve') {
      student.clubJoinStatus = 'Approved';
      // Promote to member if they aren't coordinator or super_admin already
      if (student.role !== 'super_admin' && student.role !== 'coordinator') {
        student.role = 'member';
      }
    } else if (action === 'reject') {
      student.clubJoinStatus = 'Rejected';
      if (student.role !== 'super_admin') {
        student.role = 'student';
      }
    }

    await student.save();

    return NextResponse.json({ success: true, data: student });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
