const express = require('express');
const postController = require('../controller/postController');
const router = express.Router();

// router.route('/post/:id').get(postController.getPostPage);
//router.route('/add').post(postController.createPost);
router.route('/').post(postController.createPost);
router.route('/').get(postController.getAllPosts);
router.route('/:_id').get(postController.getOnePostPage);
router.route('/:_id').delete(postController.deletePost);
router.route('/:_id').put(postController.updatePost);

module.exports = router;
