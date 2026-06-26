import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Club from '@/models/Club';
import Student from '@/models/Student';

export async function POST(req: NextRequest, context: any) {
  const params = await context.params;
  await dbConnect();
  try {
    const { studentId, action } = await req.json(); // action: 'add' | 'remove'

    const club = await Club.findById(params.id);
    if (!club) {
      return NextResponse.json({ success: false, error: 'Club not found' }, { status: 404 });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    if (action === 'add') {
      // Add to coordinators if not already there
      if (!club.coordinators.includes(studentId)) {
        club.coordinators.push(studentId);
        await club.save();
      }
      student.role = 'coordinator';
      student.clubId = club._id;
      student.clubJoinStatus = 'Approved';
      await student.save();
    } else if (action === 'remove') {
      // Remove from coordinators
      club.coordinators = club.coordinators.filter((id: any) => id.toString() !== studentId);
      await club.save();

      student.role = 'member'; // demote to regular member
      await student.save();
    }

    return NextResponse.json({ success: true, data: club });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
