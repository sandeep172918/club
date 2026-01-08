
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/utils';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { name, email } = await req.json();

    if (!email.endsWith('@iitism.ac.in')) {
        return NextResponse.json({ success: false, message: 'Only @iitism.ac.in emails are allowed.' }, { status: 403 });
    }

    let student = await Student.findOne({ email });

    if (!student) {
      student = await Student.create({
        name,
        email,
        role: 'student',
        currentRating: 0,
        ratingHistory: [],
        contestParticipation: [],
      });
    }

    // Check admin status (keeping existing logic)
    if (
        isAdmin(student.email)
      ) {
        student.role = 'admin';
      }

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
