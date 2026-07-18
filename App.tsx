import React, { useState, useEffect } from 'react';
import { CATEGORIES, PRODUCTS, Product } from './data';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import ViarFarmsLogo from './components/ViarFarmsLogo';
import { Search, Filter, CheckCircle2, ClipboardList, MapPin, Store, Truck, X } from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: 'delivery' | 'pickup';
  address?: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Pending' | 'Preparing' | 'Ready for Pickup' | 'Out for Delivery' | 'Completed';
  createdAt: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'menu' | 'dashboard'>('menu');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('viar_farms_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [orders, setOrders] = useState<Order[]>([]);
  const [placedOrderReceipt, setPlacedOrderReceipt] = useState<Order | null>(null);

  // User details
  const defaultUserEmail = 'Thomas.P.Cal@gmail.com';

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('viar_farms_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch orders on mount
  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders);
        } else {
          // If no orders, seed initial historical sample orders so the portal is loaded
          handleSeedSampleOrders();
        }
      })
      .catch(err => {
        console.warn('API server is initializing. Seeding initial local orders.', err);
        handleSeedSampleOrders();
      });
  }, []);

  // Handlers for cart
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveOneFromCart = (productId: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const handleDeleteFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Submit Order to full-stack API
  const handlePlaceOrder = async (details: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryMethod: 'delivery' | 'pickup';
    address?: string;
  }) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const deliveryFee = details.deliveryMethod === 'delivery' ? (subtotal >= 150 ? 0 : 10.00) : 0;
    const total = subtotal + deliveryFee;

    const payload = {
      ...details,
      items: cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        category: item.product.category,
      })),
      subtotal,
      deliveryFee,
      total,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to place order on the farm server');
      
      const data = await res.json();
      if (data.success && data.order) {
        // Append order to active state
        setOrders(prev => [data.order, ...prev]);
        setPlacedOrderReceipt(data.order);
        setCartItems([]); // Clear cart on success
        setIsCartOpen(false); // Close cart panel
      }
    } catch (err: any) {
      console.error(err);
      // Fallback local mock simulation in case server environment has connection lag
      const mockOrder: Order = {
        id: 'VF-' + Math.floor(100000 + Math.random() * 900000),
        ...payload,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      setOrders(prev => [mockOrder, ...prev]);
      setPlacedOrderReceipt(mockOrder);
      setCartItems([]);
      setIsCartOpen(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      } else {
        // Local state fallback
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } catch (err) {
      // Local state fallback
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  const handleSeedSampleOrders = () => {
    const samples: Order[] = [
      {
        id: 'VF-482910',
        customerName: 'Thomas Cal',
        customerEmail: 'Thomas.P.Cal@gmail.com',
        customerPhone: '(309) 555-1928',
        deliveryMethod: 'delivery',
        address: '128 Birch Boulevard, Green Valley, IL',
        items: [
          { id: 'cowboy-rib-tomahawk', name: 'Cowboy Rib / Tomahawk', price: 30.00, quantity: 2, category: 'beef-premium' },
          { id: 'bacon', name: 'Bacon', price: 16.00, quantity: 3, category: 'pork' },
          { id: 'dozen-eggs', name: 'Dozen Eggs', price: 9.00, quantity: 2, category: 'eggs' }
        ],
        subtotal: 126.00,
        deliveryFee: 10.00,
        total: 136.00,
        status: 'Preparing',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
      },
      {
        id: 'VF-903482',
        customerName: 'Sarah Jenkins',
        customerEmail: 'sarah.jenkins@gmail.com',
        customerPhone: '(312) 555-0918',
        deliveryMethod: 'pickup',
        items: [
          { id: 'filet-mignon', name: 'Filet Mignon', price: 29.30, quantity: 4, category: 'beef-premium' },
          { id: 'tallow-16-oz', name: 'Tallow 16 oz', price: 12.00, quantity: 1, category: 'tallow-pantry' }
        ],
        subtotal: 129.20,
        deliveryFee: 0.00,
        total: 129.20,
        status: 'Ready for Pickup',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString() // 12 hours ago
      },
      {
        id: 'VF-103948',
        customerName: 'Michael Peterson',
        customerEmail: 'm.peterson@yahoo.com',
        customerPhone: '(217) 555-8910',
        deliveryMethod: 'delivery',
        address: '901 Pasture Lane, Lincoln, IL',
        items: [
          { id: 'pork-butt-roast', name: 'Pork Butt Roast', price: 8.50, quantity: 2, category: 'pork' },
          { id: 'sausage-link', name: 'Sausage-Link', price: 11.50, quantity: 4, category: 'pork' },
          { id: 'spices', name: 'Spices Rub Blend', price: 16.00, quantity: 2, category: 'tallow-pantry' }
        ],
        subtotal: 95.00,
        deliveryFee: 10.00,
        total: 105.00,
        status: 'Completed',
        createdAt: new Date(Date.now() - 3600000 * 36).toISOString() // 36 hours ago
      }
    ];

    // Seed server or write to state
    samples.forEach(s => {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s)
      }).catch(() => {});
    });

    setOrders(samples);
  };

  // Filtered Products Logic
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low-high') return a.price - b.price;
    if (sortBy === 'price-high-low') return b.price - a.price;
    if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
    return 0; // Default ordering
  });

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div id="app-root" className="min-h-screen bg-stone-50/50 flex flex-col font-sans text-stone-800">
      
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Container Content */}
      <main className="flex-grow pb-16">
        
        {activeTab === 'menu' && (
          <div className="space-y-10">
            {/* Elegant Hero Banner */}
            <section className="bg-stone-900 text-white relative py-12 sm:py-16 overflow-hidden border-b border-stone-800">
              <div className="absolute inset-0 bg-radial-gradient from-stone-900/60 to-stone-950/95" />
              <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex-1 text-center md:text-left space-y-4">
                  <span className="inline-block text-[10px] sm:text-xs font-mono tracking-widest text-amber-500 uppercase font-bold px-3 py-1 bg-stone-800 rounded-full border border-stone-750">
                    🌱 100% Grass-Fed & Pasture-Raised Meat
                  </span>
                  <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
                    Premium Farm-to-Table Meat Market
                  </h2>
                  <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
                    Direct from Viar Farms to your dinner table. Raised ethically, processed locally, and loaded with rich heirloom country flavor.
                  </p>
                  
                  {/* Visual Badges Row */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-xs text-stone-400 font-mono pt-4 border-t border-stone-800 max-w-lg">
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-500">✔</span> Zero Added Hormones
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-500">✔</span> Rotational Grazing
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-500">✔</span> Local IL Delivery
                    </div>
                  </div>
                </div>

                {/* Interactive Logo Badge */}
                <div className="shrink-0 flex items-center justify-center bg-stone-950 p-6 rounded-3xl border border-stone-850 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 to-transparent opacity-60 pointer-events-none" />
                  <ViarFarmsLogo variant="badge" size={160} className="relative z-10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105" />
                </div>
              </div>
            </section>

            {/* Shopping & Filtering Workspace */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              
              {/* Filter Toolbar Card */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Search Ribeye, Pork Butt, Tallow Lotion, Eggs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 bg-stone-50/50"
                    />
                  </div>

                  {/* Sorting Control */}
                  <div className="flex items-center gap-2 self-start md:self-auto text-xs text-stone-600">
                    <Filter className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-semibold">Sort:</span>
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-stone-200 rounded-lg p-2 bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="default">Default Catalog Order</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                      <option value="alphabetical">Alphabetical A-Z</option>
                    </select>
                  </div>
                </div>

                {/* Categories Quick Filter Row */}
                <div className="border-t border-stone-100 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2.5 font-semibold">
                    <span>Filter Category:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      id="cat-all-btn"
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                        selectedCategory === 'all'
                          ? 'bg-amber-600 text-stone-950 border-amber-600 shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-250'
                      }`}
                    >
                      All Products ({PRODUCTS.length})
                    </button>
                    {CATEGORIES.map((cat) => {
                      const count = PRODUCTS.filter(p => p.category === cat.id).length;
                      return (
                        <button
                          id={`cat-${cat.id}-btn`}
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                            selectedCategory === cat.id
                              ? 'bg-amber-600 text-stone-950 border-amber-600 shadow-xs'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-250'
                          }`}
                        >
                          {cat.name} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Product Listing Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-2xl p-16 text-center space-y-3">
                  <p className="text-sm font-semibold text-stone-700">No farm products matched your query.</p>
                  <p className="text-xs text-stone-400">Try adjusting your filters or clearing your search term.</p>
                  <button
                    id="clear-filters-btn"
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="text-xs text-amber-700 font-semibold hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => {
                    const cartItem = cartItems.find(item => item.product.id === product.id);
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantityInCart={cartItem ? cartItem.quantity : 0}
                        onAddToCart={handleAddToCart}
                        onRemoveOneFromCart={handleRemoveOneFromCart}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <AdminDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSeedSampleOrders={handleSeedSampleOrders}
          />
        )}

      </main>

      {/* Cart sliding overlay drawer component */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onRemoveOneFromCart={handleRemoveOneFromCart}
        onDeleteFromCart={handleDeleteFromCart}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
        userEmail={defaultUserEmail}
      />

      {/* Success Order Confirmation Modal */}
      {placedOrderReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 max-w-lg w-full shadow-2xl relative space-y-5 animate-fade-in max-h-[90vh] overflow-y-auto">
            
            {/* Header Badge */}
            <div className="flex flex-col items-center text-center space-y-3 border-b border-stone-100 pb-5">
              <div className="relative mb-2">
                <ViarFarmsLogo variant="badge" size={110} />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Your Farm Order is Locked In!</h3>
              <p className="text-xs text-stone-500 font-mono tracking-wide uppercase">
                Invoice ID: {placedOrderReceipt.id}
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="space-y-3.5 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-150">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-semibold text-stone-800">Fulfillment:</span>
                <span className="font-bold flex items-center gap-1">
                  {placedOrderReceipt.deliveryMethod === 'delivery' ? (
                    <>
                      <Truck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pasture-to-Door Delivery</span>
                    </>
                  ) : (
                    <>
                      <Store className="w-3.5 h-3.5 text-amber-600" />
                      <span>Farm Stand Pickup</span>
                    </>
                  )}
                </span>
              </div>

              {placedOrderReceipt.deliveryMethod === 'delivery' && (
                <div className="pb-2 border-b text-[11px] text-stone-500 space-y-1">
                  <span className="font-bold text-stone-700">Delivery Address:</span>
                  <p>{placedOrderReceipt.address}</p>
                </div>
              )}

              {/* Items Table */}
              <div className="space-y-2">
                <span className="font-bold text-stone-800 text-[11px] uppercase tracking-wider font-mono">Basket Items:</span>
                <div className="space-y-1 divide-y divide-stone-200/50">
                  {placedOrderReceipt.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between py-1 text-stone-600 first:pt-0">
                      <span>{it.name} <strong className="text-stone-400">x{it.quantity}</strong></span>
                      <span className="font-mono text-stone-800">${(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals table */}
              <div className="border-t pt-3 space-y-1 font-mono text-[11px] text-stone-500">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${placedOrderReceipt.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery fee:</span>
                  <span>${placedOrderReceipt.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-sm pt-1.5 border-t border-dashed">
                  <span>Amount Due on Delivery/Pickup:</span>
                  <span className="text-stone-950">${placedOrderReceipt.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                id="receipt-close-btn"
                onClick={() => setPlacedOrderReceipt(null)}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all text-center"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h4 className="font-serif text-lg font-bold text-stone-200">Viar Farms Pastured Meats</h4>
          <p className="text-xs max-w-md mx-auto leading-relaxed text-stone-400">
            Proudly delivering wholesome pasture-raised steaks, premium roasts, farm pork, fresh nesting-box eggs, and healthy grass-fed tallows across Green Valley and neighboring communities.
          </p>
          <div className="text-[10px] text-stone-600 font-mono">
            © 2026 Viar Farms. All Rights Reserved. • Powered by AI Studio server-side integrations.
          </div>
        </div>
      </footer>

    </div>
  );
}
