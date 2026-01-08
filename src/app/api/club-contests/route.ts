
import dbConnect from '@/lib/db';
import ClubContest from '@/models/ClubContest';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const contests = await ClubContest.find({});
    return NextResponse.json({ success: true, data: contests });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const contest = await ClubContest.create(body);
    return NextResponse.json({ success: true, data: contest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
