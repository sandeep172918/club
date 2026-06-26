import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Club from '@/models/Club';
import Student from '@/models/Student';

export async function GET(req: NextRequest, context: any) {
  const params = await context.params;
  await dbConnect();
  try {
    const club = await Club.findById(params.id).populate('coordinators', 'name email codeforcesHandle');
    if (!club) {
      return NextResponse.json({ success: false, error: 'Club not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: club });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  const params = await context.params;
  await dbConnect();
  try {
    const body = await req.json();
    const club = await Club.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!club) {
      return NextResponse.json({ success: false, error: 'Club not found' }, { status: 404 });
    }

    // If club is being activated, check if there is a pending coordinator request
    if (body.isActive === true && club.requestedCoordinatorEmail) {
      const pendingCoordinator = await Student.findOne({ email: club.requestedCoordinatorEmail });
      if (pendingCoordinator) {
        pendingCoordinator.role = 'coordinator';
        pendingCoordinator.clubId = club._id;
        pendingCoordinator.clubJoinStatus = 'Approved';
        await pendingCoordinator.save();

        // Add to club coordinators list if not already present
        if (!club.coordinators.includes(pendingCoordinator._id as any)) {
          club.coordinators.push(pendingCoordinator._id as any);
          await club.save();
        }
      }
    }

    // Update coordinator roles if coordinators array is updated
    if (body.coordinators) {
      // Demote previous coordinators of this club who are no longer coordinators
      await Student.updateMany(
        { clubId: club._id, role: 'coordinator', _id: { $nin: body.coordinators } },
        { $set: { role: 'member' } }
      );

      // Promote new coordinators
      await Student.updateMany(
        { _id: { $in: body.coordinators } },
        { $set: { role: 'coordinator', clubId: club._id, clubJoinStatus: 'Approved' } }
      );
    }

    return NextResponse.json({ success: true, data: club });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const params = await context.params;
  await dbConnect();
  try {
    const club = await Club.findById(params.id);
    if (!club) {
      return NextResponse.json({ success: false, error: 'Club not found' }, { status: 404 });
    }

    // Reset student fields who belonged to this club
    await Student.updateMany(
      { clubId: club._id },
      { $set: { role: 'student', clubJoinStatus: 'None' }, $unset: { clubId: "" } }
    );

    await Club.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Club deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
