
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { getUserInfo, getUserRatingHistory } from '@/lib/codeforces-api';
import { StudentSchema } from '@/lib/models';

export async function POST(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await Promise.resolve(context.params);

    const { db } = await connectToDatabase();
    const student = await db.collection('students').findOne({ _id: new ObjectId(id) });

    if (!student) {
      return NextResponse.json({ message: 'Student not found.' }, { status: 404 });
    }

    const [userInfo, fullRatingHistory] = await Promise.all([
      getUserInfo(student.codeforcesHandle),
      getUserRatingHistory(student.codeforcesHandle),
    ]);

    const totalContestsGiven = fullRatingHistory.length;
    
    // This is a simplified calculation. A more accurate one might involve user.status API.
    // For now, we'll just count rated contests as a proxy for activity.
    const problemsSolved = totalContestsGiven * 3; // Placeholder calculation

    const updatedData = {
      currentRating: userInfo.rating || 0,
      ratingHistory: fullRatingHistory.map(contest => ({
        contestId: contest.contestId.toString(),
        rating: contest.newRating,
        change: contest.newRating - contest.oldRating,
        rank: contest.rank,
      })).sort((a, b) => a.contestId - b.contestId), // Keep it sorted
      problemsSolved,
      totalContestsGiven,
    };
    
    // We are removing contestParticipation, so we need to unset it from the document
    // for old students who might have it.
    const validation = StudentSchema.partial().safeParse(updatedData);

    if (!validation.success) {
      return NextResponse.json({ message: 'Validation failed for updated data.', errors: validation.error.issues }, { status: 500 });
    }
    
    await db.collection('students').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: validation.data,
        $unset: { contestParticipation: "" } 
      }
    );

    return NextResponse.json({ message: 'Student data synced successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Error syncing student data:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
