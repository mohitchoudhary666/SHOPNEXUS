/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS } from './src/data';
import { Product, Order, Review } from './src/types';

// In-memory Database for presentation continuity
let DB_PRODUCTS: Product[] = [...INITIAL_PRODUCTS];
let DB_ORDERS: Order[] = [];
let DB_REVIEWS: Review[] = [
  { id: 'rev-1', productId: 'prod-1', userName: 'Aman Sharma', rating: 5, comment: 'Incredible performance and superb camera. Value for money phone!', date: '2026-05-18' },
  { id: 'rev-2', productId: 'prod-1', userName: 'Priya Iyer', rating: 4, comment: 'Good battery backup, screen is gorgeous.', date: '2026-05-19' },
  { id: 'rev-3', productId: 'prod-2', userName: 'Rohan Deshmukh', rating: 5, comment: 'Perfect programming machine. Extremely fast and whisper quiet!', date: '2026-05-15' },
  { id: 'rev-4', productId: 'prod-3', userName: 'Sneha Patel', rating: 4, comment: 'ANC is outstanding. Slightly heavy for long running sessions but sound is pristine.', date: '2026-05-20' },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // Server-side lazy-initialization for Gemini AI
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('⚠️ GEMINI_API_KEY environment variable is not defined. AI assistant will run in simulation mode.');
        return null;
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // --- API ROUTING SECTION ---

  // Product CRUD
  app.get('/api/products', (req, res) => {
    res.json(DB_PRODUCTS);
  });

  app.post('/api/products', (req, res) => {
    try {
      const newProduct: Product = req.body;
      if (!newProduct.name || !newProduct.price) {
        res.status(400).json({ error: 'Product name and price are required' });
        return;
      }
      const created: Product = {
        ...newProduct,
        id: `prod-${Date.now()}`,
        rating: 5.0,
        reviewCount: 0,
        features: newProduct.features || [],
        specs: newProduct.specs || {},
        stock: newProduct.stock || 10
      };
      DB_PRODUCTS.push(created);
      res.status(211).json(created);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/products/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const index = DB_PRODUCTS.findIndex((p) => p.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      DB_PRODUCTS[index] = {
        ...DB_PRODUCTS[index],
        ...updatedData
      };
      res.json(DB_PRODUCTS[index]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/products/:id', (req, res) => {
    try {
      const { id } = req.params;
      const index = DB_PRODUCTS.findIndex((p) => p.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      const deleted = DB_PRODUCTS.splice(index, 1);
      res.json(deleted[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Orders CRUD
  app.get('/api/orders', (req, res) => {
    res.json(DB_ORDERS);
  });

  app.post('/api/orders', (req, res) => {
    try {
      const { customerName, customerEmail, shippingAddress, phone, items, totalAmount, paymentMethod } = req.body;
      if (!customerName || !customerEmail || !items || items.length === 0) {
        res.status(400).json({ error: 'Customer information and items are required' });
        return;
      }

      // Check and update stock counts
      for (const item of items) {
        const prod = DB_PRODUCTS.find((p) => p.id === item.product.id);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      }

      const newOrder: Order = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName,
        customerEmail,
        shippingAddress,
        phone,
        items,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'UPI' || paymentMethod === 'Card' ? 'Paid' : 'Pending',
        orderStatus: 'Placed',
        createdAt: new Date().toISOString().split('T')[0]
      };

      DB_ORDERS.push(newOrder);
      res.status(201).json(newOrder);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/orders/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { orderStatus, paymentStatus } = req.body;
      const order = DB_ORDERS.find((o) => o.id === id);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      if (orderStatus) order.orderStatus = orderStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      res.json(order);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Reviews CRUD
  app.get('/api/reviews', (req, res) => {
    res.json(DB_REVIEWS);
  });

  app.post('/api/reviews', (req, res) => {
    try {
      const { productId, userName, rating, comment } = req.body;
      if (!productId || !userName || !rating) {
        res.status(400).json({ error: 'Product ID, reviewer name and rating rating are required' });
        return;
      }
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        productId,
        userName,
        rating: Number(rating),
        comment: comment || '',
        date: new Date().toISOString().split('T')[0]
      };
      DB_REVIEWS.push(newReview);

      // Recalculate Product average ratings
      const prodReviews = DB_REVIEWS.filter((r) => r.productId === productId);
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      const product = DB_PRODUCTS.find((p) => p.id === productId);
      if (product) {
        product.rating = Number(avg.toFixed(1));
        product.reviewCount = prodReviews.length;
      }

      res.status(201).json(newReview);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Gemni AI Assistant securely hosted server-side
  app.post('/api/assistant', async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Missing chat messages array' });
      return;
    }

    try {
      const client = getGeminiClient();
      const userMessage = messages[messages.length - 1]?.text;

      if (!client) {
        // Fallback simulation mode if GEMINI_API_KEY is not configured
        setTimeout(() => {
          const lower = userMessage.toLowerCase();
          let reply = `I'm operating in Sandbox presentation mode. Here is an immediate help simulation:\n\n`;
          if (lower.includes('phone') || lower.includes('mobile')) {
            reply += `It looks like you're interested in smartphones! Check out our **${DB_PRODUCTS[0].name}** which packs a 108MP camera, 12GB RAM and is priced at just ₹${DB_PRODUCTS[0].price}. It represents our top modern offering.`;
          } else if (lower.includes('laptop') || lower.includes('cod')) {
            reply += `For development work or study, I highly recommend the **${DB_PRODUCTS[1].name}** (₹${DB_PRODUCTS[1].price}). Lightweight, highly efficient fanless engineering with 16GB of DDR5 RAM.`;
          } else if (lower.includes('coupon') || lower.includes('discount')) {
            reply += `Yes! You can use the code **SHOPNEXUS20** during checkout to receive an instant **20% discount** simulated.`;
          } else {
            reply += `Thank you for exploring ShopNexus E-Commerce. I can recommend electronics, clothing, and home accessories! Try asking me "Recommend a good laptop for coding".`;
          }
          res.json({ text: reply });
        }, 800);
        return;
      }

      // Structure context-aware instructions with catalog references so the chat answers highly specifically
      const catalogContext = DB_PRODUCTS.map(p => `- ${p.name} (ID: ${p.id}, Cat: ${p.category}): ₹${p.price}. Specs: ${JSON.stringify(p.specs)}. Rating: ${p.rating}`).join('\n');
      const systemPrompt = `You are "ShopNexus AI", an integrated intelligent shopping assistant.
Your goal is to help shoppers discover products, recommend the best devices based on budgets/needs, provide technical specs, and answer inquiries.

Rules:
1. ALWAYS be polite, professional, and highlight items actually present in our catalog when requested.
2. The current user catalog at the store is:
${catalogContext}
3. If users ask about discount coupon codes, share that "SHOPNEXUS20" yields an exclusive 20% discount.
4. Keep answers clean, concise, formatted with elegant markdown, and structured for quick scanning in a customer chat drawer.
5. If someone asks about project documentation, briefly explain that you are powered by a server-side route running @google/genai SDK on Node.js.
6. The checkout supports Simulated UPI and Credit Card payments.`;

      // Pass history to chat session
      const historyParts = messages.slice(0, -1).map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const activeUserText = userMessage;

      // Make SDK call using gemini-3.5-flash as default as instructed in SKILL.md
      const chat = client.chats.create({
        model: 'gemini-3.5-flash',
        config: {
          systemInstruction: systemPrompt
        },
        history: historyParts
      });

      const response = await chat.sendMessage({
        message: activeUserText
      });

      res.json({ text: response.text });
    } catch (e: any) {
      console.error('Gemini call error:', e);
      res.status(500).json({ error: `Internal Server Error: ${e.message}` });
    }
  });

  // --- INTEGRATED VITE SERVING (DEV & PROD) ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ShopNexus Node Server] Running on http://localhost:${PORT}`);
    console.log(`[Sandbox Mode Watcher] Env: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
