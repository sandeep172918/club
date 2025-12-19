
import { NextResponse } from 'next/server';
import { getContestList } from '@/lib/codeforces-api';
import { connectToDatabase } from '@/lib/db';

async function getLatestFinishedContests() {
  const allContests = await getContestList();
  
  return allContests
    .filter(c => c.phase === 'FINISHED')
    .sort((a, b) => b.startTimeSeconds - a.startTimeSeconds);
}


export async function GET() {
  try {
    const finishedContests = await getLatestFinishedContests();
    const latest100 = finishedContests.slice(0, 100);

    return NextResponse.json(latest100);
  } catch (error: any) {
    console.error('Error fetching contest list:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST() {
    try {
        const { db } = await connectToDatabase();
        const finishedContests = await getLatestFinishedContests();
        const latest100 = finishedContests.slice(0, 100);


        if (latest100.length === 0) {
            return NextResponse.json({ message: 'No finished contests found to sync.' }, { status: 200 });
        }

        const operations = latest100.map(contest => ({
            updateOne: {
                filter: { id: contest.id },
                update: { $set: {
                    id: contest.id,
                    name: contest.name,
                    platform: 'Codeforces',
                    phase: contest.phase,
                    frozen: contest.frozen,
                    durationSeconds: contest.durationSeconds,
                    startTimeSeconds: contest.startTimeSeconds,
                    date: new Date(contest.startTimeSeconds * 1000).toISOString(),
                } },
                upsert: true,
            }
        }));

        const result = await db.collection('contests').bulkWrite(operations);

        return NextResponse.json({ 
            message: 'Contests synced successfully.',
            upsertedCount: result.upsertedCount,
            modifiedCount: result.modifiedCount,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error syncing contests:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
