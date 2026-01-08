
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { ProcessedContestAttendance } from '@/types'; // Import the interface
// import Contest from '@/models/Contest'; // No longer fetching all contests from local DB here

export async function GET() {
  await dbConnect();

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

    // 2. Fetch all student schemas
    const students = await Student.find({ codeforcesHandle: { $exists: true, $ne: null } });

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
