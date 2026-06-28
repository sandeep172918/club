
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import Club from '@/models/Club';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/utils';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { name, email, clubId } = await req.json();


    let student = await Student.findOne({ email }).populate('clubId').populate('clubs.clubId');

    if (!student) {
      const targetClub = clubId ? await Club.findById(clubId) : null;
      const isFanClub = targetClub?.type === 'fan';
      const isCoordinatorOfThisClub = targetClub?.requestedCoordinatorEmail === email;
      const initialStatus = isCoordinatorOfThisClub ? 'Approved' : (isFanClub ? 'Approved' : 'None');
      const initialRole = isCoordinatorOfThisClub ? 'coordinator' : (isFanClub ? 'member' : 'student');

      student = await Student.create({
        name,
        email,
        role: initialRole,
        clubId: clubId || undefined,
        clubJoinStatus: initialStatus,
        clubs: clubId ? [{ clubId, status: initialStatus }] : [],
        currentRating: 0,
        ratingHistory: [],
        contestParticipation: [],
      });
    } else {
      // Initialize clubs array if it doesn't exist
      if (!student.clubs) {
        student.clubs = [];
      }

      if (clubId) {
        const targetClub = await Club.findById(clubId);
        const isFanClub = targetClub?.type === 'fan';
        const defaultStatus = isFanClub ? 'Approved' : 'None';
        const isCoordinatorOfThisClub = targetClub?.coordinators 
          ? targetClub.coordinators.map((id: any) => id.toString()).includes(student._id.toString())
          : false;

        // Find if they already have a record for this club
        const clubRecord = student.clubs.find((c: any) => {
          const cid = c.clubId && c.clubId._id ? c.clubId._id.toString() : (c.clubId ? c.clubId.toString() : '');
          return cid === clubId;
        });

        student.clubId = clubId;

        if (isCoordinatorOfThisClub) {
          student.role = 'coordinator';
          student.clubJoinStatus = 'Approved';
          if (clubRecord) {
            clubRecord.status = 'Approved';
          } else {
            student.clubs.push({ clubId, status: 'Approved' });
          }
        } else {
          if (student.role === 'coordinator') {
            student.role = 'member';
          }

          if (clubRecord) {
            if (isFanClub && clubRecord.status !== 'Approved') {
              clubRecord.status = 'Approved';
            }
            student.clubJoinStatus = clubRecord.status;
            if (student.role !== 'super_admin') {
              student.role = clubRecord.status === 'Approved' ? 'member' : 'student';
            }
          } else {
            student.clubs.push({ clubId, status: defaultStatus });
            student.clubJoinStatus = defaultStatus;
            if (student.role !== 'super_admin') {
              student.role = isFanClub ? 'member' : 'student';
            }
          }
        }
        await student.save();
      }
    }

    // Check if there is an active club awaiting this user as coordinator (only if no active club is selected yet)
    if (student.role !== 'super_admin' && !student.clubId) {
      const activeClub = await Club.findOne({ requestedCoordinatorEmail: student.email, isActive: true });
      if (activeClub) {
        student.role = 'coordinator';
        student.clubId = activeClub._id;
        student.clubJoinStatus = 'Approved';
        
        // Sync active club into clubs array
        if (!student.clubs) {
          student.clubs = [];
        }
        const clubRecord = student.clubs.find((c: any) => {
          const cid = c.clubId && c.clubId._id ? c.clubId._id.toString() : (c.clubId ? c.clubId.toString() : '');
          return cid === activeClub._id.toString();
        });
        if (clubRecord) {
          clubRecord.status = 'Approved';
        } else {
          student.clubs.push({ clubId: activeClub._id, status: 'Approved' });
        }
        
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

    // Populate clubId and clubs.clubId if not already populated
    if (student) {
      if (!student.populated('clubId')) {
        await student.populate('clubId');
      }
      if (!student.populated('clubs.clubId')) {
        await student.populate('clubs.clubId');
      }
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
