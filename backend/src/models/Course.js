import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  thumbnail: { type: String, default: "" },
  type: { type: String },
  field: { type: String },
  tags: [String],
  description: { type: String, required: true },
  duration: {
    startDate: { type: Date },
    endDate: { type: Date }
  },
  location: { type: String, default: "" },
  positions: [{
    name: String,
    requirementCount: { type: Number, default: 1 },
    description: String,
    skills: [String]
  }],
  applicationDeadline: { type: Date },
  
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  memberCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false,
    default: null
  }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);