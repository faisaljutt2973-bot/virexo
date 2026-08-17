import 'dotenv/config';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { importFakeStoreProducts } from './services/fakeStoreService.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB connected');

    const result = await importFakeStoreProducts();
    console.log(result);

    await mongoose.disconnect();
    console.log('✓ Done. You can now refresh the Shop page.');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seed failed:', error.message);
    process.exit(1);
  }
};

run();