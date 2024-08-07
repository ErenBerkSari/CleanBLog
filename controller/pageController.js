const Post = require('../models/Post');
const User = require('../models/Auth');
const Category = require('../models/Category');

exports.getIndexPage = async (req, res) => {
  const { page = 1, limit = 5 } = req.query; // Default olarak 1. sayfa ve 5 post gösterilecek
  const categoryId = req.query.categories; // Kullanıcının seçtiği kategori ID'si

  try {
    let filter = {};
    if (categoryId) {
      // Kategori ID'sini doğrulayın ve filtreyi buna göre güncelleyin
      const category = await Category.findById(categoryId);
      if (category) {
        filter = { category: category._id };
      } else {
        // Kategori bulunamadıysa, boş bir filtre kullanarak tüm postları getirin
        filter = {};
      }
    }

    // Kategoriler ve postları al
    const categories = await Category.find();
    const posts = await Post.find(filter)
      .sort('-dateCreated')
      .populate('user', 'username')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(filter);

    res.status(200).render('index', {
      page_name: 'index',
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAboutPage = async (req, res) => {
  res.status(200).render('about', {
    page_name: 'about',
  });
};

exports.getPostPage = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('add_post', { categories });
  } catch (error) {
    req.flash('error', `Bir şeyler oldu! ${error.message}`);
    res.status(500).redirect('/');
  }
};

exports.getLoginPage = async (req, res) => {
  res.status(200).render('login', {
    page_name: 'login',
  });
};

exports.getRegisterPage = async (req, res) => {
  res.status(200).render('register', {
    page_name: 'register',
  });
};

exports.getDashboardPage = async (req, res) => {
  try {
    const users = await User.find();
    const categories = await Category.find();
    const user = await User.findById(req.user._id).populate('posts');
    const posts = await Post.find({ author: req.user._id }); // `author` post modelinizdeki yazar alanı ise

    res.status(200).render('dashboard', {
      page_name: 'dashboard',
      user,
      posts,
      users,
      categories,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Bir hata oluştu' });
  }
};
