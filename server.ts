import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Express middle-wares
app.use(express.json());

// In-memory simple store for orders to simulate database storage
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

const orders: Order[] = [];

// --- API ROUTES ---

// 1. Get health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Place an order
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { customerName, customerEmail, customerPhone, deliveryMethod, address, items, subtotal, deliveryFee, total } = req.body;
    
    if (!customerName || !customerEmail || !customerPhone || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required order details' });
    }

    const newOrder: Order = {
      id: 'VF-' + Math.floor(100000 + Math.random() * 900000),
      customerName,
      customerEmail,
      customerPhone,
      deliveryMethod,
      address,
      items,
      subtotal,
      deliveryFee,
      total,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder); // Add to beginning of array
    res.status(201).json({ success: true, order: newOrder });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to place order', details: error?.message || error });
  }
});

// 3. Get all orders (for simulated dashboard and user history)
app.get('/api/orders', (req: Request, res: Response) => {
  res.json({ orders });
});

// 4. Update order status (for realistic dashboard interactions)
app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  res.json({ success: true, order });
});


// --- VITE MIDDLEWARE CONFIGURATION ---

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    // Development mode: load Vite in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware integrated.');
  } else {
    // Production mode: serve built assets from dist/
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static asset serving configured.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Viar Farms backend listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
});
