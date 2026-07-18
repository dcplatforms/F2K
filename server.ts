import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Express middle-wares
app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI Client initialized successfully on the backend.');
  } catch (error) {
    console.error('Failed to initialize Gemini Client:', error);
  }
} else {
  console.warn('GEMINI_API_KEY is not defined or is placeholder. AI cooking assistant will run in mock mode.');
}

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
  res.json({ status: 'ok', time: new Date().toISOString(), aiEnabled: !!ai });
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

// 5. Generate dynamic recipe suggestions based on cart items using Gemini API
app.post('/api/generate-recipe', async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Array of item names or product objects
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items selected to generate a recipe.' });
    }

    const itemsListString = items.map((i: any) => `${i.name} (Qty: ${i.quantity})`).join(', ');

    if (!ai) {
      // Mock recipe response in case API key is missing or invalid
      console.log('Gemini AI not initialized. Returning high-quality mock farm recipe.');
      return res.json({
        recipeName: "Viar Farms Cast-Iron Seared Steak with Beef Marrow Butter",
        prepTime: "15 mins",
        cookTime: "25 mins",
        difficulty: "Easy",
        story: "A rustic, farmstead classic celebrating the natural depth of Viar Farms pasture-raised beef. By pairing your selected cuts with pure grass-fed beef tallow and simple aromatics, we bring the heart of the farm directly to your dinner table.",
        ingredients: [
          itemsListString,
          "2 tbsp Viar Farms Rendered Beef Tallow (or butter)",
          "4 cloves of Fresh Garlic, smashed",
          "3 sprigs of Fresh Rosemary",
          "1 tbsp Viar Farms Steakhouse Rub Blend (or coarse sea salt & black pepper)"
        ],
        instructions: [
          "Remove your Viar Farms beef from refrigeration 30 minutes prior to cooking to bring it to room temperature. This ensures an even, perfect cook.",
          "Pat the meat completely dry using paper towels. Moisture is the enemy of a golden-brown crust.",
          "Generously season all sides of the beef with the Viar Farms Steakhouse Rub Blend.",
          "Preheat a heavy cast-iron skillet over high heat until it begins to smoke slightly.",
          "Add the beef tallow to the skillet. Once melted and smoking hot, carefully lay the meat in the pan.",
          "Sear undisturbed for 2-3 minutes on each side to build a beautiful, rich mahogany crust.",
          "Turn heat to medium-low, toss in the smashed garlic and fresh rosemary sprigs. Tilt the pan and spoon the hot melted fat continuously over the meat for 2 more minutes.",
          "Remove beef from the skillet and let it rest on a warm board for at least 8-10 minutes. Resting is essential to lock in those luscious juices.",
          "Slice thin against the grain and serve alongside fresh roasted vegetables."
        ],
        chefTips: [
          "Always rest your meat! If you slice it too early, all the flavorful juices will pool on the cutting board instead of staying in your steak.",
          "Save any extra skillet drippings! Combine with red wine and beef bones broth to create an incredible rich pan sauce.",
          "If using tallow lotion, save it for your hands after washing up from your kitchen cooking!"
        ]
      });
    }

    const systemPrompt = `You are the Master Chef of Viar Farms, a premium pasture-raised farmstead.
Your goal is to provide a detailed, highly authentic, mouth-watering farm-to-table recipe and cooking guide utilizing the specific Viar Farms cuts or items selected by the customer.
Be warm, enthusiastic about farm-raised meats, and focus on rustic, high-quality cooking techniques (e.g., cast iron searing, low-and-slow smoking, braising, or baking with fresh eggs and tallow).

You must respond in JSON format matching the schema requested.`;

    const prompt = `Develop a gorgeous, professional farmstead recipe that features these purchased items: ${itemsListString}. 
The recipe should feel premium, cozy, and thoroughly celebrate the farm-to-table philosophy. Tell a story about the meal and offer expert butcher/chef tips.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipeName: {
              type: Type.STRING,
              description: 'The name of the rustic farm-to-table recipe.'
            },
            prepTime: {
              type: Type.STRING,
              description: 'Estimated preparation time (e.g. 15 mins).'
            },
            cookTime: {
              type: Type.STRING,
              description: 'Estimated cooking time (e.g. 45 mins).'
            },
            difficulty: {
              type: Type.STRING,
              description: 'Easy, Medium, or Advanced.'
            },
            story: {
              type: Type.STRING,
              description: 'A cozy 2-3 sentence story/background of the dish and how it connects to sustainable, farm-fresh pasture life.'
            },
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Detailed list of ingredients. Make sure to list the selected Viar Farms products first, then common household spices/vegetables/pantry items.'
            },
            instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Step-by-step cooking instructions with clear, expert culinary directions.'
            },
            chefTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Butcher or Chef secrets specifically tailored to these cuts, like the importance of resting meat, pan sauces, fat rendering, or heat control.'
            }
          },
          required: ['recipeName', 'prepTime', 'cookTime', 'difficulty', 'story', 'ingredients', 'instructions', 'chefTips']
        }
      }
    });

    const resultText = response.text || '';
    const parsedRecipe = JSON.parse(resultText.trim());
    res.json(parsedRecipe);

  } catch (error: any) {
    console.error('Error generating recipe with Gemini:', error);
    res.status(500).json({ error: 'Failed to generate recipe', details: error?.message || error });
  }
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
