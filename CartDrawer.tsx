import React, { useState } from 'react';
import { Product } from '../data';
import { X, Trash2, Plus, Minus, Truck, Store, MapPin, ClipboardList, AlertCircle, Sparkles } from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveOneFromCart: (productId: string) => void;
  onDeleteFromCart: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (orderDetails: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryMethod: 'delivery' | 'pickup';
    address?: string;
  }) => Promise<void>;
  userEmail?: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onAddToCart,
  onRemoveOneFromCart,
  onDeleteFromCart,
  onClearCart,
  onPlaceOrder,
  userEmail = 'customer@example.com',
}: CartDrawerProps) {
  
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('pickup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(userEmail || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'delivery' ? (subtotal >= 150 ? 0 : 10.00) : 0;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.length < 7) {
      setErrorMsg('Please enter a valid telephone number.');
      return;
    }
    if (deliveryMethod === 'delivery' && !address.trim()) {
      setErrorMsg('Please specify a delivery street address.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onPlaceOrder({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        deliveryMethod,
        address: deliveryMethod === 'delivery' ? address : undefined,
      });
      // Clear local form states on success
      setName('');
      setPhone('');
      setAddress('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit order. Please check connections.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop overlay */}
        <div 
          onClick={onClose} 
          className="absolute inset-0 bg-stone-900/60 transition-opacity backdrop-blur-xs" 
        />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-lg">
            <div className="flex h-full flex-col bg-white shadow-2xl border-l border-stone-200">
              
              {/* Header */}
              <div className="bg-stone-950 px-6 py-5 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-amber-500" />
                  <h2 className="font-serif text-lg font-bold" id="slide-over-title">
                    Your Farm Basket
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  {cartItems.length > 0 && (
                    <button
                      id="clear-basket-btn"
                      onClick={onClearCart}
                      className="text-xs text-stone-400 hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear Basket
                    </button>
                  )}
                  <button
                    id="close-cart-drawer"
                    onClick={onClose}
                    className="rounded-full p-1 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Content Pane */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                
                {cartItems.length === 0 ? (
                  <div className="h-96 flex flex-col items-center justify-center text-center">
                    <div className="bg-stone-100 p-6 rounded-full mb-4 text-stone-400">
                      <Store className="w-12 h-12" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-stone-800">Your basket is empty</h3>
                    <p className="text-xs text-stone-500 mt-1 max-w-xs">
                      Explore our premium cuts from the Viar Farms pastured meat menu and add them here.
                    </p>
                    <button
                      id="start-shopping-btn"
                      onClick={onClose}
                      className="mt-6 bg-amber-600 hover:bg-amber-700 text-stone-950 text-xs font-semibold px-5 py-2.5 rounded-full transition-colors"
                    >
                      Browse Menu Now
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Itemized List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono tracking-wider text-stone-400 uppercase border-b pb-1.5">
                        Selected Products ({cartItems.length})
                      </h4>
                      <div className="divide-y divide-stone-100 max-h-[220px] overflow-y-auto pr-1">
                        {cartItems.map((item) => (
                          <div key={item.product.id} className="py-3 flex justify-between items-center gap-3">
                            <div className="flex-1">
                              <h5 className="font-serif text-sm font-bold text-stone-900">{item.product.name}</h5>
                              <p className="text-[11px] text-stone-500">
                                ${item.product.price.toFixed(2)} / {item.product.unit}
                              </p>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                id={`cart-minus-${item.product.id}`}
                                onClick={() => onRemoveOneFromCart(item.product.id)}
                                className="bg-stone-100 hover:bg-stone-200 text-stone-700 p-1 rounded transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs font-bold text-stone-800 w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                id={`cart-plus-${item.product.id}`}
                                onClick={() => onAddToCart(item.product)}
                                className="bg-stone-100 hover:bg-stone-200 text-stone-700 p-1 rounded transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                id={`cart-delete-${item.product.id}`}
                                onClick={() => onDeleteFromCart(item.product.id)}
                                className="text-stone-300 hover:text-red-600 p-1.5 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Pickup Selector */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-mono tracking-wider text-stone-400 uppercase border-b pb-1.5">
                        Fulfillment Method
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          id="select-pickup-btn"
                          type="button"
                          onClick={() => setDeliveryMethod('pickup')}
                          className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all duration-200 text-left ${
                            deliveryMethod === 'pickup'
                              ? 'border-amber-600 bg-amber-50/40 text-amber-900 ring-2 ring-amber-500/20'
                              : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <Store className="w-5 h-5 text-amber-600" />
                          <span className="text-xs font-semibold">Farm Stand Pickup</span>
                          <span className="text-[10px] text-stone-500">Free • Green Valley</span>
                        </button>
                        <button
                          id="select-delivery-btn"
                          type="button"
                          onClick={() => setDeliveryMethod('delivery')}
                          className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all duration-200 text-left ${
                            deliveryMethod === 'delivery'
                              ? 'border-amber-600 bg-amber-50/40 text-amber-900 ring-2 ring-amber-500/20'
                              : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <Truck className="w-5 h-5 text-amber-600" />
                          <span className="text-xs font-semibold">Home Delivery</span>
                          <span className="text-[10px] text-stone-500">
                            {subtotal >= 150 ? 'FREE (Over $150)' : '$10.00 Local Delivery'}
                          </span>
                        </button>
                      </div>

                      {deliveryMethod === 'pickup' ? (
                        <div className="bg-stone-50 p-3 rounded-lg border border-stone-150 flex gap-2 text-xs text-stone-600">
                          <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <p className="font-semibold text-stone-800">Viar Farms Stand Location:</p>
                            <p className="text-[11px] mt-0.5">1098 Farmhouse Lane, Green Valley, IL</p>
                            <p className="text-[11px] text-stone-500 mt-0.5">Open Daily: 8:00 AM - 6:00 PM</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50/30 p-3 rounded-lg border border-amber-200/50 flex gap-2 text-xs text-amber-900">
                          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <p className="font-semibold text-amber-950">Pasture-to-Door Local Delivery:</p>
                            <p className="text-[11px] mt-0.5">We deliver in cold-insulated crates directly to your doorstep weekly.</p>
                            {subtotal < 150 && (
                              <p className="text-[11px] font-medium text-amber-700 mt-1">
                                Add ${(150 - subtotal).toFixed(2)} more for FREE delivery!
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Customer Info Form */}
                    <form onSubmit={handleSubmitOrder} className="space-y-3.5">
                      <h4 className="text-xs font-mono tracking-wider text-stone-400 uppercase border-b pb-1.5">
                        Customer Details
                      </h4>
                      
                      {errorMsg && (
                        <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg flex items-start gap-2 border border-red-100">
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      <div className="space-y-2.5">
                        <div>
                          <label htmlFor="customer-name" className="block text-[11px] font-semibold text-stone-600 mb-1">
                            Your Name *
                          </label>
                          <input
                            id="customer-name"
                            type="text"
                            required
                            placeholder="e.g. Thomas Cal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
                          />
                        </div>

                        <div>
                          <label htmlFor="customer-email" className="block text-[11px] font-semibold text-stone-600 mb-1">
                            Email Address *
                          </label>
                          <input
                            id="customer-email"
                            type="email"
                            required
                            placeholder="e.g. Thomas.P.Cal@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
                          />
                        </div>

                        <div>
                          <label htmlFor="customer-phone" className="block text-[11px] font-semibold text-stone-600 mb-1">
                            Phone Number *
                          </label>
                          <input
                            id="customer-phone"
                            type="tel"
                            required
                            placeholder="e.g. (309) 555-0123"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
                          />
                        </div>

                        {deliveryMethod === 'delivery' && (
                          <div>
                            <label htmlFor="customer-address" className="block text-[11px] font-semibold text-stone-600 mb-1">
                              Delivery Address *
                            </label>
                            <textarea
                              id="customer-address"
                              required
                              rows={2}
                              placeholder="Street Address, City, State, ZIP"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full text-xs p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
                            />
                          </div>
                        )}
                      </div>
                    </form>
                  </>
                )}
              </div>

              {/* Footer Order Summary & Checkout */}
              {cartItems.length > 0 && (
                <div className="border-t border-stone-200 bg-stone-50 px-6 py-5 space-y-4">
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Basket Subtotal</span>
                      <span className="font-mono font-semibold text-stone-800">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fulfillment ({deliveryMethod === 'pickup' ? 'Stand Pickup' : 'Home Delivery'})</span>
                      <span className="font-mono font-semibold text-stone-800">
                        {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-dashed pt-2 text-stone-800 font-bold">
                      <span className="text-sm">Estimated Total</span>
                      <span className="font-mono text-base text-stone-950">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    id="submit-order-btn"
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-3.5 px-4 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-stone-950" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Secure Farm Order</span>
                        <span>(${total.toFixed(2)})</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-stone-400 text-center leading-relaxed">
                    By placing an order, you agree to receive text/email notifications for delivery status updates directly from Viar Farms. Payment is settled securely at pickup or on delivery.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
