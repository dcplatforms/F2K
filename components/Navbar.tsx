import React from 'react';
import { ShoppingBag, ShieldCheck } from 'lucide-react';
import ViarFarmsLogo from './ViarFarmsLogo';

interface NavbarProps {
  activeTab: 'menu' | 'dashboard';
  setActiveTab: (tab: 'menu' | 'dashboard') => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ activeTab, setActiveTab, cartCount, onOpenCart }: NavbarProps) {
  return (
    <header id="main-nav" className="sticky top-0 z-40 bg-stone-900 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('menu')}>
            <ViarFarmsLogo variant="icon" size={54} className="shrink-0 hover:scale-105 transition-transform" />
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-none">Viar Farms</h1>
              <p className="text-[10px] text-amber-500 font-mono tracking-widest uppercase mt-1">Pasture-Raised • Est. 1947</p>
            </div>
          </div>

          {/* Nav Links - Center */}
          <nav className="hidden md:flex space-x-1">
            <button
              id="nav-menu-btn"
              onClick={() => setActiveTab('menu')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'menu'
                  ? 'bg-amber-600 text-stone-950 shadow-sm font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Browse Meat Menu
            </button>
            <button
              id="nav-office-btn"
              onClick={() => setActiveTab('dashboard')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-amber-600 text-stone-950 shadow-sm font-semibold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Farm Office (Dashboard)
            </button>
          </nav>

          {/* Cart Trigger & Actions */}
          <div className="flex items-center space-x-3">
            <button
              id="mobile-nav-office-btn"
              onClick={() => setActiveTab('dashboard')}
              className="md:hidden p-2 text-stone-300 hover:text-white rounded-full hover:bg-stone-800"
              title="Farm Office"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
            
            <button
              id="open-cart-btn"
              onClick={onOpenCart}
              className="relative bg-stone-800 hover:bg-stone-700 hover:scale-105 active:scale-95 text-stone-100 p-3 sm:px-4 sm:py-2.5 rounded-full transition-all duration-200 flex items-center space-x-2 border border-stone-700"
            >
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <span className="hidden sm:inline text-sm font-semibold text-stone-200">My Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-xs font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center animate-pulse border-2 border-stone-950">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
