
import dbConnect from '@/lib/db';
import Trick from '@/models/Trick';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  try {
    const query = status ? { status } : {};
    const tricks = await Trick.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: tricks });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    // Validate character limit backend side as well
    if (body.description.length > 200) {
        return NextResponse.json({ success: false, error: "Description exceeds 200 characters" }, { status: 400 });
    }

    const trick = await Trick.create(body);
    return NextResponse.json({ success: true, data: trick }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
