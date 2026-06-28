
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
// import Contest from '@/models/Contest'; // No longer directly used here
import { updateStudentParticipation } from '../../sync-all-participation/_utils'; // Import the utility function

export async function POST(
  req: NextRequest,
  context: any // Temporary workaround for type error
) {
  const params = await context.params;
  await dbConnect();

  try {
    const student = await Student.findById(params.id);
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';

    // Cache Codeforces data for 1 hour to prevent API throttling (unless forced)
    const ONE_HOUR = 60 * 60 * 1000;
    if (!force && student.lastSyncedCodeforces && (Date.now() - new Date(student.lastSyncedCodeforces).getTime() < ONE_HOUR)) {
      return NextResponse.json({ success: true, cached: true, data: student });
    }

    // Use the centralized utility function to update participation
    await updateStudentParticipation(params.id);

    // Fetch the updated student data to return in the response
    const updatedStudent = await Student.findById(params.id);
    if (!updatedStudent) {
      return NextResponse.json(
        { success: false, error: 'Student not found after update' },
        { status: 404 }
      );
    }

    // Update the sync timestamp
    updatedStudent.lastSyncedCodeforces = new Date();
    await updatedStudent.save();

    return NextResponse.json({ success: true, data: updatedStudent });
  } catch (error) {
    console.error("Error in /api/students/[id]/update-participation:", error);
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
