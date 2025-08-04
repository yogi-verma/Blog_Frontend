const Post = require('../models/Post');

exports.getApprovedCommentsPerBlog = async (req, res) => {
  try {
    const blogs = await Post.find({}, 'title comments');

    const data = blogs.map(blog => ({
      title: blog.title,
      commentCount: blog.comments.filter(c => c.status === 'approved').length
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


// 1. Add a comment (status = pending by default)
exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { name, text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const newComment = { name, text }; // default status = 'pending'
    post.comments.push(newComment);

    await post.save();
    res.status(201).json({ message: 'Comment submitted for approval' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// 2. Get all pending comments (for admin dashboard)
exports.getPendingComments = async (req, res) => {
  try {
    const posts = await Post.find({ "comments.status": "pending" });
    const pendingComments = [];

    posts.forEach(post => {
      post.comments.forEach(comment => {
        if (comment.status === 'pending') {
          pendingComments.push({
            postId: post._id,
            postTitle: post.title,
            commentId: comment._id,
            name: comment.name,
            text: comment.text,
            createdAt: comment.createdAt
          });
        }
      });
    });

    res.status(200).json({ pendingComments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending comments' });
  }
};

// 3. Get approved comments for a post (for frontend)
exports.getApprovedComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const approvedComments = post.comments.filter(c => c.status === 'approved');
    res.status(200).json({ approvedComments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch approved comments' });
  }
};

// 4. Approve a comment
exports.approveComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.status = 'approved';
    await post.save();

    res.status(200).json({ message: 'Comment approved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve comment' });
  }
};

// 5. Reject a comment
exports.rejectComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.status = 'rejected';
    await post.save();

    res.status(200).json({ message: 'Comment rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject comment' });
  }
};


exports.totalComments = async (req, res) => {
  try {
    const result = await Post.aggregate([
      {
        $group: {
          _id: null,
          totalComments: { $sum: { $size: "$comments" } }
        }
      }
    ]);

    const total = result[0]?.totalComments || 0;
    res.json({ totalComments: total });
  } catch (error) {
    res.status(500).json({ message: "Error calculating total comments", error });
  }
};