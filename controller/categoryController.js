const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).redirect('/');
  } catch (error) {
    req.flash('error', `Bir şeyler oldu! ${err}`);
    res.status(500).redirect('/dashboard');
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).redirect('/dashboard');
  } catch (error) {
    req.flash('error', `Bir şeyler oldu! ${error.message}`);
    res.status(500).redirect('/dashboard');
  }
};
