import dbConnect from '@/lib/db';
import Problem from '@/models/Problem';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const problems = await Problem.find({}).sort({ topic: 1, rating: 1 });
    return NextResponse.json({ success: true, data: problems });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    
    // Server-side validation
    if (body.description && body.description.length > 200) {
        return NextResponse.json({ success: false, error: "Description exceeds 200 characters" }, { status: 400 });
    }

    const problem = await Problem.create(body);
    return NextResponse.json({ success: true, data: problem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}