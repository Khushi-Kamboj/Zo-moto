import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onOpenChat: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenChat }) => {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">🍕</div>
        <div className="absolute top-40 right-20 text-5xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>🍔</div>
        <div className="absolute bottom-20 left-1/4 text-4xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🌮</div>
        <div className="absolute bottom-40 right-1/3 text-5xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>🍣</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Delicious Food,
            <br />
            <span className="text-gradient">Delivered Fast</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Order from your favorite restaurants with our AI-powered assistant. 
            Just tell us what you're craving!
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for food, restaurants..."
                className="pl-12 h-14 text-base bg-card border-border shadow-card focus:shadow-card-hover transition-shadow"
              />
            </div>
            <Button size="xl" variant="gradient" className="shrink-0">
              Search
            </Button>
          </div>

          {/* AI Chat CTA */}
          <button
            onClick={onOpenChat}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-primary/20 text-primary font-medium hover:bg-primary/5 transition-all group"
          >
            <Sparkles className="w-5 h-5 group-hover:animate-pulse-soft" />
            <span>Try AI Food Assistant</span>
            <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">New</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
