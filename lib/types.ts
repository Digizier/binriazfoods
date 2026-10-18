export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  parent_id?: string | null;
  description?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  subcategories?: Category[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id?: string | null;
  subcategory_id?: string | null;
  category?: Category | null;
  subcategory?: Category | null;
  description: string;
  price: number;
  compare_price?: number | null;
  stock: number;
  weight_options: string[];
  cover_image: string;
  gallery_images: string[];
  youtube_url?: string | null;
  is_featured: boolean;
  is_active: boolean;
  rating: number;
  review_count: number;
  ingredients?: string | null;
  packaging_type?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  slug: string;
  variant: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  id: string;
  order_reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  shipping_address: string;
  city: string;
  province?: string | null;
  postal_code?: string | null;
  delivery_notes?: string | null;
  payment_method: 'COD' | 'JazzCash' | 'EasyPaisa' | 'Bank Transfer';
  payment_status: 'Pending' | 'Verified' | 'Paid' | 'Failed';
  order_status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_proof_url?: string | null;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_spend: number;
  is_active: boolean;
  created_at?: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string | null;
  image_url: string;
  cta_text: string;
  cta_link: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface StoreSettings {
  id: number;
  store_name: string;
  phone_number: string;
  whatsapp_number: string;
  email: string;
  address: string;
  shipping_fee: number;
  free_shipping_threshold: number;
  jazzcash_title: string;
  jazzcash_number: string;
  easypaisa_title: string;
  easypaisa_number: string;
  bank_name: string;
  bank_title: string;
  bank_iban: string;
  cod_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  variant: string;
  quantity: number;
}
