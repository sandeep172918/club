import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import POTD from '@/models/POTD';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await params;
    
    // Increment the editorialRequests count
    const updatedPOTD = await POTD.findByIdAndUpdate(
      id,
      { $inc: { editorialRequests: 1 } },
      { new: true }
    );

    if (!updatedPOTD) {
      return NextResponse.json({ success: false, error: "POTD not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, count: updatedPOTD.editorialRequests });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
