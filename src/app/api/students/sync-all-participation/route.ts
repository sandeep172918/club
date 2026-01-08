import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { updateStudentParticipation } from './_utils'; // Assuming a utility to handle the update logic

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const students = await Student.find({});

    const updatePromises = students.map(student =>
      updateStudentParticipation(student._id.toString())
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true, message: 'All students participation updated successfully.' });
  } catch (error) {
    console.error("Error syncing all students participation:", error);
    return NextResponse.json({ success: false, error: 'Failed to sync all students participation.' }, { status: 500 });
  }
}
