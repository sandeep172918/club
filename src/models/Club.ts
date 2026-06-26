import mongoose from 'mongoose';

const ClubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['official', 'fan'],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  coordinators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
  logo: {
    type: String,
    default: '🏆',
  },
  bannerColor: {
    type: String,
    default: 'linear-gradient(135deg, #1f1f1f 0%, #111 100%)',
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  requestedCoordinatorEmail: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

if (mongoose.models && mongoose.models.Club) {
  delete mongoose.models.Club;
}

export default mongoose.models.Club || mongoose.model('Club', ClubSchema);
