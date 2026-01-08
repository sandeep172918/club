
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ClubContest from '@/models/ClubContest';

export async function DELETE(
  req: NextRequest,
  context: any
) {
  const { params } = context;
  await dbConnect();

  try {
    const deletedContest = await ClubContest.deleteOne({ _id: params.id });
    if (!deletedContest) {
      return NextResponse.json({ success: false, error: 'Contest not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
