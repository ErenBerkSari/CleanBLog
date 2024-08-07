const express = require('express');
const pageController = require('../controller/pageController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares');

router.route('/').get(pageController.getIndexPage);
router.route('/about').get(pageController.getAboutPage);
router.route('/add_post').get(authMiddleware, pageController.getPostPage);
router.route('/login').get(pageController.getLoginPage);
router.route('/register').get(pageController.getRegisterPage);
router.route('/dashboard').get(authMiddleware, pageController.getDashboardPage);

module.exports = router;
