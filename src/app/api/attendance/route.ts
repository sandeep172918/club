
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { ProcessedContestAttendance } from '@/types'; // Import the interface
import Contest from '@/models/Contest';

async function autoSyncContests() {
  try {
    const latestContest = await Contest.findOne().sort({ updatedAt: -1 });
    const sixHours = 6 * 60 * 60 * 1000;
    
    if (!latestContest || (Date.now() - new Date(latestContest.updatedAt).getTime() > sixHours)) {
      console.log("Auto-syncing Codeforces contests (last sync > 6 hours ago)...");
      const response = await fetch('https://codeforces.com/api/contest.list?gym=false');
      if (response.ok) {
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

        await Promise.all(
          contestsToStore.map((contestData: any) =>
            Contest.findOneAndUpdate(
              { id: contestData.id },
              contestData,
              { upsert: true, new: true, setDefaultsOnInsert: true }
            )
          )
        );
        console.log("Auto-sync complete.");
      }
    }
  } catch (error) {
    console.error("Failed to auto-sync contests:", error);
  }
}

export async function GET(req: Request) {
  await dbConnect();
  await autoSyncContests();

  try {
    // 1. Fetch the last 50 finished contests directly from Codeforces
    const cfContestsResponse = await fetch('https://codeforces.com/api/contest.list?gym=false');
    if (!cfContestsResponse.ok) {
        throw new Error(`Failed to fetch contests from Codeforces: ${cfContestsResponse.statusText}`);
    }
    const { result: allCfContests } = await cfContestsResponse.json();

    const freshFinishedContests = allCfContests
      .filter((contest: any) => contest.phase === 'FINISHED')
      .sort((a: any, b: any) => b.startTimeSeconds - a.startTimeSeconds)
      .slice(0, 50);

    // Prepare contests for output, aligning with what the frontend expects
    const contestsForTable = freshFinishedContests.map((contest: any) => ({
      id: contest.id.toString(),
      name: contest.name,
      platform: 'Codeforces',
      date: new Date(contest.startTimeSeconds * 1000).toISOString(),
    }));

    const { searchParams } = new URL(req.url);
    const clubId = searchParams.get('clubId');
    const filter: any = { codeforcesHandle: { $exists: true, $ne: null } };
    if (clubId && clubId !== 'all') {
      filter.$or = [
        { clubs: { $elemMatch: { clubId: clubId, status: 'Approved' } } },
        { clubId: clubId, role: 'coordinator' }
      ];
    } else {
      filter.$or = [
        { "clubs.status": 'Approved' },
        { role: 'coordinator' }
      ];
    }
    const students = await Student.find(filter);

    // 3. Process attendance into ProcessedContestAttendance format
    const processedAttendanceMap = new Map<string, ProcessedContestAttendance>();

    for (const contest of contestsForTable) {
        processedAttendanceMap.set(contest.id, {
            contestId: contest.id,
            contestName: contest.name,
            contestDate: contest.date,
            platform: contest.platform,
            attendancePercentage: 0, // Will calculate later
            studentAttendance: {},
        });
    }

    for (const student of students) {
        const participatedContestIds = new Set(student.contestParticipation.map((p: { contestId: string; participated: boolean }) => p.contestId));
        for (const contest of contestsForTable) {
            const participated = participatedContestIds.has(contest.id);
            const processedContest = processedAttendanceMap.get(contest.id);
            if (processedContest) {
                processedContest.studentAttendance[student._id as string] = participated;
            }
        }
    }

    const finalProcessedAttendance: ProcessedContestAttendance[] = Array.from(processedAttendanceMap.values()).map(contest => {
        const totalStudents = Object.keys(contest.studentAttendance).length;
        const attendedStudents = Object.values(contest.studentAttendance).filter(Boolean).length;
        contest.attendancePercentage = totalStudents > 0 ? (attendedStudents / totalStudents) * 100 : 0;
        return contest;
    });

    return NextResponse.json({ success: true, data: finalProcessedAttendance });
  } catch (error) {
    console.error("Error in /api/attendance:", error);
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
