import React, { useState, useEffect } from 'react';
import ViarFarmsLogo from './ViarFarmsLogo';
import { TrendingUp, Coins, ShoppingBag, ShieldAlert, CheckCircle, Package, ArrowRight, User, Phone, MapPin, Mail, Sparkles } from 'lucide-react';

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

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => Promise<void>;
  onSeedSampleOrders: () => void;
}

export default function AdminDashboard({ orders, onUpdateOrderStatus, onSeedSampleOrders }: AdminDashboardProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Auto-select first order if none selected and orders exist
  useEffect(() => {
    if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0]);
    }
  }, [orders, selectedOrder]);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      setLoadingId(orderId);
      await onUpdateOrderStatus(orderId, status);
      // Update selected order view
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setLoadingId(null);
    }
  };

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  
  // Count counts of statuses
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const preparingCount = orders.filter(o => o.status === 'Preparing').length;
  const activeCount = orders.filter(o => o.status === 'Ready for Pickup' || o.status === 'Out for Delivery').length;
  const completedCount = orders.filter(o => o.status === 'Completed').length;

  // Count Category breakdowns
  const categorySales: { [key: string]: number } = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      const cat = item.category || 'other';
      categorySales[cat] = (categorySales[cat] || 0) + (item.price * item.quantity);
    });
  });

  const categoriesList = [
    { id: 'beef-premium', label: 'Premium Steaks', color: 'bg-red-500', fill: '#ef4444' },
    { id: 'beef-everyday', label: 'Everyday Beef', color: 'bg-orange-500', fill: '#f97316' },
    { id: 'pork', label: 'Farm Pork', color: 'bg-pink-500', fill: '#ec4899' },
    { id: 'specialties', label: 'Specialties', color: 'bg-amber-500', fill: '#f59e0b' },
    { id: 'eggs', label: 'Fresh Eggs', color: 'bg-yellow-500', fill: '#eab308' },
    { id: 'tallow-pantry', label: 'Tallow & Pantry', color: 'bg-emerald-500', fill: '#10b981' },
  ];

  const maxVal = Math.max(...categoriesList.map(c => categorySales[c.id] || 0), 1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div className="flex items-center gap-3">
          <ViarFarmsLogo variant="icon" size={50} className="shrink-0" />
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">Viar Farms Office Portal</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Real-time management panel for incoming pasture-raised meat and egg orders.
            </p>
          </div>
        </div>
        {orders.length === 0 && (
          <button
            id="seed-orders-btn"
            onClick={onSeedSampleOrders}
            className="bg-stone-900 hover:bg-amber-600 hover:text-stone-950 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Historical Sample Orders
          </button>
        )}
      </div>

      {/* Stats Summary Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="bg-amber-100 text-amber-800 p-3.5 rounded-xl">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold">Total Sales</p>
            <h3 className="font-mono text-2xl font-bold text-stone-900">${totalRevenue.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="bg-emerald-100 text-emerald-800 p-3.5 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold">Orders Received</p>
            <h3 className="font-mono text-2xl font-bold text-stone-900">{totalOrdersCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="bg-blue-100 text-blue-800 p-3.5 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold">In Prep / Active</p>
            <h3 className="font-mono text-2xl font-bold text-stone-900">{preparingCount + activeCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="bg-stone-100 text-stone-800 p-3.5 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold">Fulfillments Done</p>
            <h3 className="font-mono text-2xl font-bold text-stone-900">{completedCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Orders list & Category breakdown chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Category Revenue breakdown Chart */}
          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-xs space-y-4">
            <h4 className="font-serif text-sm font-bold text-stone-900">
              Revenue Distribution by Category
            </h4>
            <div className="space-y-3 pt-1">
              {categoriesList.map((cat) => {
                const sales = categorySales[cat.id] || 0;
                const percentage = Math.round((sales / maxVal) * 100) || 0;
                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex justify-between items-baseline text-[11px] text-stone-600">
                      <span className="font-semibold">{cat.label}</span>
                      <span className="font-mono text-stone-800 font-bold">${sales.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${cat.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orders Log */}
          <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
              <h4 className="font-serif text-sm font-bold text-stone-900">
                Orders Queue ({orders.length})
              </h4>
              <div className="flex gap-2 text-[10px] font-mono text-stone-500">
                <span>Pending: <strong className="text-amber-600">{pendingCount}</strong></span>
                <span>•</span>
                <span>Preparing: <strong className="text-blue-600">{preparingCount}</strong></span>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-10 text-center text-stone-400">
                <p className="text-xs">No customer orders recorded yet.</p>
                <button
                  id="seed-prompt-btn"
                  onClick={onSeedSampleOrders}
                  className="mt-3 text-xs text-amber-700 hover:underline font-semibold"
                >
                  Load sample data to test workflows
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-100 max-h-[400px] overflow-y-auto">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                      selectedOrder?.id === o.id ? 'bg-amber-500/5 border-l-4 border-amber-600' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-900">{o.id}</span>
                        <span className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border ${
                          o.status === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          o.status === 'Preparing' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          o.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          'bg-stone-100 text-stone-800 border-stone-200'
                        }`}>
                          {o.status}
                        </span>
                      </div>
                      <div className="text-xs text-stone-600">
                        {o.customerName} <span className="text-stone-400">•</span> {o.items.length} items
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="font-mono text-xs font-bold text-stone-900">
                        ${o.total.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Selected Order Detail Inspector */}
        <div className="space-y-6">
          {selectedOrder ? (
            <div id="order-inspector" className="bg-stone-900 text-stone-100 rounded-3xl p-5 border border-stone-800 shadow-md space-y-5 sticky top-24">
              <div className="border-b border-stone-800 pb-4">
                <div className="text-[10px] font-mono tracking-wider text-amber-500 uppercase font-bold">ORDER INSPECTOR</div>
                <h4 className="font-serif text-lg font-bold text-white mt-1">Invoice ID: {selectedOrder.id}</h4>
                <p className="text-[10px] text-stone-400">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>

              {/* Status Manager Controls */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono tracking-wider text-stone-400 uppercase">UPDATE PROCESS STATE</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="set-preparing-btn"
                    onClick={() => handleStatusChange(selectedOrder.id, 'Preparing')}
                    className={`py-2 text-[10px] font-bold rounded-lg transition-colors ${
                      selectedOrder.status === 'Preparing' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                    }`}
                  >
                    Preparing
                  </button>
                  <button
                    id="set-transit-btn"
                    onClick={() => handleStatusChange(
                      selectedOrder.id, 
                      selectedOrder.deliveryMethod === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup'
                    )}
                    className={`py-2 text-[10px] font-bold rounded-lg transition-colors ${
                      selectedOrder.status === 'Ready for Pickup' || selectedOrder.status === 'Out for Delivery'
                        ? 'bg-amber-600 text-stone-950 font-bold' 
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                    }`}
                  >
                    {selectedOrder.deliveryMethod === 'delivery' ? 'In Transit' : 'Ready'}
                  </button>
                  <button
                    id="set-completed-btn"
                    className={`py-2 text-[10px] font-bold rounded-lg transition-colors col-span-2 ${
                      selectedOrder.status === 'Completed' 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                    }`}
                    onClick={() => handleStatusChange(selectedOrder.id, 'Completed')}
                  >
                    Completed & Handed Over
                  </button>
                </div>
              </div>

              {/* Buyer Contact Details */}
              <div className="space-y-2 text-xs border-t border-stone-800 pt-4">
                <div className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">BUYER CONTACT</div>
                <div className="space-y-2 text-stone-300">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      {selectedOrder.deliveryMethod === 'pickup' 
                        ? 'Self-Pickup at Viar Farms Stand' 
                        : selectedOrder.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Itemized Invoice Details */}
              <div className="space-y-2.5 border-t border-stone-800 pt-4 text-xs">
                <div className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">ITEMIZED INVOICE</div>
                <div className="space-y-2 divide-y divide-stone-800/40">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between pt-1.5 first:pt-0">
                      <div>
                        <span className="font-semibold text-white">{it.name}</span>
                        <span className="text-stone-400 text-[10px] ml-1.5">x{it.quantity}</span>
                      </div>
                      <span className="font-mono text-stone-300">${(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-800 pt-3 space-y-1 font-mono text-[11px] text-stone-400">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-xs pt-1.5">
                    <span>Grand Total:</span>
                    <span className="text-amber-400">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200 p-8 rounded-3xl text-center text-stone-400">
              <p className="text-xs">Select an order from the queue to view contact details, update delivery states, and examine invoices.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
