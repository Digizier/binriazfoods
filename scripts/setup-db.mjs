import pg from 'pg';
const { Client } = pg;

async function setup() {
  const client = new Client({
    user: 'postgres.eqikssvbkpdtvvvhluts',
    password: 'tnw8.-@-DK+p7M?',
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();
    console.log('Connected successfully!');

    // 1. Create categories table
    console.log('Creating categories table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        image_url TEXT,
        parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
        description TEXT,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
      CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
    `);

    // 2. Create products table
    console.log('Creating products table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        sku TEXT,
        category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
        subcategory_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
        description TEXT,
        price NUMERIC NOT NULL DEFAULT 0,
        compare_price NUMERIC,
        stock INT NOT NULL DEFAULT 100,
        weight_options JSONB DEFAULT '["250g", "500g", "1kg"]'::jsonb,
        cover_image TEXT,
        gallery_images JSONB DEFAULT '[]'::jsonb,
        youtube_url TEXT,
        is_featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        rating NUMERIC DEFAULT 5.0,
        review_count INT DEFAULT 1,
        ingredients TEXT,
        packaging_type TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
      CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
    `);

    // 3. Create orders table
    console.log('Creating orders table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_reference TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT,
        shipping_address TEXT NOT NULL,
        city TEXT NOT NULL,
        province TEXT,
        postal_code TEXT,
        delivery_notes TEXT,
        payment_method TEXT NOT NULL DEFAULT 'COD',
        payment_status TEXT NOT NULL DEFAULT 'Pending',
        order_status TEXT NOT NULL DEFAULT 'Pending',
        payment_proof_url TEXT,
        subtotal NUMERIC NOT NULL DEFAULT 0,
        shipping_fee NUMERIC NOT NULL DEFAULT 0,
        discount NUMERIC NOT NULL DEFAULT 0,
        total_amount NUMERIC NOT NULL DEFAULT 0,
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_orders_ref ON public.orders(order_reference);
      CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
    `);

    // 4. Create coupons table
    console.log('Creating coupons table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.coupons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT UNIQUE NOT NULL,
        discount_type TEXT NOT NULL DEFAULT 'percentage',
        discount_value NUMERIC NOT NULL DEFAULT 10,
        min_spend NUMERIC DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // 5. Create hero_banners table
    console.log('Creating hero_banners table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.hero_banners (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        subtitle TEXT,
        image_url TEXT,
        cta_text TEXT DEFAULT 'Shop Now',
        cta_link TEXT DEFAULT '/shop',
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // 6. Create store_settings table
    console.log('Creating store_settings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.store_settings (
        id INT PRIMARY KEY DEFAULT 1,
        store_name TEXT DEFAULT 'BIN RIAZ FOODS',
        phone_number TEXT DEFAULT '0345 6001913',
        whatsapp_number TEXT DEFAULT '0345 6001913',
        email TEXT DEFAULT 'binriazgroup@gmail.com',
        address TEXT DEFAULT 'Main Khushab Road, Opposite Qureshi Arcade, Sargodha, Punjab, Pakistan',
        shipping_fee NUMERIC DEFAULT 250,
        free_shipping_threshold NUMERIC DEFAULT 3000,
        jazzcash_title TEXT DEFAULT 'BIN RIAZ GROUP',
        jazzcash_number TEXT DEFAULT '0321 6001913',
        easypaisa_title TEXT DEFAULT 'BIN RIAZ GROUP',
        easypaisa_number TEXT DEFAULT '0345 6001913',
        bank_name TEXT DEFAULT 'Meezan Bank Ltd',
        bank_title TEXT DEFAULT 'BIN RIAZ FOODS',
        bank_iban TEXT DEFAULT 'PK00MEZN0000000000000000',
        cod_enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // 7. Configure RLS Policies
    console.log('Configuring Row Level Security...');
    const tables = ['categories', 'products', 'orders', 'coupons', 'hero_banners', 'store_settings'];
    for (const table of tables) {
      await client.query(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = '${table}' AND policyname = 'Public read access for ${table}'
          ) THEN
            CREATE POLICY "Public read access for ${table}" ON public.${table} FOR SELECT USING (true);
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = '${table}' AND policyname = 'Public write access for ${table}'
          ) THEN
            CREATE POLICY "Public write access for ${table}" ON public.${table} FOR ALL USING (true) WITH CHECK (true);
          END IF;
        END
        $$;
      `);
    }

    // 8. Seed Default Store Settings
    console.log('Ensuring default store settings exist...');
    await client.query(`
      INSERT INTO public.store_settings (id, store_name, phone_number, whatsapp_number, email, address, shipping_fee, free_shipping_threshold)
      VALUES (1, 'BIN RIAZ FOODS', '0345 6001913', '0345 6001913', 'binriazgroup@gmail.com', 'Main Khushab Road, Opposite Qureshi Arcade, Sargodha, Punjab, Pakistan', 250, 3000)
      ON CONFLICT (id) DO NOTHING;
    `);

    // 9. Seed Default Coupons
    console.log('Ensuring default promo coupons exist...');
    await client.query(`
      INSERT INTO public.coupons (code, discount_type, discount_value, min_spend, is_active)
      VALUES 
        ('WELCOME10', 'percentage', 10, 1500, true),
        ('FREESHIP', 'fixed', 250, 2500, true),
        ('RAMADAN500', 'fixed', 500, 4000, true)
      ON CONFLICT (code) DO NOTHING;
    `);

    // 10. Seed Default Hero Banners
    console.log('Ensuring hero banners exist...');
    await client.query(`
      INSERT INTO public.hero_banners (title, subtitle, image_url, cta_text, cta_link, sort_order, is_active)
      SELECT 'Pure Goodness, Every Home', 'Discover carefully selected food essentials, premium treats and thoughtful gifts for every occasion.', '/hero-banner.png', 'Shop All Products', '/shop', 1, true
      WHERE NOT EXISTS (SELECT 1 FROM public.hero_banners);
    `);

    console.log('Database tables, policies, and base settings successfully provisioned!');
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setup();
