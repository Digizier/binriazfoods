import pg from 'pg';
const { Client } = pg;

async function seed() {
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
    console.log('Connected to pooler for seeding...');

    // 1. Categories
    const categoriesData = [
      { name: 'Spices & Masalas', slug: 'spices-masalas', sort: 1, desc: 'Pure ground & whole spices for authentic Pakistani flavour' },
      { name: 'Dry Fruits & Nuts', slug: 'dry-fruits-nuts', sort: 2, desc: 'Selected almonds, cashews, pistachios, walnuts, and trail mixes' },
      { name: 'Dates', slug: 'dates', sort: 3, desc: 'Authentic Ajwa, Medjool, and Sukari premium dates' },
      { name: 'Honey & Natural Foods', slug: 'honey-natural-foods', sort: 4, desc: '100% pure raw Sidr and mountain blossom natural honey' },
      { name: 'Desi Ghee & Butter', slug: 'desi-ghee-butter', sort: 5, desc: 'Traditional pure cow & buffalo desi ghee' },
      { name: 'Pulses & Lentils', slug: 'pulses-lentils', sort: 6, desc: 'Farm-fresh Masoor, Moong, Mash, and Chana dals' },
      { name: 'Rice & Grains', slug: 'rice-grains', sort: 7, desc: 'Aromatic Super Kernel Basmati and premium Sella rice' },
      { name: 'Tea & Natural Products', slug: 'tea-natural-products', sort: 8, desc: 'Luxury loose green tea and aromatic leaf blends' },
      { name: 'Pickles & Condiments', slug: 'pickles-condiments', sort: 9, desc: 'Traditional mustard oil mango and mixed vegetable pickles' },
      { name: 'Chocolates & Confectionery', slug: 'chocolates-confectionery', sort: 10, desc: 'Luxury assorted truffles and nut-filled chocolate gifts' },
      { name: 'Sweets & Delicacies', slug: 'sweets-delicacies', sort: 11, desc: 'Authentic Sohan Halwa, Rewari, and heritage delicacies' },
      { name: 'Luxury Gift Hampers', slug: 'gift-hampers', sort: 12, desc: 'Exquisite custom gift boxes and celebratory hampers' },
      { name: 'Combo Packs & Offers', slug: 'combo-packs', sort: 13, desc: 'Curated value bundles for Pakistani homes' },
    ];

    const categoryMap = {};

    for (const cat of categoriesData) {
      const res = await client.query(`
        INSERT INTO public.categories (name, slug, description, sort_order, is_active)
        VALUES ($1, $2, $3, $4, true)
        ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
        RETURNING id, slug;
      `, [cat.name, cat.slug, cat.desc, cat.sort]);
      categoryMap[cat.slug] = res.rows[0].id;
    }

    // 2. Subcategories for Spices & Dry Fruits
    const subcategoriesData = [
      { name: 'Whole Spices', slug: 'whole-spices', parent: 'spices-masalas' },
      { name: 'Ground Spices', slug: 'ground-spices', parent: 'spices-masalas' },
      { name: 'Recipe Masala Mixes', slug: 'recipe-masala-mixes', parent: 'spices-masalas' },
      { name: 'Raw Nuts', slug: 'raw-nuts', parent: 'dry-fruits-nuts' },
      { name: 'Roasted & Salted', slug: 'roasted-salted-nuts', parent: 'dry-fruits-nuts' },
      { name: 'Dry Fruits Mix', slug: 'dry-fruits-mix', parent: 'dry-fruits-nuts' },
    ];

    for (const sub of subcategoriesData) {
      const parentId = categoryMap[sub.parent];
      if (parentId) {
        await client.query(`
          INSERT INTO public.categories (name, slug, parent_id, sort_order, is_active)
          VALUES ($1, $2, $3, 10, true)
          ON CONFLICT (slug) DO NOTHING;
        `, [sub.name, sub.slug, parentId]);
      }
    }

    // 3. Products
    const productsData = [
      {
        name: 'Bin Riaz Red Chili Powder',
        slug: 'red-chili-powder',
        sku: 'BR-SP-001',
        cat: 'spices-masalas',
        price: 450,
        compare_price: 520,
        stock: 120,
        desc: 'Made from sun-dried, selected red chilies ground to perfection. Rich natural red colour with no artificial additives or dyes.',
        weights: ['100g', '250g', '500g', '1kg'],
        cover: '/hero-banner.png',
        featured: true,
        ingredients: '100% Pure Red Chilies (Lal Mirch)',
        packaging: 'Airtight Food-Grade Zip Pouch with Clear Window'
      },
      {
        name: 'Bin Riaz Turmeric Powder',
        slug: 'turmeric-powder',
        sku: 'BR-SP-002',
        cat: 'spices-masalas',
        price: 420,
        compare_price: 490,
        stock: 95,
        desc: 'Organically sourced pure turmeric root powder with high curcumin content. Brings radiant golden color and immunity-boosting goodness.',
        weights: ['100g', '250g', '500g'],
        cover: '/hero-banner.png',
        featured: true,
        ingredients: '100% Pure Curcuma Longa (Haldi)',
        packaging: 'Resealable Stand-up Foil Pouch'
      },
      {
        name: 'Bin Riaz Special Garam Masala',
        slug: 'special-garam-masala',
        sku: 'BR-SP-003',
        cat: 'spices-masalas',
        price: 650,
        compare_price: 750,
        stock: 80,
        desc: 'Hand-roasted blend of green cardamom, black cumin, cinnamon sticks, cloves, mace, and star anise for that royal aroma.',
        weights: ['100g', '200g', '500g'],
        cover: '/hero-banner.png',
        featured: true,
        ingredients: 'Black Cumin, Green Cardamom, Cloves, Cinnamon, Mace, Nutmeg, Star Anise',
        packaging: 'Airtight Glass Jar'
      },
      {
        name: 'Premium California Almonds (American Badam)',
        slug: 'premium-california-almonds',
        sku: 'BR-DF-001',
        cat: 'dry-fruits-nuts',
        price: 1650,
        compare_price: 1850,
        stock: 65,
        desc: 'Jumbo-sized, sweet and crunchy California almonds. Packed with Vitamin E, protein, and healthy fats.',
        weights: ['250g', '500g', '1kg'],
        cover: '/hero-banner.png',
        featured: true,
        ingredients: '100% Selected California Almonds',
        packaging: 'Moisture-Lock Standup Food-Grade Pouch'
      },
      {
        name: 'Luxury Mixed Dry Fruits Royal Jar',
        slug: 'luxury-mixed-dry-fruits',
        sku: 'BR-DF-002',
        cat: 'dry-fruits-nuts',
        price: 2200,
        compare_price: 2600,
        stock: 45,
        desc: 'A royal blend of premium cashews, almonds, pistachios, walnuts, and raisins. Perfect for festive gifting or wholesome family snacking.',
        weights: ['500g', '1kg'],
        cover: '/hero-banner.png',
        featured: true,
        ingredients: 'Almonds, Cashews, Pistachios, Walnuts, Golden Raisins',
        packaging: 'Hexagonal Luxury Acrylic Gift Jar with Gold Lid'
      },
      {
        name: 'Bin Riaz Premium Ajwa Dates (Ajwa Khajoor)',
        slug: 'premium-ajwa-dates',
        sku: 'BR-DT-001',
        cat: 'dates',
        price: 2450,
        compare_price: 2900,
        stock: 50,
        desc: 'Authentic Madinah Al-Munawwarah Ajwa dates. Naturally soft, sweet with fine dark texture and renowned prophetic wellness value.',
        weights: ['500g', '1kg'],
        cover: '/hero-banner.png',
        featured: true,
        ingredients: '100% Pure Ajwa Dates',
        packaging: 'Embossed Gold-Foil Rigid Gift Box with Inner Tray'
      },
      {
        name: 'Pure Natural Sidr Mountain Honey (Beri Ka Shehad)',
        slug: 'pure-sidr-honey',
        sku: 'BR-HN-001',
        cat: 'honey-natural-foods',
        price: 2250,
        compare_price: 2600,
        stock: 40,
        desc: 'Unheated, unfiltered mountain Sidr honey gathered from wild Beri blossoms. Thick golden nectar with soothing therapeutic qualities.',
        weights: ['500g', '1kg'],
        cover: '/hero-banner.png',
        featured: true,
        ingredients: '100% Raw Wild Sidr Honey',
        packaging: 'Heavy Food-Grade Hexagonal Glass Jar with Dipper'
      },
      {
        name: 'Bin Riaz Pure Cow Desi Ghee',
        slug: 'pure-cow-desi-ghee',
        sku: 'BR-DG-001',
        cat: 'desi-ghee-butter',
        price: 1980,
        compare_price: 2300,
        stock: 70,
        desc: 'Crafted traditionally from churned butter of grass-fed cows. Aromatic, granular (daanedaar) golden texture that enriches every bite.',
        weights: ['500g', '1kg'],
        cover: '/hero-banner.png',
        featured: true,
        ingredients: 'Pure Clarified Cow Milk Fat',
        packaging: 'Leak-Proof Sealed Glass Jar with Gold Tamper Seal'
      },
      {
        name: 'Super Kernel Basmati Rice (Royal Vintage)',
        slug: 'super-kernel-basmati-rice',
        sku: 'BR-RC-001',
        cat: 'rice-grains',
        price: 850,
        compare_price: 990,
        stock: 150,
        desc: 'Aged two years for maximum elongation and delicate fragrant aroma. Cooks into separate, fluffy extra-long grains.',
        weights: ['1kg', '5kg', '10kg'],
        cover: '/hero-banner.png',
        featured: true,
        ingredients: '100% Pure Super Kernel Basmati Rice',
        packaging: 'Heavy-Duty Moisture Resistant Woven Bag'
      },
      {
        name: 'Imperial Green Tea (Loose Leaf Tin)',
        slug: 'imperial-green-tea',
        sku: 'BR-TE-001',
        cat: 'tea-natural-products',
        price: 850,
        compare_price: 1050,
        stock: 85,
        desc: 'High-elevation whole green tea leaves rich in antioxidants. Light, refreshing brew with subtle floral notes.',
        weights: ['150g', '300g'],
        cover: '/hero-banner.png',
        featured: true,
        ingredients: 'Whole Green Tea Leaves (Camellia Sinensis)',
        packaging: 'Embossed Luxury Green & Gold Tin Canister'
      },
      {
        name: 'Traditional Mango Pickle in Mustard Oil',
        slug: 'traditional-mango-pickle',
        sku: 'BR-PK-001',
        cat: 'pickles-condiments',
        price: 650,
        compare_price: 750,
        stock: 60,
        desc: 'Homemade village recipe using tender raw green mangoes, cold-pressed mustard oil, and authentic whole spices.',
        weights: ['500g', '1kg'],
        cover: '/hero-banner.png',
        featured: false,
        ingredients: 'Raw Mango, Pure Mustard Oil, Fenugreek, Fennel, Kalonji, Spices, Salt',
        packaging: 'Airtight Glass Jar'
      },
      {
        name: 'Royal Heritage Gift Hamper Box',
        slug: 'royal-heritage-gift-hamper',
        sku: 'BR-GH-001',
        cat: 'gift-hampers',
        price: 5800,
        compare_price: 6800,
        stock: 25,
        desc: 'The ultimate luxury gesture for weddings, Eid, and VIP corporate gifts. Includes premium Ajwa dates, Sidr honey jar, roasted almonds, cashews, and luxury green tea tin.',
        weights: ['Complete Hamper'],
        cover: '/hero-banner.png',
        featured: true,
        ingredients: 'Assorted Gourmet Selection in Luxury Presentation Box',
        packaging: 'Handmade Rigid Keepsake Box with Satin Ribbon & Gift Card'
      },
      {
        name: 'Healthy Family Essentials Combo Pack',
        slug: 'healthy-family-pack',
        sku: 'BR-CB-001',
        cat: 'combo-packs',
        price: 4500,
        compare_price: 5400,
        stock: 40,
        desc: 'Comprehensive monthly wellness pack: 1kg Basmati Rice, 500g Desi Ghee, 250g Red Chili, 250g Turmeric, 250g Garam Masala, and 500g California Almonds.',
        weights: ['Complete Bundle'],
        cover: '/hero-banner.png',
        featured: true,
        ingredients: 'Ghee, Basmati Rice, Core Spices & Almonds',
        packaging: 'Reinforced Bin Riaz Handle Delivery Box'
      }
    ];

    for (const p of productsData) {
      const catId = categoryMap[p.cat];
      await client.query(`
        INSERT INTO public.products (
          name, slug, sku, category_id, description, price, compare_price, 
          stock, weight_options, cover_image, is_featured, is_active, 
          ingredients, packaging_type
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, $12, $13)
        ON CONFLICT (slug) DO UPDATE SET
          price = EXCLUDED.price,
          stock = EXCLUDED.stock,
          description = EXCLUDED.description,
          is_featured = EXCLUDED.is_featured;
      `, [
        p.name, p.slug, p.sku, catId, p.desc, p.price, p.compare_price,
        p.stock, JSON.stringify(p.weights), p.cover, p.featured,
        p.ingredients, p.packaging
      ]);
    }

    console.log('Seeded', categoriesData.length, 'categories and', productsData.length, 'products successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.end();
  }
}

seed();
