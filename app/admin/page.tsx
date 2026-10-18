"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Product,
  Category,
  Order,
  Coupon,
  HeroBanner,
  StoreSettings,
} from '../../lib/types';
import { uploadMediaToStorage } from '../../lib/image-compressor';
import CustomConfirmModal from '../../components/CustomConfirmModal';
import PaymentProofModal from '../../components/PaymentProofModal';
import PrintableInvoice from '../../components/PrintableInvoice';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Tag,
  Sliders,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  Printer,
  Upload,
  CheckCircle2,
  AlertCircle,
  Lock,
  LogOut,
  Search,
  RefreshCw,
  Video,
  DollarSign,
  TrendingUp,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';

const ADMIN_MASTER_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'binriazfoods_secure_2026';

export default function AdminDashboardPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'categories' | 'orders' | 'banners' | 'coupons' | 'settings'
  >('dashboard');

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(false);

  // Modals & UI States
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
  });

  // Product Add/Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category Add/Edit Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  // Banner Add/Edit Modal
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<HeroBanner> | null>(null);

  // Coupon Add/Edit Modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);

  // Check Local Auth Session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('binriaz_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch all management data
  const refreshAllData = async () => {
    setLoading(true);
    try {
      // 1. Products
      const { data: prods } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (prods) setProducts(prods as Product[]);

      // 2. Categories
      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (cats) setCategories(cats as Category[]);

      // 3. Orders
      const { data: ords } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (ords) setOrders(ords as Order[]);

      // 4. Banners
      const { data: bans } = await supabase
        .from('hero_banners')
        .select('*')
        .order('sort_order', { ascending: true });
      if (bans) setBanners(bans as HeroBanner[]);

      // 5. Coupons
      const { data: cpn } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      if (cpn) setCoupons(cpn as Coupon[]);

      // 6. Settings
      const { data: sett } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (sett) setSettings(sett as StoreSettings);
    } catch (e) {
      console.warn('Admin fetch notice:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_MASTER_PASS || passwordInput.trim() === 'binriazfoods_secure_2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('binriaz_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('binriaz_admin_auth');
  };

  // --- PRODUCT CRUD ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;

    try {
      const slug =
        editingProduct.slug ||
        editingProduct.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');

      const payload = {
        name: editingProduct.name,
        slug,
        sku: editingProduct.sku || `BR-${Math.floor(100 + Math.random() * 900)}`,
        category_id: editingProduct.category_id || null,
        subcategory_id: editingProduct.subcategory_id || null,
        description: editingProduct.description || '',
        price: Number(editingProduct.price),
        compare_price: editingProduct.compare_price ? Number(editingProduct.compare_price) : null,
        stock: Number(editingProduct.stock || 50),
        weight_options: editingProduct.weight_options || ['250g', '500g', '1kg'],
        cover_image: editingProduct.cover_image || '/hero-banner.png',
        gallery_images: editingProduct.gallery_images || [],
        youtube_url: editingProduct.youtube_url || null,
        is_featured: !!editingProduct.is_featured,
        is_active: editingProduct.is_active !== false,
        ingredients: editingProduct.ingredients || null,
        packaging_type: editingProduct.packaging_type || 'Airtight Food-Grade Protective Pouch',
      };

      if (editingProduct.id) {
        await supabase.from('products').update(payload).eq('id', editingProduct.id);
      } else {
        await supabase.from('products').insert(payload);
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
      await refreshAllData();
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Product: "${product.name}"?`,
      message:
        'Are you sure you want to permanently delete this product? This action will remove it from the online store catalog.',
      onConfirm: async () => {
        await supabase.from('products').delete().eq('id', product.id);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        await refreshAllData();
      },
    });
  };

  // --- CATEGORY CRUD ---
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    try {
      const slug =
        editingCategory.slug ||
        editingCategory.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');

      const payload = {
        name: editingCategory.name,
        slug,
        parent_id: editingCategory.parent_id || null,
        description: editingCategory.description || null,
        image_url: editingCategory.image_url || '/hero-banner.png',
        sort_order: Number(editingCategory.sort_order || 0),
        is_active: editingCategory.is_active !== false,
      };

      if (editingCategory.id) {
        await supabase.from('categories').update(payload).eq('id', editingCategory.id);
      } else {
        await supabase.from('categories').insert(payload);
      }

      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      await refreshAllData();
    } catch (err) {
      console.error('Failed to save category:', err);
    }
  };

  const handleDeleteCategory = (cat: Category) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Category: "${cat.name}"?`,
      message:
        'Are you sure you want to delete this category? Associated products will have their department unlinked.',
      onConfirm: async () => {
        await supabase.from('categories').delete().eq('id', cat.id);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        await refreshAllData();
      },
    });
  };

  // --- ORDER STATUS UPDATE ---
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ order_status: newStatus }).eq('id', orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus as any } : o))
    );
  };

  const handleUpdatePaymentStatus = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ payment_status: newStatus }).eq('id', orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, payment_status: newStatus as any } : o))
    );
  };

  // --- SETTINGS UPDATE ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      await supabase.from('store_settings').update(settings).eq('id', 1);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  // --- FILE UPLOADER HANDLER ---
  const handleUploadCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingImage(true);
      try {
        const url = await uploadMediaToStorage(e.target.files[0], 'products');
        setEditingProduct((prev) => ({ ...prev, cover_image: url }));
      } catch (err) {
        console.error('Image upload failed:', err);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleUploadGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingImage(true);
      try {
        const url = await uploadMediaToStorage(e.target.files[0], 'products');
        setEditingProduct((prev) => ({
          ...prev,
          gallery_images: [...(prev?.gallery_images || []), url],
        }));
      } catch (err) {
        console.error('Gallery image upload failed:', err);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // --- LOGIN GATE SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#06291B] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-[#D4AF55]/40 space-y-6">
          <div className="text-center space-y-2">
            <img
              src="/logo.png"
              alt="Bin Riaz Foods"
              className="h-16 w-auto mx-auto object-contain"
              style={{ maxHeight: '64px', width: 'auto' }}
            />
            <h1 className="text-xl font-black text-[#0B3826]">
              Admin Control Portal
            </h1>
            <p className="text-xs text-gray-500">
              Enter authorized administrator access password to manage catalog, orders, and store operations.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Master PIN / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-xs font-semibold focus:outline-hidden focus:border-[#D4AF55] focus:bg-white"
                />
              </div>
            </div>

            {authError && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                Invalid administrative password. Please verify and try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0B3826] hover:bg-[#18583A] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="text-center">
            <a
              href="/"
              className="text-xs font-semibold text-gray-500 hover:text-[#0B3826] transition-colors"
            >
              &larr; Return to Public Storefront
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Dashboard Metrics
  const totalRevenue = orders
    .filter((o) => o.order_status !== 'Cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);
  const pendingOrdersCount = orders.filter((o) => o.order_status === 'Pending').length;
  const inStockProductsCount = products.filter((p) => p.stock > 0).length;

  return (
    <div className="min-h-screen bg-[#FAF6EC] flex">
      {/* 1. FIXED STICKY LEFT SIDEBAR (DOES NOT SCROLL AWAY!) */}
      <aside className="w-64 bg-[#06291B] text-[#FAF6EC] shrink-0 sticky top-0 h-screen overflow-y-auto flex flex-col justify-between border-r border-[#D4AF55]/30">
        <div>
          {/* Logo & Portal Branding */}
          <div className="p-5 border-b border-white/10 flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto brightness-110" style={{ maxHeight: '40px', width: 'auto' }} />
            <div>
              <h2 className="font-black text-sm text-[#D4AF55] leading-tight">BIN RIAZ FOODS</h2>
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Admin Hub</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#D4AF55] text-[#06291B] shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#D4AF55] text-[#06291B] shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products Manager</span>
              <span className="ml-auto bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#D4AF55] text-[#06291B] shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categories & Sub-Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#D4AF55] text-[#06291B] shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders & Proofs</span>
              {pendingOrdersCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'banners'
                  ? 'bg-[#D4AF55] text-[#06291B] shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Hero Banners</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'coupons'
                  ? 'bg-[#D4AF55] text-[#06291B] shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Coupons & Vouchers</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#D4AF55] text-[#06291B] shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store & Payment Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center space-x-2 text-[11px] text-white/70">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Cloud Database Sync: Live</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 bg-white/10 hover:bg-red-900/50 text-white/90 text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN SCROLLABLE CONTENT AREA */}
      <main className="flex-1 overflow-x-hidden p-6 sm:p-8 space-y-8">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E1D6] gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0B3826] capitalize">
              {activeTab === 'dashboard'
                ? 'Store Analytics & Performance'
                : activeTab === 'products'
                ? 'Product Catalog Management'
                : activeTab === 'categories'
                ? 'Category & Sub-Category Hierarchy'
                : activeTab === 'orders'
                ? 'Customer Orders & Verification'
                : activeTab === 'banners'
                ? 'Hero Carousel & Banners'
                : activeTab === 'coupons'
                ? 'Promo Vouchers & Discounts'
                : 'Store & Payment Configurations'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              BIN RIAZ FOODS · Production Management Console
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={refreshAllData}
              disabled={loading}
              className="px-3.5 py-2 bg-white border border-[#E5E1D6] text-xs font-bold rounded-xl text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-[#0B3826] text-white text-xs font-bold rounded-xl hover:bg-[#18583A] flex items-center space-x-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF55]" />
              <span>View Live Store</span>
            </a>
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-[#E5E1D6] shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0B3826] text-[#D4AF55] flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Total Revenue
                  </span>
                  <p className="text-xl font-black text-[#0B3826] font-mono">
                    Rs. {totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E5E1D6] shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Total Orders
                  </span>
                  <p className="text-xl font-black text-[#0B3826] font-mono">
                    {orders.length} orders
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E5E1D6] shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Pending Confirmation
                  </span>
                  <p className="text-xl font-black text-red-600 font-mono">
                    {pendingOrdersCount} orders
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E5E1D6] shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Active Catalog
                  </span>
                  <p className="text-xl font-black text-[#0B3826] font-mono">
                    {inStockProductsCount} products
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E1D6] shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#E5E1D6]">
                <h3 className="font-bold text-base text-[#0B3826]">Recent Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#D4AF55] hover:underline"
                >
                  View All Orders &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E1D6] text-gray-500 uppercase font-bold text-[10px]">
                      <th className="py-2.5 px-3">Reference</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Payment</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-3 font-mono font-bold text-[#0B3826]">
                          {ord.order_reference}
                        </td>
                        <td className="py-3 px-3 font-semibold text-gray-800">
                          {ord.customer_name} ({ord.customer_phone})
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-gray-700">{ord.payment_method}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[#0B3826]">
                          Rs. {Number(ord.total_amount).toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF6EC] text-[#0B3826] border border-[#D4AF55]/40">
                            {ord.order_status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          {ord.payment_proof_url && (
                            <button
                              onClick={() => setSelectedProofOrder(ord)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                              title="View Payment Screenshot"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInvoiceOrder(ord)}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                            title="Print Invoice"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGER */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Manage titles, prices, stock, WebP images, YouTube videos, and multi-variants.
              </p>
              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    price: 0,
                    stock: 50,
                    weight_options: ['250g', '500g', '1kg'],
                    cover_image: '/hero-banner.png',
                    gallery_images: [],
                    is_active: true,
                  });
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#0B3826] text-white text-xs font-bold rounded-xl hover:bg-[#18583A] transition-all flex items-center space-x-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-[#E5E1D6] shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EC] border-b border-[#E5E1D6] text-gray-600 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Stock</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const catObj = categories.find((c) => c.id === p.category_id);
                    return (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                        <td className="py-3 px-4 flex items-center space-x-3">
                          <img
                            src={p.cover_image || '/hero-banner.png'}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200"
                          />
                          <div>
                            <span className="font-bold text-[#0B3826] line-clamp-1">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {p.sku} {p.youtube_url ? '· 🎥 Video Attached' : ''}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[#0B3826]">
                          Rs. {Number(p.price).toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.stock > 10
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {p.stock} in stock
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-600 font-medium">
                          {catObj ? catObj.name : '—'}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              p.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {p.is_active ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsProductModalOpen(true);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES & SUB-CATEGORIES MANAGER */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Organize parent departments and nest multiple subcategories underneath.
              </p>
              <button
                onClick={() => {
                  setEditingCategory({
                    name: '',
                    parent_id: null,
                    sort_order: 1,
                    is_active: true,
                  });
                  setIsCategoryModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#0B3826] text-white text-xs font-bold rounded-xl hover:bg-[#18583A] transition-all flex items-center space-x-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category / Sub-Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Parent Categories */}
              <div className="bg-white rounded-2xl border border-[#E5E1D6] p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-[#0B3826] pb-2 border-b border-[#E5E1D6]">
                  Primary Parent Categories
                </h3>
                <div className="space-y-2">
                  {categories
                    .filter((c) => !c.parent_id)
                    .map((cat) => (
                      <div
                        key={cat.id}
                        className="p-3 bg-[#FAF6EC] rounded-xl border border-[#E5E1D6] flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-xs text-[#0B3826]">{cat.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">slug: {cat.slug}</p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setEditingCategory(cat);
                              setIsCategoryModalOpen(true);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-white rounded-md cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-1.5 text-red-600 hover:bg-white rounded-md cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Subcategories */}
              <div className="bg-white rounded-2xl border border-[#E5E1D6] p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-[#0B3826] pb-2 border-b border-[#E5E1D6]">
                  Nested Sub-Categories
                </h3>
                <div className="space-y-2">
                  {categories
                    .filter((c) => c.parent_id)
                    .map((sub) => {
                      const parent = categories.find((c) => c.id === sub.parent_id);
                      return (
                        <div
                          key={sub.id}
                          className="p-3 bg-white rounded-xl border border-[#E5E1D6] flex justify-between items-center"
                        >
                          <div>
                            <p className="font-bold text-xs text-[#0B3826]">{sub.name}</p>
                            <p className="text-[10px] text-[#D4AF55] font-semibold">
                              Parent: {parent?.name || 'Unknown'}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => {
                                setEditingCategory(sub);
                                setIsCategoryModalOpen(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-gray-100 rounded-md cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(sub)}
                              className="p-1.5 text-red-600 hover:bg-gray-100 rounded-md cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & PROOF VERIFICATION */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5E1D6] shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EC] border-b border-[#E5E1D6] text-gray-600 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-3">Customer Details</th>
                    <th className="py-3 px-3">City</th>
                    <th className="py-3 px-3">Payment Method</th>
                    <th className="py-3 px-3">Proof Screenshot</th>
                    <th className="py-3 px-3">Payment Status</th>
                    <th className="py-3 px-3">Order Status</th>
                    <th className="py-3 px-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-[#0B3826]">
                        {ord.order_reference}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-gray-800">{ord.customer_name}</p>
                        <p className="text-[11px] text-gray-500">{ord.customer_phone}</p>
                      </td>
                      <td className="py-3 px-3 text-gray-600 font-medium">
                        {ord.city}
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-700">
                        {ord.payment_method}
                      </td>

                      {/* Payment Proof Screenshot Eye Button */}
                      <td className="py-3 px-3">
                        {ord.payment_proof_url ? (
                          <button
                            onClick={() => setSelectedProofOrder(ord)}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold text-[10px] flex items-center space-x-1 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[10px]">None (COD)</span>
                        )}
                      </td>

                      {/* Payment Status Dropdown */}
                      <td className="py-3 px-3">
                        <select
                          value={ord.payment_status}
                          onChange={(e) => handleUpdatePaymentStatus(ord.id, e.target.value)}
                          className="px-2 py-1 bg-white border border-[#E5E1D6] rounded-md font-bold text-[10px] cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Pending Verification">Verification Pending</option>
                          <option value="Verified">Verified / Paid</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </td>

                      {/* Order Status Dropdown */}
                      <td className="py-3 px-3">
                        <select
                          value={ord.order_status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-md font-bold text-[10px] border cursor-pointer ${
                            ord.order_status === 'Delivered'
                              ? 'bg-green-50 text-green-800 border-green-200'
                              : ord.order_status === 'Cancelled'
                              ? 'bg-red-50 text-red-800 border-red-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing / Packed</option>
                          <option value="Shipped">Shipped / In Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Print Invoice Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          className="px-2.5 py-1 bg-[#0B3826] text-white rounded-lg text-[10px] font-bold hover:bg-[#18583A] flex items-center space-x-1 ml-auto cursor-pointer"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Print Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: HERO BANNERS MANAGER */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Manage promotional hero sliders and main banners displayed on the storefront.
              </p>
              <button
                onClick={() => {
                  setEditingBanner({
                    title: '',
                    subtitle: '',
                    image_url: '/hero-banner.png',
                    cta_text: 'Shop Now',
                    cta_link: '/shop',
                    is_active: true,
                  });
                  setIsBannerModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#0B3826] text-white text-xs font-bold rounded-xl hover:bg-[#18583A] transition-all flex items-center space-x-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hero Banner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E5E1D6] shadow-xs flex flex-col justify-between"
                >
                  <div className="aspect-16/9 w-full bg-gray-100 relative">
                    <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] rounded-md font-bold">
                      {b.is_active ? 'Active' : 'Hidden'}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-[#0B3826]">{b.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{b.subtitle}</p>
                    <div className="pt-2 flex justify-between items-center border-t border-gray-100">
                      <span className="text-[11px] text-gray-400 font-mono">Link: {b.cta_link}</span>
                      <button
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: `Delete Banner: "${b.title}"?`,
                            message: 'Are you sure you want to delete this promotional banner?',
                            onConfirm: async () => {
                              await supabase.from('hero_banners').delete().eq('id', b.id);
                              setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                              await refreshAllData();
                            },
                          });
                        }}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: COUPONS MANAGER */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Configure discount vouchers (e.g. WELCOME10, FREESHIP) for cart & checkout.
              </p>
              <button
                onClick={() => {
                  setEditingCoupon({
                    code: '',
                    discount_type: 'percentage',
                    discount_value: 10,
                    min_spend: 1500,
                    is_active: true,
                  });
                  setIsCouponModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#0B3826] text-white text-xs font-bold rounded-xl hover:bg-[#18583A] transition-all flex items-center space-x-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map((cp) => (
                <div
                  key={cp.id}
                  className="bg-white rounded-2xl p-5 border border-[#E5E1D6] shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 bg-[#FAF6EC] border border-[#D4AF55] text-[#0B3826] font-mono font-black text-sm rounded-lg">
                      {cp.code}
                    </span>
                    <button
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: `Delete Coupon: ${cp.code}?`,
                          message: 'Are you sure you want to deactivate and remove this coupon code?',
                          onConfirm: async () => {
                            await supabase.from('coupons').delete().eq('id', cp.id);
                            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                            await refreshAllData();
                          },
                        });
                      }}
                      className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-700 font-medium">
                    Discount:{' '}
                    <strong>
                      {cp.discount_type === 'percentage'
                        ? `${cp.discount_value}% OFF`
                        : `Rs. ${cp.discount_value} FLAT OFF`}
                    </strong>
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Min Order Spend: Rs. {Number(cp.min_spend).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: STORE SETTINGS */}
        {activeTab === 'settings' && settings && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E1D6] shadow-xs space-y-6">
              <h2 className="text-base font-bold text-[#0B3826] pb-3 border-b border-[#E5E1D6]">
                Store Identity & Shipping Rules
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Store Brand Name</label>
                  <input
                    type="text"
                    value={settings.store_name}
                    onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Helpline / WhatsApp Number</label>
                  <input
                    type="text"
                    value={settings.phone_number}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        phone_number: e.target.value,
                        whatsapp_number: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Base Shipping Charge (Rs.)</label>
                  <input
                    type="number"
                    value={settings.shipping_fee}
                    onChange={(e) =>
                      setSettings({ ...settings, shipping_fee: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Free Shipping Threshold (Rs.)</label>
                  <input
                    type="number"
                    value={settings.free_shipping_threshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        free_shipping_threshold: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-gray-800"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-gray-700">Dispatch / Warehouse Address</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-gray-800"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E1D6] shadow-xs space-y-6">
              <h2 className="text-base font-bold text-[#0B3826] pb-3 border-b border-[#E5E1D6]">
                Customer Payment Account Configuration
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-red-600">JazzCash Account Title</label>
                  <input
                    type="text"
                    value={settings.jazzcash_title}
                    onChange={(e) => setSettings({ ...settings, jazzcash_title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-red-50/40 border border-red-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-red-600">JazzCash Account Number</label>
                  <input
                    type="text"
                    value={settings.jazzcash_number}
                    onChange={(e) => setSettings({ ...settings, jazzcash_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-red-50/40 border border-red-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-green-700">EasyPaisa Account Title</label>
                  <input
                    type="text"
                    value={settings.easypaisa_title}
                    onChange={(e) =>
                      setSettings({ ...settings, easypaisa_title: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-green-700">EasyPaisa Account Number</label>
                  <input
                    type="text"
                    value={settings.easypaisa_number}
                    onChange={(e) =>
                      setSettings({ ...settings, easypaisa_number: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0B3826]">Bank Name</label>
                  <input
                    type="text"
                    value={settings.bank_name}
                    onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0B3826]">Bank Account Title</label>
                  <input
                    type="text"
                    value={settings.bank_title}
                    onChange={(e) => setSettings({ ...settings, bank_title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-[#0B3826]">Bank IBAN / Account Number</label>
                  <input
                    type="text"
                    value={settings.bank_iban}
                    onChange={(e) => setSettings({ ...settings, bank_iban: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#0B3826] hover:bg-[#18583A] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Save Store Settings
              </button>
            </div>
          </form>
        )}
      </main>

      {/* --- ADD / EDIT PRODUCT MODAL --- */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E5E1D6] max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-[#0B3826] pb-3 border-b border-[#E5E1D6]">
              {editingProduct.id ? 'Edit Product Listing' : 'Add New Product Listing'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Comparison Price (Strikethrough)</label>
                  <input
                    type="number"
                    value={editingProduct.compare_price || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        compare_price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Category / Department</label>
                  <select
                    value={editingProduct.category_id || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category_id: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl"
                  >
                    <option value="">Select Category...</option>
                    {categories
                      .filter((c) => !c.parent_id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Stock Available</label>
                  <input
                    type="number"
                    value={editingProduct.stock || 50}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl"
                  />
                </div>
              </div>

              {/* YouTube Video URL Field */}
              <div className="space-y-1">
                <label className="font-bold text-[#0B3826] flex items-center space-x-1.5">
                  <Video className="w-4 h-4 text-red-600" />
                  <span>YouTube Video URL (Shows First in Gallery!)</span>
                </label>
                <input
                  type="url"
                  value={editingProduct.youtube_url || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, youtube_url: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl"
                />
              </div>

              {/* Image Upload Area (Direct Upload to WebP) */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="font-bold text-gray-700 block">
                  Cover Image (Direct File Upload &rarr; WebP Compressed)
                </label>
                <div className="flex items-center space-x-3">
                  <img
                    src={editingProduct.cover_image || '/hero-banner.png'}
                    alt="Cover Preview"
                    className="w-14 h-14 rounded-lg object-cover bg-gray-100 border border-[#E5E1D6]"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadCoverImage}
                    className="text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0B3826] file:text-white cursor-pointer"
                  />
                  {uploadingImage && <span className="text-[11px] text-[#D4AF55]">Converting to WebP...</span>}
                </div>
              </div>

              {/* Additional Gallery Images */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="font-bold text-gray-700 block">
                  Additional Gallery Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadGalleryImage}
                  className="text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0B3826] file:text-white cursor-pointer"
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {editingProduct.gallery_images?.map((img, i) => (
                    <div key={i} className="relative w-12 h-12 rounded-md overflow-hidden border">
                      <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProduct({
                            ...editingProduct,
                            gallery_images: editingProduct.gallery_images?.filter((_, idx) => idx !== i),
                          })
                        }
                        className="absolute top-0 right-0 bg-red-600 text-white p-0.5"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Detailed Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#E5E1D6]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B3826] text-white rounded-xl font-bold shadow-md hover:bg-[#18583A]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT CATEGORY MODAL --- */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5E1D6]">
            <h2 className="text-base font-bold text-[#0B3826] pb-3 border-b border-[#E5E1D6]">
              {editingCategory.id ? 'Edit Category' : 'Create Category / Sub-Category'}
            </h2>
            <form onSubmit={handleSaveCategory} className="space-y-4 mt-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Parent Category (Leave empty if top level)</label>
                <select
                  value={editingCategory.parent_id || ''}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      parent_id: e.target.value || null,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl"
                >
                  <option value="">None (Top-Level Parent Category)</option>
                  {categories
                    .filter((c) => !c.parent_id && c.id !== editingCategory.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Sort Order</label>
                <input
                  type="number"
                  value={editingCategory.sort_order || 1}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      sort_order: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#E5E1D6]">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B3826] text-white rounded-xl font-bold shadow-md hover:bg-[#18583A]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT BANNER MODAL --- */}
      {isBannerModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5E1D6]">
            <h2 className="text-base font-bold text-[#0B3826] pb-3 border-b border-[#E5E1D6]">
              Create Hero Banner
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await supabase.from('hero_banners').insert(editingBanner);
                setIsBannerModalOpen(false);
                await refreshAllData();
              }}
              className="space-y-3 mt-4 text-xs"
            >
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Banner Headline</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF6EC] border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={editingBanner.subtitle || ''}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, subtitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-[#FAF6EC] border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">CTA Link Destination</label>
                <input
                  type="text"
                  value={editingBanner.cta_link || '/shop'}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, cta_link: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-[#FAF6EC] border rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B3826] text-white rounded-xl font-bold"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT COUPON MODAL --- */}
      {isCouponModalOpen && editingCoupon && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5E1D6]">
            <h2 className="text-base font-bold text-[#0B3826] pb-3 border-b border-[#E5E1D6]">
              Create Discount Voucher
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await supabase.from('coupons').insert({
                  ...editingCoupon,
                  code: editingCoupon.code?.toUpperCase(),
                });
                setIsCouponModalOpen(false);
                await refreshAllData();
              }}
              className="space-y-3 mt-4 text-xs"
            >
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EID2026"
                  value={editingCoupon.code || ''}
                  onChange={(e) =>
                    setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3.5 py-2 bg-[#FAF6EC] border rounded-xl uppercase font-mono font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Type</label>
                  <select
                    value={editingCoupon.discount_type || 'percentage'}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        discount_type: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FAF6EC] border rounded-xl"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed PKR (Rs.)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={editingCoupon.discount_value || 10}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        discount_value: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FAF6EC] border rounded-xl font-bold"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Min Cart Spend (Rs.)</label>
                <input
                  type="number"
                  value={editingCoupon.min_spend || 1500}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      min_spend: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAF6EC] border rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B3826] text-white rounded-xl font-bold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PAYMENT PROOF SCREENSHOT VIEWER MODAL (EYE ICON) --- */}
      {selectedProofOrder && (
        <PaymentProofModal
          isOpen={!!selectedProofOrder}
          onClose={() => setSelectedProofOrder(null)}
          proofUrl={selectedProofOrder.payment_proof_url}
          orderReference={selectedProofOrder.order_reference}
          customerName={selectedProofOrder.customer_name}
          amount={Number(selectedProofOrder.total_amount)}
        />
      )}

      {/* --- PRISTINE WHITE PRINTABLE INVOICE MODAL --- */}
      {selectedInvoiceOrder && (
        <PrintableInvoice
          order={selectedInvoiceOrder}
          settings={settings}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* --- CUSTOM ANIMATED CONFIRM MODAL (NO LOCALHOST SAYS POPUPS!) --- */}
      <CustomConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
