import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
        price: Number,
        size: String,
        color: String,
      },
    ],
    shippingAddress: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      province: String,
      postalCode: String,
    },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'card'],
      default: 'cash_on_delivery',
    },
    subtotal: Number,
    shipping: Number,
    discount: Number,
    total: Number,
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
