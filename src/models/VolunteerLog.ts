import mongoose from 'mongoose';

const VolunteerLogSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

if (mongoose.models && mongoose.models.VolunteerLog) {
  delete mongoose.models.VolunteerLog;
}

export default mongoose.models.VolunteerLog || mongoose.model('VolunteerLog', VolunteerLogSchema);
