import pg from 'pg';
const { Client } = pg;

async function updateMedia() {
  const client = new Client({
    user: 'postgres.eqikssvbkpdtvvvhluts',
    password: 'tnw8.-@-DK+p7M?',
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to pooler for updating media...');

    // 1. Update Category Images
    const categoryImages = [
      { slug: 'spices-masalas', img: '/categories/spices-masalas.jpg' },
      { slug: 'dry-fruits-nuts', img: '/categories/dry-fruits-nuts.jpg' },
      { slug: 'dates', img: '/categories/dates.jpg' },
      { slug: 'honey-natural-foods', img: '/categories/honey-natural-foods.jpg' },
      { slug: 'desi-ghee-butter', img: '/categories/desi-ghee-edible-oils.jpg' },
      { slug: 'pulses-lentils', img: '/categories/pulses-grains.jpg' },
      { slug: 'rice-grains', img: '/categories/pulses-grains.jpg' },
      { slug: 'tea-natural-products', img: '/categories/tea-gourmet-products.jpg' },
      { slug: 'pickles-condiments', img: '/categories/pickles-condiments.jpg' },
      { slug: 'chocolates-confectionery', img: '/categories/chocolates-confectionery.jpg' },
      { slug: 'sweets-delicacies', img: '/categories/sweets-desserts.jpg' },
      { slug: 'gift-hampers', img: '/categories/luxury-gift-hampers.jpg' },
      { slug: 'combo-packs', img: '/categories/combos-super-savers.jpg' },
    ];

    for (const cat of categoryImages) {
      await client.query(`
        UPDATE public.categories
        SET image_url = $1
        WHERE slug = $2;
      `, [cat.img, cat.slug]);
    }
    console.log('Updated category images.');

    // 2. Update Product Images
    const productImages = [
      { slug: 'red-chili-powder', img: '/products/red-chili-powder.jpg' },
      { slug: 'turmeric-powder', img: '/products/turmeric-powder.jpg' },
      { slug: 'special-garam-masala', img: '/products/special-garam-masala.jpg' },
      { slug: 'california-almonds', img: '/products/california-almonds.jpg' },
      { slug: 'royal-pistachios', img: '/products/royal-pistachios.jpg' },
      { slug: 'ajwa-dates', img: '/products/ajwa-dates.jpg' },
      { slug: 'sidr-honey', img: '/products/sidr-honey.jpg' },
      { slug: 'desi-cow-ghee', img: '/products/desi-cow-ghee.jpg' },
      { slug: 'mixed-dry-fruits', img: '/products/mixed-dry-fruits.jpg' },
      { slug: 'family-combo-pack', img: '/products/family-combo-pack.jpg' },
      { slug: 'ramadan-gift-box', img: '/products/ramadan-gift-box.jpg' },
      { slug: 'eid-hamper', img: '/products/eid-hamper.jpg' },
      { slug: 'mustard-oil', img: '/products/mustard-oil.jpg' },
    ];

    for (const prod of productImages) {
      await client.query(`
        UPDATE public.products
        SET cover_image = $1, gallery_images = $2::jsonb
        WHERE slug = $3;
      `, [prod.img, JSON.stringify([prod.img]), prod.slug]);
    }
    console.log('Updated product images.');

    // 3. Update Hero Banner
    await client.query(`
      UPDATE public.hero_banners
      SET image_url = '/hero-banner.jpg';
    `);
    console.log('Updated hero banner image.');

    console.log('ALL MEDIA UPDATED SUCCESSFULLY IN DATABASE!');
  } catch (err) {
    console.error('Update error:', err);
  } finally {
    await client.end();
  }
}

updateMedia();
