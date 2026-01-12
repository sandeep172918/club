import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    
    // Basic validation (length check is also in schema, but good to check here)
    if (!body.message || body.message.length > 500) {
        return NextResponse.json({ success: false, error: "Message is required and must be under 500 chars" }, { status: 400 });
    }

    const notification = await Notification.create(body);
    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
