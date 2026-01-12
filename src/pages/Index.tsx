import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/home/HeroSection';
import CategoryFilter from '@/components/home/CategoryFilter';
import RestaurantGrid from '@/components/home/RestaurantGrid';
import ChatBot from '@/components/chat/ChatBot';
import ChatButton from '@/components/chat/ChatButton';
import { useRestaurants } from '@/hooks/useRestaurants';

const Index: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { data: restaurants = [], isLoading } = useRestaurants();

  // Transform database restaurants to match the component's expected format
  const formattedRestaurants = restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    image: r.image,
    cuisine: r.cuisine,
    rating: Number(r.rating),
    reviewCount: Math.floor(Math.random() * 3000) + 500, // Placeholder
    deliveryTime: r.delivery_time,
    priceRange: r.price_range,
    distance: `${(Math.random() * 3 + 0.5).toFixed(1)} km`, // Placeholder
    isOpen: true,
    promoted: r.featured,
  }));

  const filteredRestaurants = selectedCategory === 'all'
    ? formattedRestaurants
    : formattedRestaurants.filter(r => 
        r.cuisine.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase()))
      );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection onOpenChat={() => setIsChatOpen(true)} />
        
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <RestaurantGrid
            restaurants={filteredRestaurants}
            title="Popular Restaurants Near You"
          />
        )}
      </main>

      {/* AI Chatbot */}
      <ChatButton onClick={() => setIsChatOpen(true)} isOpen={isChatOpen} />
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
