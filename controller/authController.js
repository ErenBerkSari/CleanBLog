const Auth = require('../models/Auth.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await Auth.findOne({ email });

    if (user) {
      req.flash('error', `Bu email hesabı zaten bulunmakta!`);
      return res.status(400).redirect('/register');
    }

    if (password.length < 6) {
      req.flash('error', `Parolanız en az 6 karakter olmalı!`);
      return res.status(400).redirect('/register');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await Auth.create({
      username,
      email,
      password: passwordHash,
    });

    // Kayıttan sonra giriş işlemi için yönlendirme
    res.status(201).redirect('/login');
  } catch (error) {
    req.flash('error', `Bir şeyler oldu! ${err}`);
    res.status(500).redirect('/register');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Auth.findOne({ email });

    if (!user) {
      req.flash('error', `Böyle bir kullanıcı bulunamadı!`);
      return res.status(400).redirect('/login');
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      req.flash('error', `Yanlış şifre!`);
      return res.status(400).redirect('/login');
    }

    // Kullanıcı oturumu başlat
    req.session.userID = user._id;

    // Token oluştur
    const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, {
      expiresIn: '1h',
    });

    // Token'ı cookie'ye yerleştir
    res.cookie('token', token, { httpOnly: true });

    // Token'ı döndür (veya yönlendirme yapabilirsiniz)

    return res.status(200).redirect('/dashboard');
  } catch (error) {
    req.flash('error', `Bir şeyler oldu! ${err}`);
    res.status(500).redirect('/login');
  }
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).redirect('/');
    }
    res.clearCookie('token');
    res.redirect('/');
  });
};

const deleteUser = async (req, res) => {
  try {
    const user = await Auth.findById(req.params.id);

    if (!user) {
      req.flash('error', 'Kullanıcı bulunamadı.');
      return res.status(404).redirect('/dashboard');
    }

    // Kullanıcıyı sil
    await Auth.findByIdAndDelete(req.params.id);

    // Kullanıcıya ait postları sil

    res.status(200).redirect('/dashboard');
  } catch (error) {
    req.flash('error', `Bir şeyler oldu! ${error.message}`);
    res.status(500).redirect('/dashboard');
  }
};

module.exports = { register, login, logoutUser, deleteUser };
