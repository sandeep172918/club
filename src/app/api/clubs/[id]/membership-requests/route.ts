import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import Club from '@/models/Club';

export async function GET(req: NextRequest, context: any) {
  const params = await context.params;
  await dbConnect();
  try {
    const club = await Club.findById(params.id);
    if (!club) {
      return NextResponse.json({ success: false, error: 'Club not found' }, { status: 404 });
    }

    const pendingStudents = await Student.find({
      clubId: club._id,
      clubJoinStatus: 'Pending',
    });

    return NextResponse.json({ success: true, data: pendingStudents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
