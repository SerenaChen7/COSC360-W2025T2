import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  thumbnail: { 
    type: String, 
    default: "" // Stores URL
  },
  type: { 
    type: String, 
    placeholder: "e.g., 300 Level" 
  },
  field: { 
    type: String, 
    placeholder: "e.g., Computer Science" 
  },
  tags: [String],
  description: { 
    type: String, 
    required: true 
  },
  // duration is an object containing startDate and endDate
  duration: {
    startDate: { type: Date },
    endDate: { type: Date }
  },
  location: { 
  type: String, 
  default: "" 
},
  // Array of objects for open roles/positions
  positions: [{
    name: String,
    requirementCount: { type: Number, default: 1 },
    description: String,
    skills: [String]
  }],
  applicationDeadline: { 
    type: Date 
  },
  // Cache field to avoid heavy aggregations during UI rendering
  memberCount: { 
    type: Number, 
    default: 0 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  // Foreign Key: Refers to the User who created this course
  createdBy: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'User', 
  required: false,
  default: null
}
}, { 
  // Automatically adds createdAt and updatedAt fields
  timestamps: true 
});

export default mongoose.model('Course', courseSchema);