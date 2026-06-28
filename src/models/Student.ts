
import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  graduatingYear: {
    type: Number,
    required: false,
  },
  role: {
    type: String,
    enum: ['super_admin', 'coordinator', 'member', 'student'],
    default: 'student',
  },
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: false,
  },
  clubJoinStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'None'],
    default: 'None',
  },
  clubs: [
    {
      clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
      },
      status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'None'],
        default: 'None',
      }
    }
  ],
  requestedRole: {
    type: String,
    enum: ['member', 'coordinator'],
    required: false,
  },
  roleRequestStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'None'],
    default: 'None',
  },
  codeforcesHandle: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  currentRating: {
    type: Number,
    default: 0,
  },
  problemsSolvedThisWeek: {
    type: Number,
    default: 0,
  },
  problemsSolvedLastWeek: {
    type: Number,
    default: 0,
  },
  favoriteLanguage: {
    type: String,
  },
  shirtSize: {
    type: String,
  },
  sport: {
    type: String,
  },
  branch: {
    type: String,
  },
  points: {
    type: Number,
    default: 0,
  },
  lastSyncedCodeforces: {
    type: Date,
    default: null,
  },
  solvedPOTDs: [{
    type: String, // Storing POTD IDs
  }],
  solvedResources: [{
    type: String, // Problem IDs from Resources
  }],
  ratingHistory: [
    {
      contestId: String,
      contestName: String,
      rating: Number,
      change: Number,
      timestamp: Date,
    },
  ],
  contestParticipation: [
    {
      contestId: String,
      participated: Boolean,
    },
  ],
});

if (mongoose.models && mongoose.models.Student) {
  delete mongoose.models.Student;
}

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);

