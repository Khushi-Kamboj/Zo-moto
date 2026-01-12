import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const OrderSummary: React.FC = () => {
  const { items, getTotal } = useCart();

  const subtotal = getTotal();
  const deliveryFee = 40;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + taxes;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-primary" />
        Order Summary
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.menuItem.id}
            className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg"
          >
            {item.menuItem.image ? (
              <img
                src={item.menuItem.image}
                alt={item.menuItem.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-lg">
                🍽️
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={item.menuItem.isVeg ? 'veg-badge' : 'non-veg-badge'} />
                <p className="font-medium text-foreground text-sm line-clamp-1">
                  {item.menuItem.name}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                ₹{item.menuItem.price} × {item.quantity}
              </p>
            </div>
            <p className="font-medium text-foreground">
              ₹{item.menuItem.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-2 text-sm">
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
        <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
          <span>Total</span>
          <span className="text-primary">₹{total}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
