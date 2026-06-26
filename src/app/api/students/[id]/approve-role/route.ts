import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import Club from '@/models/Club';

export async function POST(req: NextRequest, context: any) {
  const params = await context.params;
  await dbConnect();

  try {
    const { action } = await req.json();

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be approve or reject.' },
        { status: 400 }
      );
    }

    const student = await Student.findById(params.id);
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found.' },
        { status: 404 }
      );
    }

    if (student.roleRequestStatus !== 'Pending' || !student.requestedRole) {
      return NextResponse.json(
        { success: false, error: 'No pending role request found for this student.' },
        { status: 400 }
      );
    }

    const targetRole = student.requestedRole;

    if (action === 'approve') {
      student.role = targetRole;
      student.roleRequestStatus = 'Approved';

      // If they are promoted to coordinator, add them to the club's coordinators list
      if (targetRole === 'coordinator' && student.clubId) {
        await Club.findByIdAndUpdate(
          student.clubId,
          { $addToSet: { coordinators: student._id } },
          { new: true }
        );
        student.clubJoinStatus = 'Approved';
      } else if (targetRole === 'member') {
        student.clubJoinStatus = 'Approved';
      }

      student.requestedRole = undefined;
      await student.save();
    } else {
      // action === 'reject'
      student.roleRequestStatus = 'Rejected';
      student.requestedRole = undefined;
      await student.save();
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
