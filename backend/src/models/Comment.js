import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  // Link to the post being commented on
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  // Link to the user who wrote the comment
  authorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Self-reference: Link to another comment for threaded replies
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment', 
    default: null 
  },
  // The actual comment content
  text: { 
    type: String, 
    required: true,
    trim: true 
  }
}, { 
  // Automatically manages createdAt and updatedAt
  timestamps: true 
});

export default mongoose.model('Comment', commentSchema);