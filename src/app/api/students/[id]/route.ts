
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { StudentSchema } from '@/lib/models';
import { ObjectId } from 'mongodb';

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await Promise.resolve(context.params);
    const body = await req.json();

    const { secretCode, ...updateData } = body;

    if (!secretCode) {
      return NextResponse.json({ message: 'Secret code is required.' }, { status: 401 });
    }

    const validation = StudentSchema.partial().safeParse(updateData);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input.', errors: validation.error.issues }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const student = await db.collection('students').findOne({ _id: new ObjectId(id) });

    if (!student) {
      return NextResponse.json({ message: 'Student not found.' }, { status: 404 });
    }

    if (student.secretCode !== secretCode) {
      return NextResponse.json({ message: 'Invalid secret code.' }, { status: 401 });
    }

    const result = await db.collection('students').updateOne(
      { _id: new ObjectId(id) },
      { $set: validation.data }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Student not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await Promise.resolve(context.params);
    const { secretCode } = await req.json();

    if (!secretCode) {
      return NextResponse.json({ message: 'Secret code is required.' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const student = await db.collection('students').findOne({ _id: new ObjectId(id) });

    if (!student) {
      return NextResponse.json({ message: 'Student not found.' }, { status: 404 });
    }

    if (student.secretCode !== secretCode) {
      return NextResponse.json({ message: 'Invalid secret code.' }, { status: 401 });
    }

    const result = await db.collection('students').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Student not found.' }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
