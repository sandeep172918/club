
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

    return NextResponse.json({ success: true, data: updatedStudent });
  } catch (error) {
    console.error("Error in /api/students/[id]/update-participation:", error);
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
