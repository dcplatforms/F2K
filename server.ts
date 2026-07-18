import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { Client, Environment } from 'square';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Express middle-wares
app.use(express.json());

// Initialize Square Client
const squareClient = new Client({
  environment: (process.env.SQUARE_ENVIRONMENT || 'sandbox') as Environment,
  accessToken: process.env.SQUARE_PRODUCTION_API_KEY || process.env.SQUARE_SANDBOX_API_KEY || '',
});

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
  payment: {
    status: 'completed' | 'failed' | 'pending';
    transactionId?: string;
    method: string;
    last4: string;
  };
  createdAt: string;
}

const orders: Order[] = [];

// --- API ROUTES ---

// 1. Get health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Process Square Payment and Create Order
app.post('/api/process-payment', async (req: Request, res: Response) => {
  try {
    const {
      sourceId, // Square nonce/token
      customerName,
      customerEmail,
      customerPhone,
      deliveryMethod,
      address,
      items,
      subtotal,
      deliveryFee,
      total,
    } = req.body;

    // Validate required fields
    if (!sourceId || !customerName || !customerEmail || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required payment or order details' });
    }

    // Validate amount (prevent tampering)
    const calculatedTotal = Math.round(subtotal + deliveryFee);
    if (Math.abs(calculatedTotal - total) > 100) { // Allow 1 cent variance
      return res.status(400).json({ error: 'Order total does not match. Please try again.' });
    }

    // Generate order ID (used as idempotency key)
    const orderId = 'VF-' + Math.floor(100000 + Math.random() * 900000);

    // Process payment through Square
    const paymentsApi = squareClient.paymentsApi;
    const paymentResult = await paymentsApi.createPayment({
      sourceId: sourceId,
      amountMoney: {
        amount: BigInt(total), // Amount in cents
        currency: 'USD',
      },
      idempotencyKey: orderId, // Prevent duplicate charges
      customerId: `${customerEmail}`,
      receiptEmail: customerEmail,
      note: `Order from ${customerName}`,
    });

    if (!paymentResult.result?.payment) {
      throw new Error('Payment processing failed');
    }

    const payment = paymentResult.result.payment;

    // Payment successful - create order
    const newOrder: Order = {
      id: orderId,
      customerName,
      customerEmail,
      customerPhone,
      deliveryMethod,
      address: deliveryMethod === 'delivery' ? address : undefined,
      items,
      subtotal,
      deliveryFee,
      total,
      status: 'Pending',
      payment: {
        status: 'completed',
        transactionId: payment.id,
        method: payment.sourceType || 'card',
        last4: payment.cardDetails?.card?.last4 || 'XXXX',
      },
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    res.status(201).json({ success: true, order: newOrder });
  } catch (error: any) {
    console.error('Payment processing error:', error);

    // Extract Square error details if available
    const errorMsg = error?.errors?.[0]?.detail || error?.message || 'Payment processing failed';
    res.status(402).json({
      error: 'Payment failed',
      details: errorMsg,
    });
  }
});

// 3. Place an order (legacy endpoint - kept for backward compatibility, no payment)
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
