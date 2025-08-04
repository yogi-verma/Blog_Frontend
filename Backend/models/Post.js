const mongoose = require('mongoose');



const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminResponse: {
    type: String,
    trim: true,
    maxlength: [500, 'Admin response cannot exceed 500 characters']
  }
}, {
  timestamps: true
});




const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    trim: true,
    maxlength: [200, 'Excerpt cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    default: 'Admin'
  },
  readTime: {
    type: Number,
    required: true,
    min: [3, 'Read time must be at least 3 minutes'],
    max: [10, 'Read time cannot exceed 10 minutes']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Development',
      'Design',
      'DevOps',
      'Data Science',
      'Machine Learning',
      'Cybersecurity',
      'Blockchain',
      'Mobile Development',
      'Web Development',
      'Cloud Computing'
    ]
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  featuredImage: {
    type: String
  },
  tags: {
    type: [String]
  },
  views:{
    type: Number,
    default: 0
  },
  comments: [commentSchema]
}, {
  timestamps: true
});

// Create text index for search functionality
postSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);