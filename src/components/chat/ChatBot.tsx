import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/types';
import { useCart } from '@/context/CartContext';
import { menuItems, restaurants } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestedQueries = [
  "I want 2 cheese burgers",
  "Suggest something spicy",
  "Show me pizzas under 400",
  "What's popular today?",
];

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey there! 👋 I'm your OrderAssist. Tell me what you're craving and I'll help you order. Try saying things like:\n\n• \"I want 2 cheese burgers\"\n• \"Show me something spicy\"\n• \"Order a pizza under 400\"",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem, getItemCount, getTotal } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const processUserMessage = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Simple intent recognition
    if (message.includes('cart') || message.includes('order')) {
      const count = getItemCount();
      const total = getTotal();
      if (count === 0) {
        return "Your cart is empty! 🛒 Tell me what you'd like to eat and I'll add it for you.";
      }
      return `You have ${count} item${count > 1 ? 's' : ''} in your cart totaling ₹${total}. Would you like to checkout or add more items?`;
    }

    if (message.includes('spicy') || message.includes('hot')) {
      const spicyItems = menuItems.filter(item => 
        item.description.toLowerCase().includes('spicy') || 
        item.name.toLowerCase().includes('spicy') ||
        item.category.toLowerCase().includes('indian') ||
        item.name.toLowerCase().includes('masala')
      );
      if (spicyItems.length > 0) {
        const item = spicyItems[0];
        const restaurant = restaurants.find(r => r.id === item.restaurantId);
        return `🌶️ Here's something spicy for you!\n\n**${item.name}** - ₹${item.price}\n${item.description}\nFrom ${restaurant?.name}\n\nWant me to add it to your cart?`;
      }
      return "I'd recommend our Butter Chicken or Paneer Tikka Masala from Spice Garden - both are deliciously spicy! 🌶️";
    }

    if (message.includes('burger')) {
      const quantity = parseInt(message.match(/(\d+)/)?.[1] || '1');
      const burger = menuItems.find(item => item.name.toLowerCase().includes('burger'));
      if (burger) {
        const restaurant = restaurants.find(r => r.id === burger.restaurantId);
        for (let i = 0; i < quantity; i++) {
          addItem(burger, restaurant?.name || '');
        }
        return `Great choice! 🍔 I've added ${quantity} ${burger.name}${quantity > 1 ? 's' : ''} to your cart (₹${burger.price * quantity}).\n\nWould you like to add anything else? Maybe some fries or a drink?`;
      }
    }

    if (message.includes('pizza')) {
      const priceMatch = message.match(/under\s*(\d+)/);
      const maxPrice = priceMatch ? parseInt(priceMatch[1]) : 1000;
      const pizzas = menuItems.filter(item => 
        item.category.toLowerCase().includes('pizza') && item.price <= maxPrice
      );
      if (pizzas.length > 0) {
        const pizza = pizzas[0];
        const restaurant = restaurants.find(r => r.id === pizza.restaurantId);
        return `🍕 I found the perfect pizza for you!\n\n**${pizza.name}** - ₹${pizza.price}\n${pizza.description}\nFrom ${restaurant?.name}\n\nShould I add it to your cart?`;
      }
      return "I couldn't find pizzas matching your criteria. Try asking for 'pizzas under 500' or just 'any pizza'.";
    }

    if (message.includes('popular') || message.includes('trending') || message.includes('best')) {
      const bestsellers = menuItems.filter(item => item.isBestseller);
      if (bestsellers.length > 0) {
        const item = bestsellers[Math.floor(Math.random() * bestsellers.length)];
        const restaurant = restaurants.find(r => r.id === item.restaurantId);
        return `🔥 Here's what's trending!\n\n**${item.name}** - ₹${item.price}\n${item.description}\nFrom ${restaurant?.name}\n⭐ ${item.rating} (${item.reviewCount} reviews)\n\nWant me to add it to your cart?`;
      }
    }

    if (message.includes('yes') || message.includes('add it') || message.includes('sure')) {
      const randomItem = menuItems.filter(item => item.isBestseller)[0];
      if (randomItem) {
        const restaurant = restaurants.find(r => r.id === randomItem.restaurantId);
        addItem(randomItem, restaurant?.name || '');
        return `Added to cart! 🎉 Anything else you'd like to add?`;
      }
    }

    if (message.includes('checkout') || message.includes('place order')) {
      if (getItemCount() === 0) {
        return "Your cart is empty! Add some items first. What would you like to eat?";
      }
      return `Ready to checkout! 🛒\n\nTotal: ₹${getTotal()}\n\nClick the cart icon to complete your order, or tell me if you want to add more items!`;
    }

    // Default response
    return "I'm here to help you order food! 🍽️ Try asking me things like:\n\n• \"I want a burger\"\n• \"Show me spicy food\"\n• \"What's in my cart?\"\n• \"Suggest something popular\"";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const response = processUserMessage(input);

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleSuggestionClick = (query: string) => {
    setInput(query);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] animate-slide-up">
      <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col h-[600px] max-h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="gradient-primary p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">OrderAssist</h3>
              <p className="text-xs text-primary-foreground/80">AI-powered ordering</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-slide-up",
                message.role === 'user' ? "flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                message.role === 'assistant' 
                  ? "bg-primary/10 text-primary" 
                  : "gradient-primary text-primary-foreground"
              )}>
                {message.role === 'assistant' ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                message.role === 'assistant'
                  ? "bg-secondary/50 text-foreground rounded-tl-none"
                  : "gradient-primary text-primary-foreground rounded-tr-none"
              )}>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-secondary/50 rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((query) => (
                <button
                  key={query}
                  onClick={() => handleSuggestionClick(query)}
                  className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border shrink-0">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tell me what you want to eat..."
              className="flex-1 bg-secondary/50 border-transparent focus:border-primary/50"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
