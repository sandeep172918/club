
import mongoose from 'mongoose';

const ClubContestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  date: {
    type: String, // ISO date string
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

export default mongoose.models.ClubContest || mongoose.model('ClubContest', ClubContestSchema);
