import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  try {
    const { problemId } = await req.json();
    
    if (!problemId) {
         return NextResponse.json({ success: false, error: 'Problem ID required' }, { status: 400 });
    }

    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }
    
    const isSolved = student.solvedResources?.includes(problemId);
    
    if (isSolved) {
      // Unsolve
      student.solvedResources = student.solvedResources.filter((pid: string) => pid !== problemId);
    } else {
      // Solve
      if (!student.solvedResources) student.solvedResources = [];
      student.solvedResources.push(problemId);
    }
    
    await student.save();
    
    return NextResponse.json({ success: true, data: student.solvedResources });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
