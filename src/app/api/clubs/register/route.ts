import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Club from '@/models/Club';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { name, email, type } = await req.json();

    if (!name || !email || !type) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and type (official or fan) are required.' },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Check slug uniqueness
    const existing = await Club.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A club with a similar name already exists.' },
        { status: 400 }
      );
    }

    const club = await Club.create({
      name,
      slug,
      type,
      isActive: false, // starts pending/inactive
      requestedCoordinatorEmail: email,
      logo: type === 'official' ? '🚀' : '🧠',
      bannerColor: type === 'official' 
        ? 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)' 
        : 'linear-gradient(135deg, #6d28d9 0%, #311042 100%)',
    });

    return NextResponse.json({ success: true, data: club }, { status: 201 });
  } catch (error: any) {
    console.error("Error registering club:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
