import Student from '@/models/Student';
import Club from '@/models/Club';
import dbConnect from '@/lib/db';
import { startOfWeek, subWeeks, isWithinInterval, subDays } from 'date-fns';
import fetch from 'node-fetch';

// Single student sync (useful for individual updates)
export async function updateStudentParticipation(studentId: string) {
  await dbConnect();

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      console.warn(`Student with ID ${studentId} not found.`);
      return;
    }

    const codeforcesHandle = student.codeforcesHandle;
    if (!codeforcesHandle) {
      console.warn(`Codeforces handle not found for student ${student.name} (ID: ${studentId}). Skipping participation update.`);
      return;
    }

    let rawRatingHistory: any[] = [];
    // --- Update Rating History ---
    try {
      const cfRatingResponse = await fetch(`https://codeforces.com/api/user.rating?handle=${codeforcesHandle}`);
      if (cfRatingResponse.ok) {
        const { result: ratingHistory } = (await cfRatingResponse.json()) as any;
        rawRatingHistory = ratingHistory;
        if (ratingHistory && ratingHistory.length > 0) {
          student.ratingHistory = ratingHistory.map((h: any) => ({
            contestId: h.contestId.toString(),
            contestName: h.contestName,
            rating: h.newRating,
            change: h.newRating - h.oldRating,
            timestamp: new Date(h.ratingUpdateTimeSeconds * 1000),
          }));
          const latestRating = ratingHistory[ratingHistory.length - 1];
          student.currentRating = latestRating.newRating;
        } else {
          student.ratingHistory = [];
          student.currentRating = 0;
        }
      }
    } catch (ratingError) {
      console.error(`Error fetching rating history for ${codeforcesHandle}:`, ratingError);
    }

    // --- Update Problems Solved ---
    try {
      const today = new Date();
      const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
      const startOfLastWeek = subWeeks(startOfCurrentWeek, 1);

      const cfSubmissionsResponse = await fetch(`https://codeforces.com/api/user.status?handle=${codeforcesHandle}&from=1&count=200`);
      if (cfSubmissionsResponse.ok) {
        const { result: submissions } = (await cfSubmissionsResponse.json()) as any;
        if (submissions && submissions.length > 0) {
          const solvedProblemsThisWeekSet = new Set<string>();
          const solvedProblemsLastWeekSet = new Set<string>();

          submissions.forEach((submission: any) => {
            const submissionTime = new Date(submission.creationTimeSeconds * 1000);
            const problemIdentifier = `${submission.problem.contestId}-${submission.problem.index}`;

            if (submission.verdict === "OK" && submission.problem && submission.problem.contestId && submission.problem.index) {
              if (isWithinInterval(submissionTime, { start: startOfCurrentWeek, end: today })) {
                solvedProblemsThisWeekSet.add(problemIdentifier);
              } else if (isWithinInterval(submissionTime, { start: startOfLastWeek, end: subDays(startOfCurrentWeek, 1) })) {
                solvedProblemsLastWeekSet.add(problemIdentifier);
              }
            }
          });
          student.problemsSolvedThisWeek = solvedProblemsThisWeekSet.size;
          student.problemsSolvedLastWeek = solvedProblemsLastWeekSet.size;
        }
      }
    } catch (problemsSolvedError) {
      console.error(`Error calculating weekly problems solved for ${codeforcesHandle}:`, problemsSolvedError);
    }

    // --- Update Contest Participation ---
    const participatedContestIds = new Set<string>();
    rawRatingHistory.forEach(entry => {
        participatedContestIds.add(entry.contestId.toString());
    });

    const newParticipation = Array.from(participatedContestIds).map((contestId) => ({
      contestId,
      participated: true,
    }));
    
    student.contestParticipation = newParticipation;
    student.totalContestsGiven = newParticipation.length;
    await student.save();
  } catch (error) {
    console.error(`Error in updateStudentParticipation for student ID ${studentId}:`, error);
  }
}

// Seamless Batch sync for ALL students (highly optimized to prevent Codeforces throttling)
export async function syncAllStudentsBatch() {
  await dbConnect();

  try {
    // 1. Fetch all students with handles
    const students = await Student.find({ codeforcesHandle: { $exists: true, $ne: null } });
    if (students.length === 0) {
      console.log("No students with Codeforces handles found to sync.");
      return;
    }

    const handles = students.map(s => s.codeforcesHandle).filter(Boolean) as string[];
    console.log(`Starting optimized batch sync for handles: ${handles.join(', ')}`);

    // 2. Fetch current ratings in a single batch request (user.info)
    try {
      const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${handles.join(';')}`);
      if (infoRes.ok) {
        const { result: usersInfo } = (await infoRes.json()) as any;
        const infoMap = new Map<string, any>(usersInfo.map((u: any) => [u.handle.toLowerCase(), u]));

        for (const student of students) {
          const info = infoMap.get(student.codeforcesHandle!.toLowerCase());
          if (info) {
            student.currentRating = info.rating || 0;
            if (student.ratingHistory.length === 0 && info.rating) {
              student.ratingHistory = [{
                contestId: "initial",
                contestName: "Current Codeforces Rating",
                rating: info.rating,
                change: 0,
                timestamp: new Date()
              }];
            }
          }
        }
        console.log("Updated all student ratings via batch user.info call.");
      }
    } catch (error) {
      console.error("Error fetching user info in batch:", error);
    }

    // 3. Fetch latest finished Codeforces contests
    let contests: any[] = [];
    try {
      const listRes = await fetch('https://codeforces.com/api/contest.list?gym=false');
      if (listRes.ok) {
        const { result } = (await listRes.json()) as any;
        contests = result
          .filter((c: any) => c.phase === 'FINISHED')
          .sort((a: any, b: any) => b.startTimeSeconds - a.startTimeSeconds)
          .slice(0, 15); // Sync last 15 contests
      }
    } catch (error) {
      console.error("Error fetching contest list:", error);
    }

    if (contests.length > 0) {
      const participationMap = new Map<string, Set<string>>();
      for (const handle of handles) {
        participationMap.set(handle.toLowerCase(), new Set<string>());
      }

      // Query standings for each of the last 15 contests
      for (const contest of contests) {
        try {
          // Delay to stay rate limit friendly (Codeforces limit is 1 req per 2s, but standings with handle filters is light)
          await new Promise(resolve => setTimeout(resolve, 350));

          const standingsRes = await fetch(
            `https://codeforces.com/api/contest.standings?contestId=${contest.id}&handles=${handles.join(';')}&showUnofficial=true`
          );

          if (standingsRes.ok) {
            const { result } = (await standingsRes.json()) as any;
            if (result && result.rows) {
              for (const row of result.rows) {
                for (const member of row.party.members) {
                  const memberHandle = member.handle.toLowerCase();
                  if (participationMap.has(memberHandle)) {
                    participationMap.get(memberHandle)!.add(contest.id.toString());
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching standings for contest ${contest.id}:`, error);
        }
      }

      // Merge and update student contestParticipation
      for (const student of students) {
        const studentHandle = student.codeforcesHandle!.toLowerCase();
        const participatedSet = participationMap.get(studentHandle);
        if (participatedSet) {
          const existingParticipation = student.contestParticipation || [];
          const existingMap = new Map(existingParticipation.map((p: any) => [p.contestId, p.participated]));

          for (const contestId of participatedSet) {
            existingMap.set(contestId, true);
          }

          student.contestParticipation = Array.from(existingMap.entries()).map(([contestId, participated]) => ({
            contestId,
            participated
          }));
          student.totalContestsGiven = student.contestParticipation.filter((p: any) => p.participated).length;
        }
      }
      console.log("Updated all student attendance records via batch standings calls.");
    }

    // 4. Fetch submissions sequentially with a rate-limit safe delay for weekly problems solved
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const startOfLastWeek = subWeeks(startOfCurrentWeek, 1);

    for (const student of students) {
      try {
        await new Promise(resolve => setTimeout(resolve, 400));
        const handle = student.codeforcesHandle;
        const cfSubmissionsResponse = await fetch(
          `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=250`
        );

        if (cfSubmissionsResponse.ok) {
          const { result: submissions } = (await cfSubmissionsResponse.json()) as any;
          if (submissions && submissions.length > 0) {
            const solvedProblemsThisWeekSet = new Set<string>();
            const solvedProblemsLastWeekSet = new Set<string>();

            submissions.forEach((submission: any) => {
              const submissionTime = new Date(submission.creationTimeSeconds * 1000);
              const problemIdentifier = `${submission.problem.contestId}-${submission.problem.index}`;

              if (submission.verdict === "OK" && submission.problem && submission.problem.contestId && submission.problem.index) {
                if (isWithinInterval(submissionTime, { start: startOfCurrentWeek, end: today })) {
                  solvedProblemsThisWeekSet.add(problemIdentifier);
                } else if (isWithinInterval(submissionTime, { start: startOfLastWeek, end: subDays(startOfCurrentWeek, 1) })) {
                  solvedProblemsLastWeekSet.add(problemIdentifier);
                }
              }
            });

            student.problemsSolvedThisWeek = solvedProblemsThisWeekSet.size;
            student.problemsSolvedLastWeek = solvedProblemsLastWeekSet.size;
          }
        }
      } catch (e) {
        console.error(`Error fetching weekly submissions for ${student.codeforcesHandle}:`, e);
      }

      await student.save();
    }
    console.log("Batch sync completed successfully.");
  } catch (error) {
    console.error("Critical error in syncAllStudentsBatch:", error);
  }
}
