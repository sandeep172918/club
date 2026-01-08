
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/utils';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { email, hashKey } = await req.json();
    const student = await Student.findOne({ email, hashKey });

    if (student) {
      if (
        isAdmin(student.email)
      ) {
        student.role = 'admin';
      }
      return NextResponse.json({ success: true, data: student });
  } }catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
