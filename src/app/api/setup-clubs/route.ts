import dbConnect from '@/lib/db';
import Club from '@/models/Club';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    // 1. Create Default Clubs if they don't exist
    const defaultClubs = [
      {
        name: 'Competitive Programming Club',
        slug: 'cp-club',
        type: 'official',
        description: 'The official Competitive Programming club focused on algorithms, data structures, and contests.',
        logo: '🚀',
        bannerColor: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
      },
      {
        name: 'Web Development Club',
        slug: 'web-dev-club',
        type: 'official',
        description: 'The official Web Development club building real-world applications using modern tech stacks.',
        logo: '💻',
        bannerColor: 'linear-gradient(135deg, #065f46 0%, #022c22 100%)',
      },
      {
        name: 'AI & Machine Learning Club',
        slug: 'ai-ml-club',
        type: 'official',
        description: 'Exploring neural networks, deep learning, and advanced AI technologies.',
        logo: '🧠',
        bannerColor: 'linear-gradient(135deg, #581c87 0%, #1e1b4b 100%)',
      },
      {
        name: 'Codeforces Fanatics',
        slug: 'cf-fanatics',
        type: 'fan',
        description: 'A fan club for active Codeforces participants to discuss problems and host virtual runs.',
        logo: '🏆',
        bannerColor: 'linear-gradient(135deg, #b91c1c 0%, #450a0a 100%)',
      },
      {
        name: 'CP.cpp Lovers',
        slug: 'cpcpp-lovers',
        type: 'fan',
        description: 'Fans of the CP.cpp platform sharing tricks and tips.',
        logo: '❤️',
        bannerColor: 'linear-gradient(135deg, #db2777 0%, #500724 100%)',
      }
    ];

    const createdClubs = [];
    for (const clubData of defaultClubs) {
      let club = await Club.findOne({ slug: clubData.slug });
      if (!club) {
        club = await Club.create(clubData);
      }
      createdClubs.push(club);
    }

    // 2. Set admin user role to super_admin
    // The admin emails from process.env are:
    const adminEmails = [process.env.ADMIN_EMAIL_ID_1, process.env.ADMIN_EMAIL_ID_2].filter(Boolean);
    
    let adminUpdated = false;
    if (adminEmails.length > 0) {
      const updateResult = await Student.updateMany(
        { email: { $in: adminEmails } },
        { $set: { role: 'super_admin' } }
      );
      adminUpdated = true;
    }

    // Find a student to make coordinator of the first club for testing, or we'll let it be.
    // If there's any student that is not admin, we can set them to member of the first club
    const cpClub = createdClubs.find(c => c.slug === 'cp-club');
    if (cpClub) {
      // Find all students without a club and set their clubId to CP Club to avoid empty dashboards
      const students = await Student.find({ clubId: { $exists: false } });
      for (const student of students) {
        if (student.role !== 'super_admin') {
          student.clubId = cpClub._id;
          student.clubJoinStatus = 'Approved';
          student.role = 'member';
          await student.save();
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully!',
      clubsCreated: createdClubs.length,
      clubs: createdClubs,
      adminUpdated,
    });
  } catch (error: any) {
    console.error('Setup Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
