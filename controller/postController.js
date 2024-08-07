const Post = require('../models/Post');
const User = require('../models/Auth');
const Category = require('../models/Category');

exports.createPost = async (req, res) => {
  try {
    console.log('Received categoryID:', req.body.categoryID); // Kategori ID'sini kontrol edin

    const user = await User.findById(req.session.userID);
    if (!user) {
      req.flash('error', `Kullanıcı bulunamadı!`);
      return res.status(404).redirect('/login');
    }

    const category = await Category.findById(req.body.categoryID);
    if (!category) {
      req.flash('error', 'Kategori bulunamadı!');
      return res.status(404).redirect('/add_post');
    }

    const post = await Post.create({
      title: req.body.title,
      detail: req.body.detail,
      user: user._id,
      category: category._id,
    });

    user.posts.push(post._id); // Yeni oluşturulan postun ID'sini ekleyin
    await user.save(); // Kullanıcıyı kaydedin

    res.redirect('/');
  } catch (error) {
    // Değişiklik
    req.flash('error', `Bir şeyler oldu! ${error}`); // Değişiklik
    res.status(500).redirect('/add_post');
  }
};

exports.getOnePostPage = async (req, res) => {
  const post = await Post.findById(req.params._id);
  res.status(200).render('post', {
    page_name: 'post',
    post,
  });
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params._id });

    if (!post) {
      req.flash('error', `Post bulunamadı!`);
      res.status(500).redirect('/dashboard');
    }

    res.status(200).redirect('/');
  } catch (error) {
    req.flash('error', `Bir şeyler oldu! ${err}`);
    res.status(500).redirect('/dashboard');
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params._id });
    post.title = req.body.title;
    post.detail = req.body.detail;
    post.save();

    res.status(200).redirect('/');
  } catch (error) {
    req.flash('error', `Bir şeyler oldu! ${err}`);
    res.status(500).redirect('/dashboard');
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    // Kullanıcı bilgilerini de postlarla birlikte almak için populate kullanıyoruz
    const posts = await Post.find().populate('user');
    res.status(200).render('index', {
      posts,
    });
  } catch (error) {
    req.flash('error', `Bir şeyler oldu! ${error.message}`);
    res.status(500).redirect('/');
  }
};
