import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');

    const query: any = { points: { $gt: 0 } };

    if (year && year !== 'All') {
        query.email = { $regex: new RegExp(`^${year}.*@iitism\\.ac\\.in$`) };
    }

    // Fetch students sorted by points in descending order.
    // Limit to top 50 or similar to avoid huge payloads if many users.
    const leaderboard = await Student.find(query)
                                     .sort({ points: -1 })
                                     .select('name codeforcesHandle points')
                                     .limit(50);
                                     
    return NextResponse.json({ success: true, data: leaderboard });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
