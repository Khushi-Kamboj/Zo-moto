import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import MenuItemCard from '@/components/menu/MenuItemCard';
import ChatBot from '@/components/chat/ChatBot';
import ChatButton from '@/components/chat/ChatButton';
import { useRestaurant, useMenuItems } from '@/hooks/useRestaurants';
import { cn } from '@/lib/utils';

const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(id || '');
  const { data: menuItems = [], isLoading: menuLoading } = useMenuItems(id || '');

  // Transform menu items to match the component's expected format
  const formattedItems = menuItems.map((item) => ({
    id: item.id,
    restaurantId: item.restaurant_id,
    name: item.name,
    description: item.description || '',
    price: Number(item.price),
    image: item.image || undefined,
    category: item.category,
    isVeg: item.is_veg,
    isBestseller: item.is_bestseller,
    rating: 4.5, // Placeholder
    reviewCount: Math.floor(Math.random() * 1000) + 100, // Placeholder
  }));

  const categories = useMemo(() => {
    const cats = [...new Set(formattedItems.map(item => item.category))];
    return cats;
  }, [formattedItems]);

  const [activeCategory, setActiveCategory] = React.useState('');

  React.useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  if (restaurantLoading || menuLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant not found</h1>
          <Link to="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Back button */}
        <Link to="/" className="absolute top-4 left-4">
          <Button variant="secondary" size="sm" className="glass">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Restaurant Info */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {restaurant.name}
              </h1>
              <p className="text-muted-foreground mb-3">
                {restaurant.cuisine.join(', ')}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md font-semibold",
                  Number(restaurant.rating) >= 4.5 
                    ? "bg-success/10 text-success" 
                    : "bg-rating/10 text-rating"
                )}>
                  <Star className="w-4 h-4 fill-current" />
                  {restaurant.rating}
                </div>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {restaurant.delivery_time}
                </span>
                {restaurant.address && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {restaurant.address}
                  </span>
                )}
                <span className="text-muted-foreground">{restaurant.price_range}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category sidebar */}
          <div className="lg:w-48 shrink-0">
            <div className="sticky top-20">
              <h2 className="font-semibold text-foreground mb-4">Categories</h2>
              <nav className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                      activeCategory === category
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {category}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Menu items */}
          <div className="flex-1">
            {categories.map(category => (
              <div key={category} id={category} className="mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {category}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({formattedItems.filter(item => item.category === category).length} items)
                  </span>
                </h2>
                <div className="grid gap-4">
                  {formattedItems
                    .filter(item => item.category === category)
                    .map(item => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        restaurantName={restaurant.name}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      <ChatButton onClick={() => setIsChatOpen(true)} isOpen={isChatOpen} />
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default RestaurantPage;
