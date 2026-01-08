
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const students = await Student.find({ codeforcesHandle: { $exists: true, $ne: null } }).sort({ currentRating: -1 });
    const leaderboard = students.map((student, index) => {
      const ratingHistory = student.ratingHistory;
      let lastContestRatingChange = 0;
      if (ratingHistory.length > 0) {
        lastContestRatingChange = ratingHistory[ratingHistory.length - 1].change;
      }

      return {
        rank: index + 1,
        studentId: student._id,
        name: student.name,
        codeforcesHandle: student.codeforcesHandle,
        currentRating: student.currentRating,
        lastContestRatingChange,
      };
    });
    return NextResponse.json({ success: true, data: leaderboard });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
