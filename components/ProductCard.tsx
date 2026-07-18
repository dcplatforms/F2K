import React from 'react';
import { Product } from '../data';
import { Plus, Minus, ShoppingCart, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  key?: string;
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onRemoveOneFromCart: (productId: string) => void;
}

export default function ProductCard({
  product,
  quantityInCart,
  onAddToCart,
  onRemoveOneFromCart,
}: ProductCardProps) {
  
  // Categorized subtle gradients or backgrounds
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'beef-premium':
        return {
          bg: 'bg-red-50/60 border-red-100',
          badge: 'bg-red-100 text-red-800 border-red-200',
          accentText: 'text-red-700',
          glow: 'shadow-red-500/5'
        };
      case 'beef-everyday':
        return {
          bg: 'bg-orange-50/60 border-orange-100',
          badge: 'bg-orange-100 text-orange-800 border-orange-200',
          accentText: 'text-orange-700',
          glow: 'shadow-orange-500/5'
        };
      case 'pork':
        return {
          bg: 'bg-pink-50/60 border-pink-100',
          badge: 'bg-pink-100 text-pink-800 border-pink-200',
          accentText: 'text-pink-700',
          glow: 'shadow-pink-500/5'
        };
      case 'specialties':
        return {
          bg: 'bg-amber-50/60 border-amber-100',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          accentText: 'text-amber-700',
          glow: 'shadow-amber-500/5'
        };
      case 'eggs':
        return {
          bg: 'bg-yellow-50/60 border-yellow-100',
          badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          accentText: 'text-yellow-700',
          glow: 'shadow-yellow-500/5'
        };
      default:
        return {
          bg: 'bg-emerald-50/60 border-emerald-100',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          accentText: 'text-emerald-700',
          glow: 'shadow-emerald-500/5'
        };
    }
  };

  const theme = getCategoryTheme(product.category);

  return (
    <div
      id={`product-${product.id}`}
      className={`relative flex flex-col justify-between p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300 group ${theme.bg} ${theme.glow}`}
    >
      {/* Category Indicator Tag */}
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border ${theme.badge}`}>
          {product.category.replace('-', ' ')}
        </span>
        {product.price > 20 && (
          <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-800 px-2 py-0.5 rounded font-medium border border-amber-200/55">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Premium Select
          </span>
        )}
      </div>

      {/* Product Name & Pricing */}
      <div className="mb-2">
        <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug group-hover:text-stone-950 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl font-mono font-bold text-stone-900">${product.price.toFixed(2)}</span>
          <span className="text-xs text-stone-500 font-medium">/ {product.unit}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-stone-600 leading-relaxed mb-5 flex-grow">
        {product.description}
      </p>

      {/* Action / Ordering Buttons */}
      <div className="space-y-2 mt-auto">
        {quantityInCart > 0 ? (
          <div className="flex items-center justify-between bg-stone-900 text-stone-100 rounded-xl p-1 shadow-sm transition-all">
            <button
              id={`minus-btn-${product.id}`}
              onClick={() => onRemoveOneFromCart(product.id)}
              className="p-2 hover:bg-stone-800 hover:text-amber-400 rounded-lg transition-colors"
              title="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-sm px-2 text-stone-200">
              {quantityInCart} {product.unit === 'lb' ? 'lbs' : product.unit}
            </span>
            <button
              id={`plus-btn-${product.id}`}
              onClick={() => onAddToCart(product)}
              className="p-2 hover:bg-stone-800 hover:text-amber-400 rounded-lg transition-colors"
              title="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={() => onAddToCart(product)}
            className="w-full bg-stone-900 hover:bg-amber-600 hover:text-stone-950 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-[1.01] shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Basket</span>
          </button>
        )}
      </div>
    </div>
  );
}
