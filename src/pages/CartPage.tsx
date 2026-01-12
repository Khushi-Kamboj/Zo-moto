import React from 'react';
import Header from '@/components/layout/Header';
import CartSidebar from '@/components/cart/CartSidebar';
import ChatBot from '@/components/chat/ChatBot';
import ChatButton from '@/components/chat/ChatButton';

const CartPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <CartSidebar />
        </div>
      </main>

      {/* AI Chatbot */}
      <ChatButton onClick={() => setIsChatOpen(true)} isOpen={isChatOpen} />
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default CartPage;
