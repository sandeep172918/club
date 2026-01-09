
import mongoose from 'mongoose';

const TrickSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 200,
  },
  author: {
    type: String, // You might want to store User ID or Name
    required: true,
  },
  authorRole: {
    type: String,
    enum: ['admin', 'student'],
    required: true,
  },
  status: {
    type: String,
    enum: ['approved', 'pending'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Trick || mongoose.model('Trick', TrickSchema);
