import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { subMonths } from 'date-fns'; // Removed subWeeks, startOfWeek, isWithinInterval

export async function GET() {
  await dbConnect();

  try {
    const students = await Student.find({});

    // --- Skill Distribution ---
    let beginner = 0; // < 1400
    let intermediate = 0; // 1400 - 1600
    let advanced = 0; // > 1600

    // --- Progress Snapshot ---
    let improvedStudents = 0;
    let sameStudents = 0;
    let droppedStudents = 0;

    // --- Engagement ---
    let lastContestAttendanceCount = 0; // Count of students who participated in the last overall contest
    let activeMembersThisMonthCount = 0; // Students who participated in any contest in the last month

    // --- Weekly Problems Solved ---
    let problemsSolvedThisWeekClub = 0; // Sum of all students' problemsSolvedThisWeek
    let problemsSolvedLastWeekClub = 0; // Sum of all students' problemsSolvedLastWeek

    // --- Last Contest Details (for attendance) ---
    let latestContestDate: Date | null = null;
    let latestContestId: string | null = null;

    // --- Active members this month logic ---
    const oneMonthAgo = subMonths(new Date(), 1);

    for (const student of students) {
      const codeforcesHandle = student.codeforcesHandle;
      if (!codeforcesHandle) {
        continue; // Skip student if no Codeforces handle
      }

      // Skill Distribution
      if (student.currentRating < 1400) {
        beginner++;
      } else if (student.currentRating >= 1400 && student.currentRating <= 1600) {
        intermediate++;
      } else {
        advanced++;
      }

      // Progress Snapshot
      if (student.ratingHistory && student.ratingHistory.length > 0) {
        const lastChange = student.ratingHistory[student.ratingHistory.length - 1].change;
        if (lastChange > 0) {
          improvedStudents++;
        } else if (lastChange === 0) {
          sameStudents++;
        } else {
          droppedStudents++;
        }
      }

      // Sum weekly problems solved from student's schema
      problemsSolvedThisWeekClub += student.problemsSolvedThisWeek || 0;
      problemsSolvedLastWeekClub += student.problemsSolvedLastWeek || 0;

      // Engagement - Last Contest Attendance and Active Members
      if (student.contestParticipation && student.contestParticipation.length > 0) {
        if (student.ratingHistory && student.ratingHistory.length > 0) {
          const studentLatestContest = student.ratingHistory.sort((a: { timestamp: Date }, b: { timestamp: Date }) => b.timestamp.getTime() - a.timestamp.getTime())[0];
          if (!latestContestDate || studentLatestContest.timestamp > latestContestDate) {
            latestContestDate = studentLatestContest.timestamp;
            latestContestId = studentLatestContest.contestId;
          }
        }

        const hasRecentRatingChange = student.ratingHistory.some((rh: { timestamp: Date }) => rh.timestamp >= oneMonthAgo);
        if (hasRecentRatingChange) {
          activeMembersThisMonthCount++;
        }
      }
    }

    // After finding the latestContestId, iterate again for lastContestAttendanceCount
    if (latestContestId) {
        for (const student of students) {
            const participatedInLatest = student.contestParticipation.some((p: { contestId: string; participated: boolean }) => p.contestId === latestContestId && p.participated);
            if (participatedInLatest) {
                lastContestAttendanceCount++;
            }
        }
    }
    
    // Structure for Skill Distribution (battery-style)
    const skillDistribution = {
      beginner: { count: beginner, percentage: (beginner / students.length) * 100 || 0 },
      intermediate: { count: intermediate, percentage: (intermediate / students.length) * 100 || 0 },
      advanced: { count: advanced, percentage: (advanced / students.length) * 100 || 0 },
    };

    // Structure for Progress Snapshot
    const progressSnapshot = {
      improved: improvedStudents,
      same: sameStudents,
      dropped: droppedStudents,
      total: students.length,
    };

    // Structure for Engagement
    const engagement = {
      lastContestAttendance: {
        count: lastContestAttendanceCount,
        total: students.length,
        percentage: (lastContestAttendanceCount / students.length) * 100 || 0,
      },
      activeMembersThisMonth: {
        count: activeMembersThisMonthCount,
        total: students.length,
        percentage: (activeMembersThisMonthCount / students.length) * 100 || 0,
      },
    };

    const dashboardMetrics = {
      totalStudents: students.length,
      // totalProblemsSolvedClub, // Removed from metrics
      problemsSolvedThisWeek: problemsSolvedThisWeekClub,
      problemsSolvedLastWeek: problemsSolvedLastWeekClub,
      skillDistribution,
      progressSnapshot,
      engagement,
    };

    return NextResponse.json({ success: true, data: dashboardMetrics });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
