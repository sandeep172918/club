const mongoose = require('mongoose');

// Define inline schemas to avoid TS import issues
const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: ['official', 'fan'], required: true },
  description: { type: String, default: '' },
  coordinators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  logo: { type: String, default: '🏆' },
  bannerColor: { type: String, default: 'linear-gradient(135deg, #1f1f1f 0%, #111 100%)' },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Club = mongoose.models.Club || mongoose.model('Club', ClubSchema);

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['super_admin', 'coordinator', 'member', 'student'], default: 'student' },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  clubJoinStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'None'], default: 'None' },
});

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

async function seed() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Database connected.');

  try {
    // 1. Delete all existing clubs
    console.log('Clearing existing clubs from the database...');
    await Club.deleteMany({});
    console.log('All existing clubs removed.');

    // 2. Define predetermined clubs (Active and Pending)
    const defaultClubs = [
      {
        name: 'Alzheimer Fan Club',
        slug: 'alzheimer-fan-club',
        type: 'fan',
        description: 'A dedicated fan club raising awareness, supporting carers, and promoting brain health.',
        logo: '🧠',
        bannerColor: 'linear-gradient(135deg, #6d28d9 0%, #311042 100%)',
        isActive: true, // starts active
      },
      {
        name: 'Competitive Programming Club',
        slug: 'cp-club',
        type: 'official',
        description: 'The official Competitive Programming club focused on algorithms, data structures, and contests.',
        logo: '🚀',
        bannerColor: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
        isActive: false, // starts pending
      },
      {
        name: 'Web Development Club',
        slug: 'web-dev-club',
        type: 'official',
        description: 'The official Web Development club building real-world applications using modern tech stacks.',
        logo: '💻',
        bannerColor: 'linear-gradient(135deg, #065f46 0%, #022c22 100%)',
        isActive: false, // starts pending
      },
      {
        name: 'AI & Machine Learning Club',
        slug: 'ai-ml-club',
        type: 'official',
        description: 'Exploring neural networks, deep learning, and advanced AI technologies.',
        logo: '🧠',
        bannerColor: 'linear-gradient(135deg, #581c87 0%, #1e1b4b 100%)',
        isActive: false, // starts pending
      },
      {
        name: 'Codeforces Fanatics',
        slug: 'cf-fanatics',
        type: 'fan',
        description: 'A fan club for active Codeforces participants to discuss problems and host virtual runs.',
        logo: '🏆',
        bannerColor: 'linear-gradient(135deg, #b91c1c 0%, #450a0a 100%)',
        isActive: false, // starts pending
      },
      {
        name: 'CP.cpp Lovers',
        slug: 'cpcpp-lovers',
        type: 'fan',
        description: 'Fans of the CP.cpp platform sharing tricks and tips.',
        logo: '❤️',
        bannerColor: 'linear-gradient(135deg, #db2777 0%, #500724 100%)',
        isActive: false, // starts pending
      }
    ];

    const createdClubs = [];
    for (const clubData of defaultClubs) {
      const club = await Club.create(clubData);
      console.log(`Created club: ${club.name} (Active: ${club.isActive})`);
      createdClubs.push(club);
    }

    // 3. Update admin user role to super_admin
    const adminEmails = [process.env.ADMIN_EMAIL_ID_1, process.env.ADMIN_EMAIL_ID_2].filter(Boolean);
    console.log('Admin emails:', adminEmails);
    
    if (adminEmails.length > 0) {
      const updateResult = await Student.updateMany(
        { email: { $in: adminEmails } },
        { $set: { role: 'super_admin' }, $unset: { clubId: "" } }
      );
      console.log(`Updated admin roles:`, updateResult);
    }

    // 4. Assign all regular students to Alzheimer Fan Club (the active one)
    const alzClub = createdClubs.find(c => c.slug === 'alzheimer-fan-club');
    if (alzClub) {
      const students = await Student.find({});
      console.log(`Updating ${students.length} students...`);
      for (const student of students) {
        if (student.role !== 'super_admin') {
          student.clubId = alzClub._id;
          student.clubJoinStatus = 'Approved';
          student.role = 'member';
          await student.save();
          console.log(`Assigned student ${student.name} to Alzheimer Fan Club`);
        }
      }
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
}

seed();
