import React from 'react';
import { cn } from '@/lib/utils';
import { categories } from '@/data/mockData';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-6 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-200",
                selectedCategory === category.id
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border hover:border-primary/30 hover:bg-secondary/50"
              )}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;
