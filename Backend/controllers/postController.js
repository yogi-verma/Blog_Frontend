const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const posts = await Post.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await Post.countDocuments(query);
    
    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private/Admin
exports.createPost = async (req, res) => {
  try {
    const { title, excerpt, content, readTime, category, slug, featuredImage, tags } = req.body;
    
    // Generate a random read time if not provided (between 3-10)
    const calculatedReadTime = readTime || Math.floor(Math.random() * 8) + 3;
    
    const post = new Post({
      title,
      excerpt,
      content,
      readTime: calculatedReadTime,
      category,
      slug,
      featuredImage,
      tags
    });
    
    await post.save();
    
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Slug must be unique' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private/Admin
exports.updatePost = async (req, res) => {
  try {
    const { title, excerpt, content, readTime, category, slug, featuredImage, tags } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.title = title || post.title;
    post.excerpt = excerpt || post.excerpt;
    post.content = content || post.content;
    post.readTime = readTime || post.readTime;
    post.category = category || post.category;
    post.slug = slug || post.slug;
    post.featuredImage = featuredImage || post.featuredImage;
    post.tags = tags || post.tags;
    
    await post.save();
    
    res.json(post);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Slug must be unique' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private/Admin
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await Post.deleteOne({ _id: req.params.id });

    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};


// @desc    Get posts by category
// @route   GET /api/posts/category/:category
// @access  Public
exports.getPostsByCategory = async (req, res) => {
  try {
    const posts = await Post.find({ category: req.params.category }).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get recent posts
// @route   GET /api/posts/recent/:limit?
// @access  Public
exports.getRecentPosts = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;
    const posts = await Post.find().sort({ date: -1 }).limit(limit);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



exports.incrementView = async (req, res) => {
  try {
    const blog = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json({
      message: 'View incremented',
      views: blog.views,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing view', error });
  }
};




exports.getTotalViews = async (req, res) => {
  try {
    const result = await Post.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" }
        }
      }
    ]);

    const total = result[0]?.totalViews || 0;
    res.json({ totalViews: total });
  } catch (error) {
    res.status(500).json({ message: "Error calculating total views", error });
  }
};

exports.getTotalBlogs = async (req, res) => {
  try {
    const count = await Post.countDocuments();
    res.status(200).json({ totalBlogs: count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get count', error });
  }
};


exports.getRelatedBlogs = async (req, res) => {
  try {
    const blogId = req.params.id;
    const currentBlog = await Post.findById(blogId);

    if (!currentBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Find related blogs from the same category, excluding the current blog
    const relatedBlogs = await Post.find({
      category: currentBlog.category,
      _id: { $ne: blogId },
    }).limit(4); // Limit to 4 related blogs

    res.json(relatedBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};