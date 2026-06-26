
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import Club from '@/models/Club';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/utils';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { name, email, clubId } = await req.json();


    let student = await Student.findOne({ email }).populate('clubId');

    if (!student) {
      student = await Student.create({
        name,
        email,
        role: 'student',
        clubId: clubId || undefined,
        clubJoinStatus: 'None',
        currentRating: 0,
        ratingHistory: [],
        contestParticipation: [],
      });
    } else if (!student.clubId && clubId) {
      student.clubId = clubId;
      student.clubJoinStatus = 'None';
      await student.save();
    }

    // Check if there is an active club awaiting this user as coordinator
    if (student.role !== 'super_admin') {
      const activeClub = await Club.findOne({ requestedCoordinatorEmail: student.email, isActive: true });
      if (activeClub) {
        student.role = 'coordinator';
        student.clubId = activeClub._id;
        student.clubJoinStatus = 'Approved';
        await student.save();

        if (!activeClub.coordinators.includes(student._id as any)) {
          activeClub.coordinators.push(student._id as any);
          await activeClub.save();
        }
      }
    }

    // Check admin status (keeping existing logic)
    if (
        isAdmin(student.email)
      ) {
        student.role = 'super_admin';
        await student.save();
      }

    // Populate clubId if not already populated
    if (student && !student.populated('clubId')) {
      await student.populate('clubId');
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
