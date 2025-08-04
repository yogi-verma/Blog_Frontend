const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getPostsByCategory,
  getRecentPosts,
  incrementView,
  getTotalViews,
  getTotalBlogs,
  getRelatedBlogs
} = require('../controllers/postController');



router.route('/get-posts')
  .get(getPosts);

router.route('/create-post').post(createPost);

router.route('/post/:id').get(getPost);
router.route('/post/update/:id').put(updatePost);
router.route('/post/delete/:id').delete(deletePost);
router.put('/increment-view/:id', incrementView);
router.get('/total-views', getTotalViews);
router.get('/total-blogs', getTotalBlogs);
router.get('/related/:id', getRelatedBlogs);

// router.route('/post/:id')
//   .get(getPost)
//   .put(updatePost)
//   .delete(deletePost);

// router.route('/post/category/:category')
//   .get(getPostsByCategory);

// router.route('/post/recent/:limit?')
//   .get(getRecentPosts);

module.exports = router;