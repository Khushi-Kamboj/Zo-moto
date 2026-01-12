import React from 'react';
import RestaurantCard from './RestaurantCard';
import { Restaurant } from '@/types';

interface RestaurantGridProps {
  restaurants: Restaurant[];
  title?: string;
}

const RestaurantGrid: React.FC<RestaurantGridProps> = ({ restaurants, title }) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <button className="text-sm font-medium text-primary hover:underline">
              See all
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>

        {restaurants.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No restaurants found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search for something else
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RestaurantGrid;
