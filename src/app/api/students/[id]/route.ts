import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import fetch from 'node-fetch';
import { isAdmin } from '@/lib/utils';

export async function GET(
  req: NextRequest,
  context: any
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
    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  context: any
) {
  const params = await context.params;
  await dbConnect();

  try {
    const body = await req.json();

    // Check for Immutability of Codeforces Handle
    if (body.codeforcesHandle) {
        const currentStudent = await Student.findById(params.id);

        if (currentStudent && currentStudent.codeforcesHandle && currentStudent.codeforcesHandle !== body.codeforcesHandle) {
             // Basic protection: If handle is set, it cannot be changed via this generic update route.
             // This satisfies "once entered it can't be further changed".
             // (Admin override would need a separate secure route or auth check here)
             return NextResponse.json(
                { success: false, error: 'Codeforces handle cannot be changed once set.' },
                { status: 403 }
            );
        }
        
        const handle = body.codeforcesHandle;
        
        // Check if handle is already taken by another user (excluding self)
        const existingUser = await Student.findOne({ codeforcesHandle: handle });
        if (existingUser && existingUser._id.toString() !== params.id) {
             return NextResponse.json(
                { success: false, error: 'Codeforces handle already registered by another user.' },
                { status: 400 }
            );
        }

        try {
            const cfResponse = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
            const cfData = await cfResponse.json() as any;

            if (cfData.status !== "OK") {
                 return NextResponse.json(
                    { success: false, error: `Invalid Codeforces handle: ${cfData.comment || 'Unknown error'}` },
                    { status: 400 }
                );
            }
            // Optional: Update currentRating from the API response immediately
            // if (cfData.result && cfData.result[0]) {
            //     body.currentRating = cfData.result[0].rating || 0;
            // }

        } catch (cfError) {
             return NextResponse.json(
                { success: false, error: 'Failed to verify Codeforces handle. Service might be down.' },
                { status: 500 }
            );
        }
    }

    const student = await Student.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }
    
    // Re-check admin status just in case handle changed
    if (
        isAdmin(student.email)
    ) {
        student.role = 'admin';
        await student.save();
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: any
) {
  const params = await context.params;
  await dbConnect();

  try {
    const deletedStudent = await Student.deleteOne({ _id: params.id });
    if (!deletedStudent || deletedStudent.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}