
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { NewStudentSchema } from '@/lib/models';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const studentsFromDb = await db.collection('students').find({}).toArray();
    
    const students = studentsFromDb.map(student => {
      const { _id, ...rest } = student;
      return { id: _id.toString(), ...rest };
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = NewStudentSchema.safeParse(body);

    if (!validation.success) {
      console.error('Validation errors:', validation.error.issues);
      return NextResponse.json({ message: 'Invalid input.', errors: validation.error.issues }, { status: 400 });
    }

    const { name, codeforcesHandle, secretCode } = validation.data;

    const newStudent = {
      name,
      codeforcesHandle,
      secretCode,
      currentRating: 0,
      problemsSolved: 0,
      totalContestsGiven: 0,
      ratingHistory: [],
      contestParticipation: [],
      createdAt: new Date(),
    };

    const { db } = await connectToDatabase();
    const result = await db.collection('students').insertOne(newStudent);
    
    // The insertedId is an ObjectId, so we convert it to a string for the response
    const insertedStudent = { ...newStudent, _id: result.insertedId.toString() };

    return NextResponse.json(insertedStudent, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
