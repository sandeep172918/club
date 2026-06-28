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

    const isFanClub = club.type === 'fan';
    const newStatus = isFanClub ? 'Approved' : 'Pending';

    // Set student's club to this one and set status
    student.clubId = club._id;
    student.clubJoinStatus = newStatus;
    
    // Sync with clubs array
    if (!student.clubs) {
      student.clubs = [];
    }
    const clubRecord = student.clubs.find(
      (c: any) => c.clubId.toString() === club._id.toString()
    );
    if (clubRecord) {
      clubRecord.status = newStatus;
    } else {
      student.clubs.push({ clubId: club._id, status: newStatus });
    }

    // Set their role based on approval status
    if (student.role !== 'super_admin' && student.role !== 'coordinator') {
      student.role = isFanClub ? 'member' : 'student';
    }
    
    await student.save();

    return NextResponse.json({ success: true, data: student });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
