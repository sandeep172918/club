import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';

export async function PUT(req: NextRequest, context: any) {
  const params = await context.params;
  await dbConnect();

  try {
    const { requestedRole } = await req.json();

    if (!requestedRole || !['member', 'coordinator'].includes(requestedRole)) {
      return NextResponse.json(
        { success: false, error: 'Invalid requested role. Must be member or coordinator.' },
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

    // Set request status to Pending
    student.requestedRole = requestedRole;
    student.roleRequestStatus = 'Pending';
    await student.save();

    return NextResponse.json({ success: true, data: student });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
