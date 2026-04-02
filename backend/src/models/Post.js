import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  // Required text content for the post
  text: { 
    type: String, 
    trim: true,
    default: ""
  },
  // Array of attachment objects to support multiple files
  attachments: [{
    fileName: { type: String },
    fileUrl: { type: String },
    fileType: { type: String }, // e.g., "image/png", "application/pdf"
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now }
  }],
  // Statistics for "Popular Resources" logic
  viewCount: { 
    type: Number, 
    default: 0 
  },
  downloadCount: { 
    type: Number, 
    default: 0 
  },
  // Link to the specific Hub (Course) this post belongs to
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  // Link to the user who wrote the post
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  replies: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { 
  // Automatically creates createdAt and updatedAt fields
  timestamps: true 
});

export default mongoose.model('Post', postSchema);