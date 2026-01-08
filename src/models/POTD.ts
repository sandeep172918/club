import mongoose from 'mongoose';

const POTDSchema = new mongoose.Schema({
  problemName: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  needEditorial: {
    type: Boolean,
    default: false,
  },
  solvedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.POTD || mongoose.model('POTD', POTDSchema);
