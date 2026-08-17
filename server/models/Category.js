import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    icon: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
