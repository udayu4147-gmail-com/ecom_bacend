const Product = require('../models/product');
const shortid = require('shortid');
const slugify = require('slugify');

exports.createProduct = (req, res) => {
  const { name, price, description, category, createdBy } = req.body;
  let productPictures = [];

  if (req.files && req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }


  if (typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid product name' });
  }

  const products = new Product({
    name: name,
    slug: slugify(name),
    price,
    description,
    productPictures,
    category,
    createdBy: req.user._id,
  });

  product.save((error, products) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product });
    }
  });
};
