import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    discountPrice: Number,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    brand: String,
    images: [String],
    sizes: [String],
    colors: [String],
    stock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      enum: ['internal', 'fakestoreapi'],
      default: 'internal',
    },
    externalId: String,
  },
  { timestamps: true }
);

// Create text index for search
productSchema.index({ title: 'text', description: 'text', brand: 'text' });

export default mongoose.model('Product', productSchema);
