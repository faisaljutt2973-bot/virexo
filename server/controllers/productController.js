import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js'; // must be imported so .populate('reviews') can resolve the model
import { importFakeStoreProducts } from '../services/fakeStoreService.js';

export const getAllProducts = async (req, res) => {
  try {
    const { search, category, isFeatured, isNew, onSale, minPrice = 0, maxPrice = 999999, sort = 'newest', limit = 20, page = 1 } = req.query;
    
    let query = {};

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter (accepts either a valid ObjectId or a category name)
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const categoryDoc = await Category.findOne({ name: category });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        } else {
          // Unknown category name -> no results, but don't crash
          return res.status(200).json({
            success: true,
            products: [],
            totalProducts: 0,
            totalPages: 0,
            currentPage: parseInt(page) || 1,
          });
        }
      }
    }

    // Price filter
    query.price = { $gte: minPrice, $lte: maxPrice };

    // Featured / New Arrivals filters
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }
    if (isNew === 'true') {
      query.isNew = true;
    }
    if (onSale === 'true') {
      query.discountPrice = { $exists: true, $ne: null, $gt: 0 };
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price-low':
        sortObj = { price: 1 };
        break;
      case 'price-high':
        sortObj = { price: -1 };
        break;
      case 'rating':
        sortObj = { rating: -1 };
        break;
      case 'popular':
        sortObj = { isBestSeller: -1, rating: -1 };
        break;
      case 'newest':
      default:
        sortObj = { createdAt: -1 };
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .populate('category')
      .sort(sortObj)
      .limit(limitNum)
      .skip(skip);

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const product = await Product.findById(req.params.id).populate('category').populate('reviews');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, discountPrice, category, brand, images, sizes, colors, stock, rating } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      discountPrice,
      category,
      brand,
      images,
      sizes,
      colors,
      stock,
      rating,
      source: 'internal',
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const importProducts = async (req, res) => {
  try {
    const result = await importFakeStoreProducts();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};