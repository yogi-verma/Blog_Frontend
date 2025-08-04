const express = require('express');
const router = express.Router();
const {
  addComment,
  getPendingComments,
  getApprovedComments,
  approveComment,
  rejectComment,
  totalComments,
  getApprovedCommentsPerBlog
} = require('../controllers/commentController');
const {protect} = require('../middleware/authMiddleware');

// Add comment to a post
router.post('/:postId', addComment);

// Get all pending comments (admin use)
router.get('/pending-comments',protect, getPendingComments);

// Get all approved comments (frontend display)
router.get('/approved-comments/:postId', getApprovedComments);

// Admin approves a comment
router.patch('/approve/:postId/:commentId',protect, approveComment);

// Admin rejects a comment
router.patch('/reject/:postId/:commentId',protect, rejectComment);

router.get('/total-comments',protect, totalComments);

router.get('/approved-comments-per-blog', getApprovedCommentsPerBlog);


module.exports = router;
