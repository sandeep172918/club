import mongoose from 'mongoose';

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false, // Optional, can derive from link or user input
  },
  link: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  kind: {
    type: String,
    enum: ['Standard', 'Tricky', 'Decomposer'],
    required: true,
  },
  description: {
    type: String,
    maxlength: 200,
    required: false,
  },
  contributor: {
    type: String,
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

export default mongoose.models.Problem || mongoose.model('Problem', ProblemSchema);