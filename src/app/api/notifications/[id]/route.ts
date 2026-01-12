import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

export async function PUT(
  req: NextRequest,
  context: any
) {
  const params = await context.params;
  await dbConnect();
  try {
    const body = await req.json();
    const notification = await Notification.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!notification) {
      return NextResponse.json({ success: false, error: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: any
) {
  const params = await context.params;
  await dbConnect();
  try {
    const notification = await Notification.findByIdAndDelete(params.id);
    if (!notification) {
      return NextResponse.json({ success: false, error: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
