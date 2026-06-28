
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const clubId = searchParams.get('clubId');
    const clubJoinStatus = searchParams.get('clubJoinStatus') || (clubId && clubId !== 'all' ? 'Approved' : undefined);

    const filter: any = {};
    if (clubId && clubId !== 'all') {
      if (clubJoinStatus) {
        if (clubJoinStatus === 'Approved') {
          filter.$or = [
            { clubs: { $elemMatch: { clubId: clubId, status: 'Approved' } } },
            { clubId: clubId, role: 'coordinator' }
          ];
        } else {
          filter.clubs = {
            $elemMatch: {
              clubId: clubId,
              status: clubJoinStatus
            }
          };
        }
      } else {
        filter.$or = [
          { "clubs.clubId": clubId },
          { clubId: clubId }
        ];
      }
    } else if (clubJoinStatus) {
      if (clubJoinStatus === 'Approved') {
        filter.$or = [
          { "clubs.status": 'Approved' },
          { role: 'coordinator' }
        ];
      } else {
        filter["clubs.status"] = clubJoinStatus;
      }
    }

    const students = await Student.find(filter).populate('clubs.clubId').populate('clubId');
    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    
    // Check if email or handle already exists
    const existing = await Student.findOne({ 
        $or: [
            { email: body.email }, 
            { codeforcesHandle: body.codeforcesHandle }
        ] 
    });

    if (existing) {
        return NextResponse.json({ 
            success: false, 
            error: "A student with this email or Codeforces handle already exists." 
        }, { status: 400 });
    }

    const student = await Student.create({
        ...body,
        role: 'student', // Default role
        currentRating: 0,
        ratingHistory: [],
        contestParticipation: []
    });
    
    return NextResponse.json({ success: true, data: student }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
