import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import POTD from '@/models/POTD';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // Fetch active and recent POTDs.
    // We can filter by date if needed, but for now return all or recent ones.
    const potds = await POTD.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: potds });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    // Basic validation could go here
    const potd = await POTD.create(body);
    return NextResponse.json({ success: true, data: potd }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
