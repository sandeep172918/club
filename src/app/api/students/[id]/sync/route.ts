
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';

export async function POST(
  req: NextRequest,
  context: any
) {
  const { params } = context;
  await dbConnect();

  try {
    const student = await Student.findById(params.id);
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    if (!student.codeforcesHandle) {
      return NextResponse.json(
        { success: false, error: 'Codeforces handle not set for this student' },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://codeforces.com/api/user.rating?handle=${student.codeforcesHandle}`
    );
    const { result } = await res.json();

    if (result.length > 0) {
      const latestRating = result[result.length - 1];
      student.currentRating = latestRating.newRating;
      student.ratingHistory.push({
        contestId: latestRating.contestId,
        rating: latestRating.newRating,
        change: latestRating.newRating - latestRating.oldRating,
      });
      await student.save();
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
