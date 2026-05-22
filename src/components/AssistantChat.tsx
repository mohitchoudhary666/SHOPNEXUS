/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, Sparkles, X, Bot, User, Brain, ExternalLink } from 'lucide-react';

interface AssistantChatProps {
  onClose?: () => void;
  embedded?: boolean;
}

export default function AssistantChat({ onClose, embedded = false }: AssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "👋 Hello! I am **ShopNexus AI**, your personal shopping assistant.\n\nI can recommend premium products from our categories, verify technical specifications, suggest special discounts, or explain our technical architecture! Try asking a question or click the quick tags below:",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick suggestion prompts for general navigation
  const SUGGESTIONS = [
    'Recommend a laptop for coding',
    'Do you have mechanical keyboards?',
    'Any active coupon codes?',
    'Explain the tech stack of this app'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            sender: m.sender,
            text: m.text
          }))
        })
      });

      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Failed to query backend proxy chatbot route');
      }

      const val = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assist-${Date.now()}`,
        sender: 'assistant',
        text: val.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.log('Using robust client-side simulation fallback chatbot.');
      
      const query = textToSend.toLowerCase();
      let reply = "";

      if (query.includes('laptop') || query.includes('computer') || query.includes('notebook') || query.includes('aerobook')) {
        reply = "Check out our **AeroBook Air Slim Laptop** (₹54,990). Specially optimized for developers, this notebook packs a high-performance Intel Core i5 with 16GB RAM and 512GB PCIe NVMe SSD. Beautiful 14.1\" FHD+ screen and up to 14 hours of continuous battery longevity!";
      } else if (query.includes('keyboard') || query.includes('linear') || query.includes('mechanical')) {
        reply = "Great choice! Our catalog features the **Mechanical Enthusiast Keyboard** (₹3,290). It is hot-swappable (5-pin switches) with double-shot PBT Cherry profile caps. Red linear switches are pre-lubricated for a whisper-quiet, premium tactile registry!";
      } else if (query.includes('phone') || query.includes('smartphone') || query.includes('nexus')) {
        reply = "We recommend the **Nexus X2 Pro Smartphone** (₹34,999). It features a gorgeous 120Hz 6.7\" AMOLED display with high dynamic range, an outstanding 108MP AI triple camera system, and ultra-fast 65W Warp Charging!";
      } else if (query.includes('headphone') || query.includes('sound') || query.includes('sonicwave') || query.includes('audio')) {
        reply = "Our flagship audio gear is the **SonicWave ANC Headset** (₹6,499). It integrates Hybrid active noise cancellation canceling up to 40dB of background noise, paired with an massive 50 hours of wireless playing endurance!";
      } else if (query.includes('watch') || query.includes('chronos') || query.includes('fitness')) {
        reply = "For trackers and fitness, explore the **Omni Chronos Smart Sports Watch** (₹4,999). It boasts a vivid 1.43\" always-on AMOLED bezel dial, biological tracking metrics (including blood oxygen levels SpO2 and Sleep phase index), and is up to 50 meters waterproof!";
      } else if (query.includes('backpack') || query.includes('bag') || query.includes('nomad')) {
        reply = "Our artisan baggage is the **Nomad Premium Leather Backpack** (₹3,999). Genuine vegetable-tanned leather, soft protective fleece pocket fitting a 16\" laptop, and YKK zippers make it a lifetime travel companion.";
      } else if (query.includes('lamp') || query.includes('light') || query.includes('walnut')) {
        reply = "Brighten up your setup with the **Minimalist Walnut Desk Lamp** (₹1,890). Geometric hand-crafted American Walnut pedestal, eye-shield stroboscopic visual filter, and built-in 5W smart USB fast-charge terminal!";
      } else if (query.includes('jacket') || query.includes('denim') || query.includes('clothing') || query.includes('wear')) {
        reply = "We feature the **Classic Vintage Denim Jacket** (₹2,490) tailored from 100% thick cotton indigo blue twill. Heavyweight twill built with double flat-felled durable seams to age with true beauty.";
      } else if (query.includes('coupon') || query.includes('discount') || query.includes('code') || query.includes('promo')) {
        reply = "You can use standard coupon codes at checkout to reduce your total billing:\n\n- **WELCOME10**: 10% Off flat-rate store greeting\n- **SMARTDEAL15**: 15% Off discount code specialized on technology products\n- **SHOPNEXUS20**: 20% Off elite customer promo!";
      } else if (query.includes('stack') || query.includes('tech') || query.includes('architecture') || query.includes('vercel') || query.includes('host') || query.includes('db') || query.includes('how')) {
        reply = "This application operates on a modern multi-layered React + Node/Express stack! When hosted on platforms like Vercel, it leverages client-side Local-Storage synchronization so that your data, carts, and order trackers run continuously with complete state durability!";
      } else {
        reply = "I can help you browse our product parameters (laptops, mechanical keyboards, audio gear, jackets, etc.), verify checkout specifications, or check valid promo coupon codes (such as **WELCOME10**). What items can I assist you with today?";
      }

      const assistantMsg: ChatMessage = {
        id: `assist-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`flex flex-col bg-[#0f172a]/95 border border-white/10 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl text-white ${embedded ? 'h-[500px]' : 'h-[600px] w-full max-w-sm animate-slide-in'}`}>
      
      {/* Bot Chat Header */}
      <div className="bg-white/5 px-4 py-3.5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-sans text-white">ShopNexus AI Assistant</h3>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[9px] font-mono text-white/40">Gemini 3.5 Flash Active</span>
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition cursor-pointer"
            aria-label="Close Drawer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {/* Message Feed list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/20 backdrop-blur-sm">
        {messages.map((message) => {
          const isUser = message.sender === 'user';
          return (
            <div key={message.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
              
              {/* Avatar indicator */}
              {!isUser && (
                <div className="h-7 w-7 bg-slate-900 border border-white/10 text-white rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="h-4 w-4 text-blue-400" />
                </div>
              )}

              <div className="max-w-[80%] flex flex-col">
                <div 
                  className={`p-3 rounded-2xl text-xs leading-relaxed shadow-md whitespace-pre-line ${
                    isUser 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-tr-none self-end' 
                      : 'bg-white/5 text-white/95 border border-white/10 rounded-tl-none'
                  }`}
                >
                  {message.text}
                </div>
                <span className={`text-[9px] text-white/30 font-mono mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                  {message.timestamp}
                </span>
              </div>

              {isUser && (
                <div className="h-7 w-7 bg-white/10 border border-white/10 text-white rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <User className="h-4 w-4" />
                </div>
              )}

            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2.5 justify-start">
            <div className="h-7 w-7 bg-slate-900 border border-white/10 text-white rounded-lg flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <Bot className="h-4 w-4 text-blue-400" />
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
              <div className="flex space-x-1 items-center py-1">
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions Tray */}
      <div className="p-3 bg-white/5 border-t border-white/10">
        <p className="text-[9px] font-bold text-white/40 uppercase tracking-wide mb-1.5 flex items-center gap-1">
          <Brain className="h-3.5 w-3.5 text-blue-400" /> Suggested Viva Prompts
        </p>
        <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
          {SUGGESTIONS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleSendMessage(tag)}
              className="text-[10px] font-medium bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-white/70 hover:text-white px-2.5 py-1 rounded-lg transition cursor-pointer text-left line-clamp-1"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="p-3 bg-slate-950/40 border-t border-white/10 flex gap-2"
      >
        <input
          type="text"
          placeholder="Ask ShopNexus AI anything..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-blue-500/50"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-2 rounded-xl shrink-0 flex items-center justify-center cursor-pointer active:scale-95 transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

    </div>
  );
}
