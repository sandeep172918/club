import dbConnect from '@/lib/db';
import Club from '@/models/Club';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

// Get all clubs
export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all');
    
    const filter = all === 'true' ? {} : { isActive: true };
    const clubs = await Club.find(filter).populate('coordinators', 'name email codeforcesHandle');
    return NextResponse.json({ success: true, data: clubs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// Create a new club (Super Admin only check can be reinforced here or client)
export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { name, slug, type, description, logo, bannerColor, coordinators } = body;

    // Check slug uniqueness
    const existing = await Club.findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: false, error: 'A club with this slug already exists' }, { status: 400 });
    }

    const club = await Club.create({
      name,
      slug,
      type,
      description,
      logo,
      bannerColor,
      coordinators: coordinators || [],
    });

    // If coordinators are assigned, update their roles to 'coordinator' and set their clubId
    if (coordinators && coordinators.length > 0) {
      await Student.updateMany(
        { _id: { $in: coordinators } },
        { $set: { role: 'coordinator', clubId: club._id, clubJoinStatus: 'Approved' } }
      );
    }

    return NextResponse.json({ success: true, data: club }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
