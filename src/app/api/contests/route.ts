
import dbConnect from '@/lib/db';
import Contest from '@/models/Contest';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const response = await fetch('https://codeforces.com/api/contest.list?gym=false');
    const { result } = await response.json();

    const finishedCodeforcesContests = result
      .filter((contest: any) => contest.phase === 'FINISHED')
      .sort((a: any, b: any) => b.startTimeSeconds - a.startTimeSeconds)
      .slice(0, 50);

    const contestsToStore = finishedCodeforcesContests.map((contest: any) => ({
      id: contest.id.toString(),
      name: contest.name,
      platform: 'Codeforces',
      date: new Date(contest.startTimeSeconds * 1000).toISOString(),
    }));

    // Update or insert contests into the database
    const upsertedContests = await Promise.all(
      contestsToStore.map((contestData: any) =>
        Contest.findOneAndUpdate(
          { id: contestData.id },
          contestData,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );

    return NextResponse.json({ success: true, data: upsertedContests });
  } catch (error) {
    console.error("Error fetching or storing contests:", error);
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// POST function is removed as it's no longer needed for manual entry of Codeforces contests.
// All Codeforces contests will be synced via the GET request.
