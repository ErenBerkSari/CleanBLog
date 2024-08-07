const jwt = require('jsonwebtoken');
const Auth = require('../models/Auth'); // Kullanıcı modelinizin yolu

const authMiddlewares = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
      return res.status(401).redirect('login');
    }

    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const user = await Auth.findById(decoded.id);

    if (!user) {
      return res.status(401).redirect('login');
    }

    req.user = user; // Kullanıcı bilgilerini req.user'e ekleyin
    next();
  } catch (error) {
    return res.status(401).redirect('login');
  }
};

module.exports = authMiddlewares;
