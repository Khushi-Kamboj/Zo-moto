import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

const CartSidebar: React.FC = () => {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add items from restaurants to get started
        </p>
        <Link to="/">
          <Button variant="gradient">
            Browse Restaurants
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  const subtotal = getTotal();
  const deliveryFee = 40;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + taxes;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Your Cart</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Restaurant info */}
      <div className="bg-secondary/50 rounded-xl p-4">
        <p className="text-sm text-muted-foreground">Ordering from</p>
        <p className="font-semibold text-foreground">{items[0]?.restaurantName}</p>
      </div>

      {/* Cart items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.menuItem.id}
            className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50"
          >
            {item.menuItem.image ? (
              <img
                src={item.menuItem.image}
                alt={item.menuItem.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-2xl">
                🍽️
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={item.menuItem.isVeg ? 'veg-badge' : 'non-veg-badge'} />
                <h3 className="font-medium text-foreground line-clamp-1">
                  {item.menuItem.name}
                </h3>
              </div>
              <p className="text-sm font-semibold text-foreground mt-1">
                ₹{item.menuItem.price * item.quantity}
              </p>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-1 bg-primary/10 rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary hover:bg-primary/20"
                onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-semibold text-primary">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary hover:bg-primary/20"
                onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Bill details */}
      <div className="bg-card rounded-xl p-4 border border-border/50 space-y-3">
        <h3 className="font-semibold text-foreground">Bill Details</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Item Total</span>
            <span className="text-foreground">₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className="text-foreground">₹{deliveryFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxes & Charges</span>
            <span className="text-foreground">₹{taxes}</span>
          </div>
        </div>

        <div className="border-t border-border pt-3 flex justify-between font-semibold">
          <span>To Pay</span>
          <span className="text-lg">₹{total}</span>
        </div>
      </div>

      {/* Checkout button */}
      <Link to="/checkout">
        <Button variant="hero" className="w-full" size="xl">
          Proceed to Checkout
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </Link>
    </div>
  );
};

export default CartSidebar;
