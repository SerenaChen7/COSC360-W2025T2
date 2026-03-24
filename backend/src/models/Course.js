import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnail: { type: String, default: "" },
  type: { type: String }, // e.g., "300 Level"
  field: { type: String }, // e.g., "Computer Science"
  tags: [String],
  description: { type: String, required: true },
  duration: {
    startDate: { type: Date },
    endDate: { type: Date }
  },
  location: { type: String, required: true },
  positions: [{
    name: String,
    requirementCount: { type: Number, default: 1 },
    description: String,
    skills: [String]
  }],
  applicationDeadline: Date,
  memberCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);