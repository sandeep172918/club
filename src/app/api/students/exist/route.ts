
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { email, codeforcesHandle } = await req.json();
    const student = await Student.findOne({ $or: [{ email }, { codeforcesHandle }] });

    if (student) {
      return NextResponse.json({ success: true, exists: true });
    }

    return NextResponse.json({ success: true, exists: false });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
