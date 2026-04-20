import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, X, Plus, Minus, Trash2, BookOpen, ChevronRight,
  Star, ArrowLeft, Phone, MapPin, BookMarked, BookCopy,
  Search, MessageCircle, ScrollText, Menu, XIcon
} from 'lucide-react';
import { CartProvider, useCart } from '@/hooks/useCart';
import { books, getBooksByCategory, getNewReleases, categoryInfo } from '@/data/books';
import type { Book, View, Language } from '@/types';
import { Toaster, toast } from 'sonner';
import './App.css';

// ===== NAVIGATION =====
function Navbar({ currentView, setView, setSelectedLanguage }: {
  currentView: View;
  setView: (v: View) => void;
  setSelectedLanguage: (l: Language) => void;
}) {
  const { totalItems, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goHome = () => {
    setView('home');
    setSelectedLanguage('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const goCategory = (lang: Language) => {
    setSelectedLanguage(lang);
    setView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <button onClick={goHome} className="flex flex-col items-start hover:opacity-80 transition-opacity">
          <span className="font-['Playfair_Display'] font-bold text-xl text-[#4A5D52] tracking-wide">
            MISHKATH
          </span>
          <span className="text-[10px] font-medium text-[#4A5D52]/70 tracking-[0.2em] uppercase">
            Research Institute
          </span>
        </button>

        {/* Desktop Language Pills */}
        <div className="hidden md:flex items-center gap-2">
          {(['tamil', 'english', 'sinhala'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => goCategory(lang)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                currentView === 'category'
                  ? 'bg-[#4A5D52] text-white shadow-md'
                  : 'bg-[#4A5D52]/10 text-[#4A5D52] hover:bg-[#4A5D52]/20'
              }`}
            >
              {lang === 'tamil' ? 'Tamil Books' : lang === 'english' ? 'English Books' : 'Sinhala Books'}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:bg-[#4A5D52]/10 rounded-full transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-[#4A5D52]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A84C] text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-[#4A5D52]/10 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <XIcon className="w-6 h-6 text-[#4A5D52]" /> : <Menu className="w-6 h-6 text-[#4A5D52]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#4A5D52]/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              <button onClick={goHome} className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#4A5D52]/10 text-[#4A5D52] font-medium">
                Home
              </button>
              {(['tamil', 'english', 'sinhala'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => goCategory(lang)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#4A5D52]/10 text-[#4A5D52] font-medium"
                >
                  {lang === 'tamil' ? '01. Tamil Language Books' : lang === 'english' ? '02. English Language Books' : '03. Sinhala Language Books'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ===== FOOTER =====
function Footer({ setView, setSelectedLanguage }: { setView: (v: View) => void; setSelectedLanguage: (l: Language) => void }) {
  const goTo = (lang: Language) => {
    setSelectedLanguage(lang);
    setView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#4A5D52] text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h3 className="font-['Playfair_Display'] text-xl font-bold mb-4">MISHKATH</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Research Institute dedicated to publishing authentic Islamic knowledge 
              in Tamil, Sinhala, and English languages.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-[#C9A84C]">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><button onClick={() => { setView('home'); window.scrollTo({ top: 0 }); }} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => goTo('tamil')} className="hover:text-white transition-colors">Browse Books</button></li>
              <li><button onClick={() => { setView('home'); setTimeout(() => document.getElementById('new-releases')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors">New Arrivals</button></li>
              <li><button onClick={() => { setView('home'); setTimeout(() => document.getElementById('how-to-order')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors">How to Order</button></li>
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h4 className="font-semibold mb-4 text-[#C9A84C]">Languages</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><button onClick={() => goTo('tamil')} className="hover:text-white transition-colors">Tamil Books (9)</button></li>
              <li><button onClick={() => goTo('english')} className="hover:text-white transition-colors">English Books (4)</button></li>
              <li><button onClick={() => goTo('sinhala')} className="hover:text-white transition-colors">Sinhala Books (2)</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-[#C9A84C]">Contact Us</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C9A84C]" />
                <span>+94 77 789 1344</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C9A84C]" />
                <span>Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <a href="https://wa.me/94777891344" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline">
                  WhatsApp Order
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/20 text-center text-white/50 text-sm">
          © 2025 Mishkath Research Institute. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

// ===== WHATSAPP FLOAT =====
function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/94777891344"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse-slow"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}

// ===== BOOK CARD =====
function BookCard({ book, onClick, onAdd }: { book: Book; onClick: () => void; onAdd: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <button onClick={onClick} className="w-full text-left">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F3EF]">
          <img
            src={book.image}
            alt={book.titleEn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {book.isNew && (
            <span className="absolute top-3 left-3 bg-[#8B2635] text-white text-xs font-bold px-3 py-1 rounded-full">
              NEW
            </span>
          )}
          <span className="absolute top-3 right-3 bg-[#4A5D52]/90 text-white text-xs font-medium px-2 py-1 rounded-full capitalize">
            {book.category}
          </span>
        </div>
      </button>

      <div className="p-4">
        <button onClick={onClick} className="w-full text-left">
          <h3 className="font-semibold text-[#2C2C2C] text-sm line-clamp-1 mb-1 hover:text-[#4A5D52] transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{book.author}</p>
        </button>
        <div className="flex items-center justify-between">
          <span className="text-[#C9A84C] font-bold text-lg">Rs. {book.price}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className="bg-[#4A5D52] hover:bg-[#3A4A42] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ===== CART SLIDE-IN =====
function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    const message = `Hello Mishkath Research Institute,%0A%0AI would like to order the following books:%0A%0A${items.map(item => `- ${item.titleEn} (Qty: ${item.quantity}) - Rs. ${item.price * item.quantity}`).join('%0A')}%0A%0ATotal: Rs. ${totalPrice}%0A%0APlease confirm my order.`;
    window.open(`https://wa.me/94777891344?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#2C2C2C]">
                Your Cart ({items.length})
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingCart className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="text-sm">Browse our books and add your favorites</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 bg-[#FAF8F5] p-4 rounded-xl"
                    >
                      <img src={item.image} alt={item.titleEn} className="w-20 h-28 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-[#2C2C2C] line-clamp-2">{item.titleEn}</h4>
                        <p className="text-[#C9A84C] font-bold mt-1">Rs. {item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t bg-white">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-[#C9A84C]">Rs. {totalPrice}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#C9A84C] hover:bg-[#B8983F] text-[#2C2C2C] font-bold py-4 rounded-xl transition-colors active:scale-[0.98]"
                >
                  Order via WhatsApp
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-[#4A5D52] text-sm mt-3 hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ===== HERO SECTION =====
function HeroSection({ onBrowse }: { onBrowse: (lang: Language) => void }) {
  return (
    <section className="min-h-[90vh] flex items-center justify-center relative bg-[#FAF8F5] pt-[72px]">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234A5D52' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#C9A84C] font-medium text-sm tracking-[0.3em] uppercase mb-6"
        >
          Publications
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-['Playfair_Display'] font-bold text-5xl md:text-6xl text-[#2C2C2C] leading-tight mb-6"
        >
          MISHKATH RESEARCH<br />INSTITUTE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-[#4A5D52] mb-10 max-w-2xl mx-auto"
        >
          Authentic Islamic Knowledge in Tamil, Sinhala & English
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => onBrowse('tamil')}
            className="bg-[#4A5D52] hover:bg-[#3A4A42] text-white px-8 py-4 rounded-full font-medium transition-all active:scale-95 shadow-lg"
          >
            <span className="flex items-center gap-2 justify-center">
              <BookOpen className="w-5 h-5" /> 01. Tamil Books
            </span>
          </button>
          <button
            onClick={() => onBrowse('english')}
            className="bg-[#4A5D52] hover:bg-[#3A4A42] text-white px-8 py-4 rounded-full font-medium transition-all active:scale-95 shadow-lg"
          >
            <span className="flex items-center gap-2 justify-center">
              <BookOpen className="w-5 h-5" /> 02. English Books
            </span>
          </button>
          <button
            onClick={() => onBrowse('sinhala')}
            className="bg-[#4A5D52] hover:bg-[#3A4A42] text-white px-8 py-4 rounded-full font-medium transition-all active:scale-95 shadow-lg"
          >
            <span className="flex items-center gap-2 justify-center">
              <BookOpen className="w-5 h-5" /> 03. Sinhala Books
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ===== BANNER CAROUSEL =====
function BannerCarousel() {
  const banners = [
    { image: '/assets/banner-new.jpg', title: 'New Arrivals', desc: 'Check out our latest publications', color: 'from-[#4A5D52]' },
    { image: '/assets/banner-offer.jpg', title: 'Special Offers', desc: 'Bundle discounts available', color: 'from-[#8B2635]' },
    { image: '/assets/banner-delivery.jpg', title: 'Free Delivery', desc: 'For orders above Rs. 2000', color: 'from-[#C9A84C]' },
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#F5EFE0] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl h-[200px] md:h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img src={banners[current].image} alt={banners[current].title} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-r ${banners[current].color} to-transparent opacity-80`} />
              <div className="absolute inset-0 flex items-center px-8 md:px-16">
                <div className="text-white">
                  <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold mb-2">{banners[current].title}</h3>
                  <p className="text-white/90 text-sm md:text-base">{banners[current].desc}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white w-8' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== NEW RELEASES =====
function NewReleasesSection({ onBookClick }: { onBookClick: (book: Book) => void }) {
  const newBooks = getNewReleases();
  const { addToCart } = useCart();

  return (
    <section id="new-releases" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#2C2C2C] mb-2">New Releases</h2>
            <p className="text-gray-500">Our latest publications</p>
          </div>
          <Star className="w-8 h-8 text-[#C9A84C]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <BookCard
                book={book}
                onClick={() => onBookClick(book)}
                onAdd={() => { addToCart(book); toast.success('Added to cart!'); }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== BROWSE BY LANGUAGE =====
function BrowseByLanguageSection({ onBrowse }: { onBrowse: (lang: Language) => void }) {
  const categories = [
    { key: 'tamil' as Language, native: 'தமிழ்', name: 'Tamil Language', count: 9, icon: BookCopy },
    { key: 'english' as Language, native: 'English', name: 'English Language', count: 4, icon: BookMarked },
    { key: 'sinhala' as Language, native: 'සිංහල', name: 'Sinhala Language', count: 2, icon: ScrollText },
  ];

  return (
    <section className="py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#2C2C2C] mb-3">
            Browse by Language
          </h2>
          <p className="text-gray-500 text-lg">Select your preferred language to explore our collection</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.key}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              onClick={() => onBrowse(cat.key)}
              className="group relative bg-[#E8EDEA] hover:bg-[#4A5D52] rounded-2xl p-8 text-center transition-all duration-300 overflow-hidden"
            >
              <div className="relative z-10">
                <cat.icon className="w-12 h-12 text-[#4A5D52] group-hover:text-[#C9A84C] mx-auto mb-4 transition-colors" />
                <h3 className="text-3xl font-bold text-[#4A5D52] group-hover:text-white mb-1 transition-colors">
                  {cat.native}
                </h3>
                <p className="text-[#4A5D52]/70 group-hover:text-white/70 font-medium transition-colors">
                  {cat.name}
                </p>
                <p className="text-sm text-[#4A5D52]/50 group-hover:text-white/50 mt-2 transition-colors">
                  {cat.count} Books
                </p>
                <ChevronRight className="w-6 h-6 text-[#C9A84C] mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== FEATURED BOOKS =====
function FeaturedBooksSection({ onBookClick }: { onBookClick: (book: Book) => void }) {
  const [filter, setFilter] = useState<Language>('all');
  const { addToCart } = useCart();
  const filteredBooks = filter === 'all' ? books : books.filter(b => b.category === filter);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#2C2C2C] mb-2">Featured Collection</h2>
            <p className="text-gray-500">Handpicked books from our catalog</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'tamil', 'english', 'sinhala'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-[#4A5D52] text-white'
                    : 'bg-[#4A5D52]/10 text-[#4A5D52] hover:bg-[#4A5D52]/20'
                }`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBooks.slice(0, 6).map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => onBookClick(book)}
                onAdd={() => { addToCart(book); toast.success('Added to cart!'); }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ===== HOW TO ORDER =====
function HowToOrderSection() {
  const steps = [
    { icon: '/assets/step-browse.jpg', title: 'Browse & Select', desc: 'Explore our collection and choose your books', Icon: Search },
    { icon: '/assets/step-cart.jpg', title: 'Add to Cart', desc: 'Add your favorite books to the cart', Icon: ShoppingCart },
    { icon: '/assets/step-whatsapp.jpg', title: 'Order via WhatsApp', desc: 'Send your order to +94 77 789 1344', Icon: Phone },
  ];

  return (
    <section id="how-to-order" className="py-20 bg-[#E8EDEA]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#2C2C2C] mb-3">How to Order</h2>
          <p className="text-gray-500">Simple 3-step process to get your books</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center"
            >
              <div className="relative mb-6 mx-auto w-32 h-32">
                <img src={step.icon} alt={step.title} className="w-full h-full object-cover rounded-2xl shadow-lg" />
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-[#C9A84C] rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {i + 1}
                </div>
              </div>
              <step.Icon className="w-8 h-8 text-[#4A5D52] mx-auto mb-3" />
              <h3 className="font-bold text-lg text-[#2C2C2C] mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.desc}</p>
            </motion.div>
          ))}

          {/* Connector lines (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[33%] right-[33%] h-0.5 border-t-2 border-dashed border-[#C9A84C]/40" />
        </div>
      </div>
    </section>
  );
}

// ===== CATEGORY VIEW =====
function CategoryView({ language, onBookClick, onBack }: {
  language: Language;
  onBookClick: (book: Book) => void;
  onBack: () => void;
}) {
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'newest'>('default');

  const catBooks = language === 'all' ? books : getBooksByCategory(language as 'tamil' | 'english' | 'sinhala');
  const info = language !== 'all' ? categoryInfo[language as 'tamil' | 'english' | 'sinhala'] : null;

  const sortedBooks = [...catBooks].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return 0;
  });

  return (
    <div className="pt-[72px] min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#4A5D52] to-[#3A4A42] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          {info && (
            <div>
              <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-2">
                {info.nativeName}
              </h1>
              <p className="text-white/70">{info.name} Books — {sortedBooks.length} titles</p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Sort */}
        <div className="flex justify-end mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 rounded-lg border border-[#4A5D52]/20 bg-white text-sm text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#4A5D52]"
          >
            <option value="default">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {sortedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => onBookClick(book)}
                onAdd={() => { addToCart(book); toast.success('Added to cart!'); }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

// ===== BOOK DETAIL VIEW =====
function BookDetailView({ book, onBack }: { book: Book; onBack: () => void }) {
  const { addToCart } = useCart();

  const handleWhatsAppOrder = () => {
    const message = `Hello Mishkath Research Institute,%0A%0AI would like to order:%0A%0A- ${book.titleEn}%0APrice: Rs. ${book.price}%0A%0APlease confirm my order.`;
    window.open(`https://wa.me/94777891344?text=${message}`, '_blank');
  };

  return (
    <div className="pt-[72px] min-h-screen bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <button onClick={onBack} className="flex items-center gap-2 text-[#4A5D52] hover:text-[#3A4A42] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <img
              src={book.image}
              alt={book.titleEn}
              className="w-full max-h-[500px] object-contain rounded-xl"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <span className="inline-block self-start bg-[#E8EDEA] text-[#4A5D52] text-sm font-bold px-3 py-1 rounded-full mb-4">
              {book.id}
            </span>

            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-2">
              {book.title}
            </h1>
            <p className="text-gray-500 text-lg mb-1">{book.subtitle}</p>
            <p className="text-[#4A5D52] font-medium mb-6">by {book.author}</p>

            <p className="text-gray-600 leading-relaxed mb-8">{book.description}</p>

            <div className="flex items-center gap-3 mb-8">
              <span className="capitalize px-3 py-1 bg-[#4A5D52]/10 text-[#4A5D52] rounded-full text-sm font-medium">
                {book.category}
              </span>
              {book.isNew && (
                <span className="px-3 py-1 bg-[#8B2635]/10 text-[#8B2635] rounded-full text-sm font-medium">
                  New Release
                </span>
              )}
            </div>

            <div className="text-4xl font-bold text-[#C9A84C] mb-8">Rs. {book.price}</div>

            <div className="space-y-3 mt-auto">
              <button
                onClick={() => { addToCart(book); toast.success('Added to cart!'); }}
                className="w-full bg-[#4A5D52] hover:bg-[#3A4A42] text-white py-4 rounded-xl font-bold text-lg transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366] hover:bg-[#1DA855] text-white py-4 rounded-xl font-bold text-lg transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> Order via WhatsApp
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN APP =====
function AppContent() {
  const [view, setView] = useState<View>('home');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleBrowse = useCallback((lang: Language) => {
    setSelectedLanguage(lang);
    setView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBookClick = useCallback((book: Book) => {
    setSelectedBook(book);
    setView('bookDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback(() => {
    if (view === 'bookDetail') {
      setView('category');
    } else {
      setView('home');
      setSelectedLanguage('all');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Toaster position="top-right" richColors />
      <Navbar currentView={view} setView={setView} setSelectedLanguage={setSelectedLanguage} />
      <CartDrawer />
      <WhatsAppFloat />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HeroSection onBrowse={handleBrowse} />
            <BannerCarousel />
            <NewReleasesSection onBookClick={handleBookClick} />
            <BrowseByLanguageSection onBrowse={handleBrowse} />
            <FeaturedBooksSection onBookClick={handleBookClick} />
            <HowToOrderSection />
            <Footer setView={setView} setSelectedLanguage={setSelectedLanguage} />
          </motion.div>
        )}

        {view === 'category' && (
          <motion.div
            key="category"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CategoryView
              language={selectedLanguage}
              onBookClick={handleBookClick}
              onBack={handleBack}
            />
            <Footer setView={setView} setSelectedLanguage={setSelectedLanguage} />
          </motion.div>
        )}

        {view === 'bookDetail' && selectedBook && (
          <motion.div
            key="bookDetail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BookDetailView book={selectedBook} onBack={handleBack} />
            <Footer setView={setView} setSelectedLanguage={setSelectedLanguage} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
