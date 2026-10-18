import ProductDetailClient from '../../../components/ProductDetailClient';
import { supabase } from '../../../lib/supabase';

// Fallback slugs for build-time static generation
const FALLBACK_SLUGS = [
  'red-chili-powder',
  'turmeric-powder',
  'special-garam-masala',
  'premium-california-almonds',
  'luxury-mixed-dry-fruits',
  'premium-ajwa-dates',
  'pure-sidr-honey',
  'pure-cow-desi-ghee',
  'super-kernel-basmati-rice',
  'imperial-green-tea',
  'traditional-mango-pickle',
  'royal-heritage-gift-hamper',
  'healthy-family-pack',
];

export async function generateStaticParams() {
  try {
    const { data } = await supabase
      .from('products')
      .select('slug')
      .eq('is_active', true);

    if (data && data.length > 0) {
      return data.map((p: { slug: string }) => ({ slug: p.slug }));
    }
  } catch (e) {
    console.warn('generateStaticParams fallback used');
  }

  return FALLBACK_SLUGS.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
