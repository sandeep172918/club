
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
    match: /.+\@iitism\.ac\.in$/,
  },
  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student',
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

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
