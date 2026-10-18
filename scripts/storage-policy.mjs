import pg from 'pg';
const { Client } = pg;

async function setupStorage() {
  const client = new Client({
    user: 'postgres.eqikssvbkpdtvvvhluts',
    password: 'tnw8.-@-DK+p7M?',
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  try {
    await client.query(`
      DROP POLICY IF EXISTS "Public Access to product-media" ON storage.objects;
      CREATE POLICY "Public Access to product-media" ON storage.objects 
      FOR ALL 
      USING (bucket_id = 'product-media') 
      WITH CHECK (bucket_id = 'product-media');
    `);
    console.log('Storage policy verified!');
  } catch (err) {
    console.error('Storage policy error:', err.message);
  } finally {
    await client.end();
  }
}

setupStorage();
