import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Sparkles } from 'lucide-react';
import { Restaurant } from '@/types';
import { cn } from '@/lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {restaurant.promoted && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
              <Sparkles className="w-3 h-3" />
              Promoted
            </span>
          )}
        </div>

        {/* Delivery time badge */}
        <div className="absolute bottom-3 left-3">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card/95 backdrop-blur-sm text-sm font-medium shadow-lg">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {restaurant.deliveryTime}
          </span>
        </div>

        {/* Closed overlay */}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <span className="px-4 py-2 rounded-lg bg-destructive/90 text-destructive-foreground font-medium">
              Currently Closed
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <div className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-semibold",
              restaurant.rating >= 4.5 
                ? "bg-success/10 text-success" 
                : restaurant.rating >= 4 
                  ? "bg-rating/10 text-rating" 
                  : "bg-muted text-muted-foreground"
            )}>
              <Star className="w-3.5 h-3.5 fill-current" />
              {restaurant.rating}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
          {restaurant.cuisine.join(', ')}
        </p>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {restaurant.distance}
          </span>
          <span>•</span>
          <span>{restaurant.priceRange}</span>
          <span>•</span>
          <span>{restaurant.reviewCount.toLocaleString()} reviews</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
