import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // Fetch students sorted by points in descending order.
    // Limit to top 50 or similar to avoid huge payloads if many users.
    const leaderboard = await Student.find({ points: { $gt: 0 } })
                                     .sort({ points: -1 })
                                     .select('name codeforcesHandle points')
                                     .limit(50);
                                     
    return NextResponse.json({ success: true, data: leaderboard });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
