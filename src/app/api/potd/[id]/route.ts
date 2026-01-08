import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import POTD from '@/models/POTD';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await params;
    const deletedPOTD = await POTD.findByIdAndDelete(id);

    if (!deletedPOTD) {
      return NextResponse.json({ success: false, error: "POTD not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedPOTD });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await params;
    const body = await req.json();

    const updatedPOTD = await POTD.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPOTD) {
      return NextResponse.json({ success: false, error: "POTD not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedPOTD });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
