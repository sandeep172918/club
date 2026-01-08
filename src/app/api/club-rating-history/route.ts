import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { eachDayOfInterval, format, subDays } from 'date-fns';

export async function GET() {
  await dbConnect();

  try {
    const students = await Student.find({});

    const today = new Date();
    const dates: Date[] = [];

    // Generate 20 dates with 15-day gaps, going backward from today
    for (let i = 0; i < 20; i++) {
      dates.push(subDays(today, i * 15));
    }
    // Sort dates in ascending order for the graph's X-axis
    dates.sort((a, b) => a.getTime() - b.getTime());

    const ratingHistoryData = [];

    for (const date of dates) {
      let totalRating = 0;
      let ratedStudentsCount = 0;

      for (const student of students) {
        // Find the rating closest to or before the current 'date'
        // Filter out entries where contestName is undefined or null
        const relevantRatings = student.ratingHistory
            .filter((rh: { timestamp: Date; contestName: string | null }) => rh.timestamp <= date && rh.contestName !== undefined && rh.contestName !== null)
            .sort((a: { timestamp: Date }, b: { timestamp: Date }) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort descending by timestamp

        if (relevantRatings.length > 0) {
          totalRating += relevantRatings[0].rating;
          ratedStudentsCount++;
        }
      }

      const averageRating = ratedStudentsCount > 0 ? totalRating / ratedStudentsCount : 0;
      ratingHistoryData.push({
        date: format(date, 'MMM dd'),
        averageRating: Math.round(averageRating),
      });
    }

    return NextResponse.json({ success: true, data: ratingHistoryData });
  } catch (error) {
    console.error("Error fetching overall rating history:", error);
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
