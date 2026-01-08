
import dbConnect from '@/lib/db';
import Topic from '@/models/Topic';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const topics = await Topic.find({});
    return NextResponse.json({ success: true, data: topics });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const topic = await Topic.create(body);
    return NextResponse.json({ success: true, data: topic }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
