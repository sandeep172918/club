import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { syncAllStudentsBatch } from './_utils';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    await syncAllStudentsBatch();
    return NextResponse.json({ success: true, message: 'All students participation updated successfully.' });
  } catch (error: any) {
    console.error("Error syncing all students participation:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
