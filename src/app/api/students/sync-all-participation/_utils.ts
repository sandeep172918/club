import Student from '@/models/Student';
import dbConnect from '@/lib/db';
import { startOfWeek, subWeeks, isWithinInterval, subDays } from 'date-fns'; // Import new date-fns functions

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
    // --- Update Rating History (limit to 1 entry) ---
    try {
      const cfRatingResponse = await fetch(`https://codeforces.com/api/user.rating?handle=${codeforcesHandle}`);
      if (cfRatingResponse.ok) {
        const { result: ratingHistory } = await cfRatingResponse.json();
        rawRatingHistory = ratingHistory; // Store raw rating history for participation
        if (ratingHistory && ratingHistory.length > 0) {
          const latestRating = ratingHistory[ratingHistory.length - 1];
          student.ratingHistory = [{
            contestId: latestRating.contestId.toString(),
            contestName: latestRating.contestName,
            rating: latestRating.newRating,
            change: latestRating.newRating - latestRating.oldRating,
            timestamp: new Date(latestRating.ratingUpdateTimeSeconds * 1000),
          }];
          student.currentRating = latestRating.newRating;
        } else {
          student.ratingHistory = [];
          student.currentRating = 0; // Or keep previous if no history
        }
      } else {
        console.warn(`Failed to fetch rating for ${codeforcesHandle}: ${cfRatingResponse.statusText}`);
      }
    } catch (ratingError) {
      console.error(`Error fetching rating history for ${codeforcesHandle}:`, ratingError);
    }

    // --- Update Problems Solved This Week and Last Week ---
    try {
      console.log(`Fetching submissions for ${codeforcesHandle} to calculate weekly problems solved...`);
      const allSubmissions: any[] = [];
      let from = 1;
      const countPerPage = 500; // Fetch 500 submissions at a time

      // Define week intervals
      const today = new Date();
      const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
      const startOfLastWeek = subWeeks(startOfCurrentWeek, 1);
      const endOfLastWeek = subWeeks(startOfCurrentWeek, 0); // End of last week is start of current week - 1ms
      // The interval for "this week" goes up to 'today' (inclusive).
      // The interval for "last week" goes from 'startOfLastWeek' to 'endOfLastWeek - 1ms' (exclusive of current week's start).

      let hasMoreSubmissions = true;

      while (hasMoreSubmissions) {
        const cfSubmissionsResponse = await fetch(`https://codeforces.com/api/user.status?handle=${codeforcesHandle}&from=${from}&count=${countPerPage}`);
        console.log(`Submissions response status for ${codeforcesHandle} (from=${from}): ${cfSubmissionsResponse.status}`);
        if (!cfSubmissionsResponse.ok) {
          console.warn(`Failed to fetch Codeforces submissions for ${codeforcesHandle} (from=${from}). Skipping problem count update.`);
          break; // Exit loop if fetching fails
        }
        const { result: submissionsBatch } = await cfSubmissionsResponse.json();

        if (!submissionsBatch || submissionsBatch.length === 0) {
          break; // No more submissions
        }

        allSubmissions.push(...submissionsBatch);
        from += countPerPage; // Prepare for next batch

        // Optimization: stop fetching if submissions are older than last two weeks
        const oldestSubmissionTime = submissionsBatch[submissionsBatch.length - 1].creationTimeSeconds * 1000;
        if (oldestSubmissionTime < startOfLastWeek.getTime()) {
            hasMoreSubmissions = false; // Stop if the oldest submission in the batch is older than the start of last week
        }
        if (submissionsBatch.length < countPerPage) {
          hasMoreSubmissions = false; // Last batch was smaller, so no more submissions
        }
      }

      const solvedProblemsThisWeekSet = new Set<string>(); // Stores "contestId-problemIndex"
      const solvedProblemsLastWeekSet = new Set<string>(); // Stores "contestId-problemIndex"

      allSubmissions.forEach(submission => {
        const submissionTime = new Date(submission.creationTimeSeconds * 1000);
        const problemIdentifier = `${submission.problem.contestId}-${submission.problem.index}`;

        if (submission.verdict === "OK" && submission.problem && submission.problem.contestId && submission.problem.index) {
          if (isWithinInterval(submissionTime, { start: startOfCurrentWeek, end: today })) { // This week interval
            solvedProblemsThisWeekSet.add(problemIdentifier);
          } else if (isWithinInterval(submissionTime, { start: startOfLastWeek, end: subDays(startOfCurrentWeek, 1) })) { // Last week interval
            solvedProblemsLastWeekSet.add(problemIdentifier);
          }
        }
      });
      student.problemsSolvedThisWeek = solvedProblemsThisWeekSet.size;
      student.problemsSolvedLastWeek = solvedProblemsLastWeekSet.size;
      console.log(`Student ${student.name} problemsSolvedThisWeek set to: ${student.problemsSolvedThisWeek}`);
      console.log(`Student ${student.name} problemsSolvedLastWeek set to: ${student.problemsSolvedLastWeek}`);

    } catch (problemsSolvedError) {
      console.error(`Error calculating weekly problems solved for ${codeforcesHandle}:`, problemsSolvedError);
    }

    // --- Update Contest Participation using rawRatingHistory ---
    const participatedContestIds = new Set<string>();
    rawRatingHistory.forEach(entry => {
        participatedContestIds.add(entry.contestId.toString());
    });

    const newParticipation: { contestId: string; participated: boolean }[] = Array.from(participatedContestIds).map(
      (contestId) => ({
        contestId,
        participated: true,
      })
    );
    
    student.contestParticipation = newParticipation;
    student.totalContestsGiven = newParticipation.length;
    await student.save();
    console.log(`Updated participation for student: ${student.name}. Total contests: ${student.totalContestsGiven}`);
  } catch (error) {
    console.error(`Error in updateStudentParticipation for student ID ${studentId}:`, error);
  }
}
