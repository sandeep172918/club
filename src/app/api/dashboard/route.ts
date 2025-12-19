
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ContestSchema } from '@/lib/models';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const students = await db.collection('students').find({}).toArray();
    const contestsFromDb = await db.collection('contests').find({}).toArray();
    
    const contests = contestsFromDb.map(c => ContestSchema.parse(c));

    const totalStudents = students.length;

    const topRatedStudents = students
      .sort((a, b) => b.currentRating - a.currentRating)
      .slice(0, 3)
      .map(s => ({ name: s.name, codeforcesHandle: s.codeforcesHandle, currentRating: s.currentRating }));

    const last5Contests = contests
      .filter(c => new Date(c.date) < new Date())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    const participation = last5Contests.map(contest => {
      const participants = students.filter(student => 
        student.contestParticipation?.some(p => p.contestId === contest.id.toString() && p.participated)
      ).length;
      return { name: contest.name, participants };
    }).reverse();

    const allContestDates = [...new Set(students.flatMap(s => s.ratingHistory.map(rh => rh.contestId)))]
      .map(id => contests.find(c => c.id.toString() === id))
      .filter(Boolean)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const overallProgress = allContestDates.map(contest => {
        let totalRating = 0;
        let ratedStudents = 0;
        students.forEach(student => {
            const contestRatingEntry = student.ratingHistory.find(rh => rh.contestId === contest.id.toString());
            if (contestRatingEntry) {
                totalRating += contestRatingEntry.rating;
                ratedStudents++;
            }
        });
        return {
            date: new Date(contest.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            averageRating: ratedStudents > 0 ? Math.round(totalRating / ratedStudents) : 0,
        };
    });

    let topPerformers = [];
    if (last5Contests.length > 0) {
        const lastContest = last5Contests[0];
        topPerformers = students
            .map(student => {
                const performance = student.ratingHistory.find(rh => rh.contestId === lastContest.id.toString());
                return {
                    name: student.name,
                    codeforcesHandle: student.codeforcesHandle,
                    change: performance ? performance.change : 0,
                };
            })
            .filter(s => s.change > 0)
            .sort((a, b) => b.change - a.change)
            .slice(0, 3);
    }


    return NextResponse.json({
      totalStudents,
      topRatedStudents,
      participation,
      overallProgress,
      topPerformers,
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
