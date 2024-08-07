const express = require('express');
const {
  register,
  login,
  logoutUser,
  deleteUser,
} = require('../controller/authController.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logoutUser);
router.delete('/:id', deleteUser);

module.exports = router;
