
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const students = await db.collection('students')
      .find({})
      .sort({ currentRating: -1 }) // Sort by currentRating in descending order
      .toArray();

    const leaderboard = students.map((student, index) => ({
      rank: index + 1,
      studentId: student._id.toString(),
      name: student.name,
      codeforcesHandle: student.codeforcesHandle,
      currentRating: student.currentRating,
      lastContestRatingChange: student.ratingHistory.length > 0 ? student.ratingHistory[student.ratingHistory.length - 1].change : 0,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
