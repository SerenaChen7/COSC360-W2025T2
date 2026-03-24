import mongoose from 'mongoose';

const courseMemberSchema = new mongoose.Schema({
  // Link to the specific course (Hub)
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  // Link to the user who joined
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Roles within the course: Member, Moderator, or Admin
  roleInCourse: { 
    type: String, 
    enum: ['Member', 'Moderator', 'Admin'], 
    default: 'Member' 
  }
}, { 
  // Automatically manages joining date (createdAt) and status updates (updatedAt)
  timestamps: true 
});

// Ensure a user cannot join the same course multiple times
courseMemberSchema.index({ courseId: 1, userId: 1 }, { unique: true });

export default mongoose.model('CourseMember', courseMemberSchema);