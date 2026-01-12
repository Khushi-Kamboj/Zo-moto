import React from 'react';
import { Plus, Star, Flame } from 'lucide-react';
import { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  restaurantName: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, restaurantName }) => {
  const { addItem } = useCart();

  return (
    <div className="flex gap-4 p-4 bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-card transition-all duration-200 group">
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-2">
          {/* Veg/Non-veg badge */}
          <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'} />
          
          {item.isBestseller && (
            <span className="flex items-center gap-1 text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
              <Flame className="w-3 h-3" />
              Bestseller
            </span>
          )}
        </div>

        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
          {item.name}
        </h3>

        <p className="text-base font-semibold text-foreground mb-2">
          ₹{item.price}
        </p>

        {item.rating && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <Star className="w-3.5 h-3.5 fill-rating text-rating" />
            <span>{item.rating}</span>
            <span>({item.reviewCount})</span>
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* Image & Add button */}
      <div className="relative shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-28 h-28 rounded-xl object-cover"
          />
        ) : (
          <div className="w-28 h-28 rounded-xl bg-secondary flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
        )}

        <Button
          onClick={() => addItem(item, restaurantName)}
          variant="outline"
          size="sm"
          className={cn(
            "absolute -bottom-3 left-1/2 -translate-x-1/2",
            "bg-card border-primary text-primary font-semibold",
            "hover:bg-primary hover:text-primary-foreground",
            "shadow-md px-6",
            "transition-all duration-200"
          )}
        >
          <Plus className="w-4 h-4 mr-1" />
          ADD
        </Button>
      </div>
    </div>
  );
};

export default MenuItemCard;
