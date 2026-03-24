import mongoose from 'mongoose';

const courseMemberSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roleInCourse: { 
    type: String, 
    enum: ['Member', 'Moderator', 'Admin'], 
    default: 'Member' 
  }
}, { timestamps: true });

courseMemberSchema.index({ courseId: 1, userId: 1 }, { unique: true });

export default mongoose.model('CourseMember', courseMemberSchema);