
import mongoose from 'mongoose';

const ContestSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    enum: ['Codeforces', 'CodeChef'],
    required: true,
  },
  date: {
    type: String, // Changed to string to match CodeforcesContest interface
    required: true,
  },
});

export default mongoose.models.Contest || mongoose.model('Contest', ContestSchema);
