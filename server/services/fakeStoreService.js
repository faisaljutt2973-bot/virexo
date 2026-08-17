import axios from 'axios';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// ---- Source 1: DummyJSON ----
// Pull ALL categories (not just men's) for a general all-products store.
const DUMMY_JSON_API = 'https://dummyjson.com';

// ---- Source 2: Platzi Fake Store API (escuelajs) ----
const PLATZI_API = 'https://api.escuelajs.co/api/v1';
const PLATZI_CATEGORIES = [
  { slug: 'clothes', name: 'Clothes' },
  { slug: 'electronics', name: 'Electronics' },
  { slug: 'furniture', name: 'Furniture' },
  { slug: 'shoes', name: 'Shoes' },
  { slug: 'miscellaneous', name: 'Miscellaneous' },
];
const PLATZI_PAGE_SIZE = 50;
const PLATZI_MAX_PAGES = 4; // up to 200 per category

const getOrCreateCategory = async (name) => {
  let category = await Category.findOne({ name });
  if (!category) {
    category = await Category.create({ name });
  }
  return category;
};

// Turns a DummyJSON category slug like "womens-dresses" into a display
// name like "Women's Dresses".
const prettifyCategoryName = (slug) =>
  slug
    .split('-')
    .map((w) => (w.toLowerCase() === 'mens' ? "Men's" : w.toLowerCase() === 'womens' ? "Women's" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');

const importFromDummyJson = async () => {
  let imported = 0;
  let skipped = 0;

  // Get the full list of categories DummyJSON actually has
  const catRes = await axios.get(`${DUMMY_JSON_API}/products/categories`);
  const allSlugs = (catRes.data || []).map((c) =>
    typeof c === 'string' ? c : c.slug
  );

  for (const slug of allSlugs) {
    const response = await axios.get(
      `${DUMMY_JSON_API}/products/category/${slug}?limit=100`
    );
    const products = response.data.products || [];
    const category = await getOrCreateCategory(prettifyCategoryName(slug));

    for (const product of products) {
      const externalId = `dummyjson-${product.id}`;
      const exists = await Product.findOne({ externalId });
      if (exists) {
        skipped++;
        continue;
      }

      const images =
        product.images && product.images.length > 0
          ? product.images
          : [product.thumbnail];

      await Product.create({
        title: product.title,
        description: product.description,
        price: Math.round(product.price * 280) || 2000, // USD -> PKR-style scaling
        discountPrice: product.discountPercentage
          ? Math.round(product.price * 280 * (1 - product.discountPercentage / 100))
          : undefined,
        brand: product.brand,
        images,
        category: category._id,
        stock: product.stock ?? Math.floor(Math.random() * 100) + 1,
        rating: product.rating || 4,
        source: 'fakestoreapi',
        externalId,
        isFeatured: Math.random() > 0.7,
        isNew: Math.random() > 0.6,
      });

      imported++;
    }
  }

  return { imported, skipped };
};

const importFromPlatzi = async () => {
  let imported = 0;
  let skipped = 0;

  for (const cat of PLATZI_CATEGORIES) {
    const category = await getOrCreateCategory(cat.name);

    for (let page = 0; page < PLATZI_MAX_PAGES; page++) {
      const offset = page * PLATZI_PAGE_SIZE;
      const response = await axios.get(`${PLATZI_API}/products`, {
        params: { categorySlug: cat.slug, limit: PLATZI_PAGE_SIZE, offset },
      });
      const products = response.data || [];
      if (products.length === 0) break;

      for (const product of products) {
        const externalId = `platzi-${cat.slug}-${product.id}`;
        const exists = await Product.findOne({ externalId });
        if (exists) {
          skipped++;
          continue;
        }

        const images = (product.images || [])
          .map((img) => img.replace(/[[\]"]/g, ''))
          .filter((img) => img.startsWith('http'));

        if (images.length === 0) continue;

        await Product.create({
          title: product.title,
          description: product.description,
          price: Math.round((product.price || 20) * 280),
          images,
          category: category._id,
          stock: Math.floor(Math.random() * 100) + 1,
          rating: +(Math.random() * 2 + 3).toFixed(1),
          source: 'fakestoreapi',
          externalId,
          isFeatured: Math.random() > 0.7,
          isNew: Math.random() > 0.6,
        });

        imported++;
      }

      if (products.length < PLATZI_PAGE_SIZE) break;
    }
  }

  return { imported, skipped };
};

export const importFakeStoreProducts = async () => {
  try {
    const dummyResult = await importFromDummyJson();
    const platziResult = await importFromPlatzi();

    const imported = dummyResult.imported + platziResult.imported;
    const skipped = dummyResult.skipped + platziResult.skipped;

    return {
      success: true,
      message: `Imported ${imported} products across all categories (DummyJSON: ${dummyResult.imported}, Platzi: ${platziResult.imported}), skipped ${skipped} duplicates`,
      imported,
      skipped,
    };
  } catch (error) {
    console.error('Error importing products:', error.message);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const fetchFakeStoreProducts = async (limit = 10) => {
  try {
    const response = await axios.get(`${DUMMY_JSON_API}/products?limit=${limit}`);
    return response.data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error.message);
    return [];
  }
};