
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import Contest from '@/models/Contest';

export async function GET() {
  await dbConnect();

  try {
    const students = await Student.find({});
    const contests = await Contest.find({});
    const ratingHistoryByDate: { [key: string]: number[] } = {};

    for (const student of students) {
      for (const history of student.ratingHistory) {
        const contest = contests.find((c: any) => c._id.toString() === history.contestId);
        if (contest) {
          const date = new Date(contest.date).toISOString().split('T')[0];
          if (!ratingHistoryByDate[date]) {
            ratingHistoryByDate[date] = [];
          }
          ratingHistoryByDate[date].push(history.rating);
        }
      }
    }

    const data = Object.keys(ratingHistoryByDate).map((date) => {
      const ratings = ratingHistoryByDate[date];
      const averageRating =
        ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
      return { date, averageRating };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
