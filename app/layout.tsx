import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '../lib/cart-context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import MobileBottomNav from '../components/MobileBottomNav';
import ScrollToTop from '../components/ScrollToTop';

export const metadata: Metadata = {
  metadataBase: new URL('https://binriazfoods.com'),
  title: 'BIN RIAZ FOODS | Pure Goodness, Every Home',
  description:
    'BIN RIAZ FOODS — A Brand by BIN RIAZ GROUP OF COMPANIES. Premium Pakistani spices, luxury dry fruits, authentic Ajwa dates, pure Sidr honey, desi ghee, and celebratory gift hampers.',
  keywords: [
    'Bin Riaz Foods',
    'Pakistani Spices',
    'Dry Fruits Pakistan',
    'Ajwa Dates',
    'Pure Honey',
    'Desi Ghee',
    'Gift Hampers Pakistan',
    'Sargodha Food Brand',
  ],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'BIN RIAZ FOODS | Pure Goodness, Every Home',
    description:
      'Discover carefully selected food essentials, luxury dry fruits, pure spices, and thoughtful food gift hampers.',
    url: 'https://binriazfoods.com',
    siteName: 'BIN RIAZ FOODS',
    images: [
      {
        url: '/logo.png',
        width: 500,
        height: 500,
        alt: 'BIN RIAZ FOODS Official Logo',
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF6EC] text-[#202820]" suppressHydrationWarning>
        <CartProvider>
          <ScrollToTop />
          <Header />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <MobileBottomNav />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
