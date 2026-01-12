import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    maxlength: 500,
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'urgent'],
    default: 'info',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String, // Store admin name or ID
  },
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
