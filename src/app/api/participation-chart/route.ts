
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import Contest from '@/models/Contest';

export async function GET() {
  await dbConnect();

  try {
    const students = await Student.find({});
    const contests = await Contest.find({});
    const participationByContest: {
      [key: string]: { participation: number; nonParticipation: number };
    } = {};

    for (const contest of contests) {
      participationByContest[contest.name] = {
        participation: 0,
        nonParticipation: 0,
      };
    }

    for (const student of students) {
      for (const contest of contests) {
        const participation = student.contestParticipation.find(
          (p: any) => p.contestId === contest._id.toString()
        );
        if (participation?.participated) {
          participationByContest[contest.name].participation++;
        } else {
          participationByContest[contest.name].nonParticipation++;
        }
      }
    }

    const data = Object.keys(participationByContest).map((contestName) => ({
      contestName,
      ...participationByContest[contestName],
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
