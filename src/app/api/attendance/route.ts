
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { format } from 'date-fns';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Fetch all students and all contests
    const allContests = await db.collection('contests').find({}).sort({ startTimeSeconds: -1 }).toArray();
    const allStudents = await db.collection('students').find({}).project({ _id: 1, name: 1, ratingHistory: 1 }).sort({ name: 1 }).toArray();

    // 1. Headers are now students
    const headers = allStudents.map(s => ({
        id: s._id.toString(),
        name: s.name,
    }));

    // Create a map of studentId -> Set of participated contestIds for efficient lookup
    const studentParticipationMap = new Map<string, Set<string>>();
    allStudents.forEach(student => {
        const participatedIds = new Set(student.ratingHistory?.map(rh => rh.contestId) || []);
        studentParticipationMap.set(student._id.toString(), participatedIds);
    });

    // 2. Rows are now contests
    const rows = allContests.map(contest => {
        const contestId = contest.id.toString();
        // For each contest, build an attendance array by checking each student
        const attendance = headers.map(studentHeader => {
            const studentParticipatedIds = studentParticipationMap.get(studentHeader.id);
            return studentParticipatedIds ? studentParticipatedIds.has(contestId) : false;
        });

        return {
            id: contestId,
            name: contest.name,
            date: format(new Date(contest.startTimeSeconds * 1000), 'MMM dd, yyyy'),
            attendance,
        };
    });

    return NextResponse.json({ headers, rows });
  } catch (error: any) {
    console.error('Error fetching attendance data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
