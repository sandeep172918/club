import dbConnect from '@/lib/db';
import VolunteerLog from '@/models/VolunteerLog';
import Student from '@/models/Student';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const clubId = searchParams.get('clubId');

    const filter: any = {};
    if (studentId) filter.studentId = studentId;
    if (clubId) filter.clubId = clubId;

    const logs = await VolunteerLog.find(filter)
      .sort({ date: -1 })
      .populate('studentId', 'name email codeforcesHandle')
      .populate('clubId', 'name');

    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const { studentId, clubId, role, description, hours, date } = body;

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    const log = await VolunteerLog.create({
      studentId,
      studentName: student.name,
      clubId,
      role,
      description,
      hours: Number(hours),
      date: date ? new Date(date) : new Date(),
    });

    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
