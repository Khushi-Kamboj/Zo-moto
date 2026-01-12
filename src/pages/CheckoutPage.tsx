import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Header from '@/components/layout/Header';
import AddressSelector from '@/components/checkout/AddressSelector';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { SavedAddress } from '@/hooks/useAddresses';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotal, clearCart } = useCart();
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const subtotal = getTotal();
  const deliveryFee = 40;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + taxes;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to checkout</h1>
          <Link to="/auth">
            <Button variant="gradient">Sign In</Button>
          </Link>
        </main>
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link to="/">
            <Button variant="gradient">Browse Restaurants</Button>
          </Link>
        </main>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!items[0]?.menuItem?.restaurantId) {
      toast.error('Invalid cart items');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const deliveryAddressStr = `${selectedAddress.address_line}, ${selectedAddress.city}${selectedAddress.pincode ? ` - ${selectedAddress.pincode}` : ''}`;

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          restaurant_id: items[0].menuItem.restaurantId,
          total_amount: total,
          delivery_address: deliveryAddressStr,
          special_instructions: specialInstructions || null,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.menuItem.id,
        quantity: item.quantity,
        price: item.menuItem.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderId(order.id);
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed!</h1>
            <p className="text-muted-foreground mb-6">
              Your order has been placed successfully. You can track it in your profile.
            </p>
            <div className="bg-card rounded-xl p-4 border border-border mb-6">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm text-foreground">{orderId?.slice(0, 8)}...</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/profile')}>
                View Orders
              </Button>
              <Button variant="gradient" onClick={() => navigate('/')}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate('/cart')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>

          <h1 className="text-2xl font-bold text-foreground mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left column - Address & Instructions */}
            <div className="lg:col-span-3 space-y-8">
              {/* Address Selection */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <AddressSelector
                  selectedAddressId={selectedAddress?.id || null}
                  onSelectAddress={setSelectedAddress}
                />
              </div>

              {/* Special Instructions */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <Label htmlFor="instructions" className="text-base font-semibold mb-3 block">
                  Special Instructions (Optional)
                </Label>
                <Textarea
                  id="instructions"
                  placeholder="Add any special instructions for your order..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>

              {/* Delivery Time Estimate */}
              <div className="bg-secondary/30 rounded-xl p-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Estimated Delivery</p>
                  <p className="text-sm text-muted-foreground">30-45 minutes</p>
                </div>
              </div>
            </div>

            {/* Right column - Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl p-6 border border-border sticky top-24">
                <OrderSummary />

                <div className="mt-6 pt-6 border-t border-border">
                  <Button
                    variant="hero"
                    size="xl"
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={!selectedAddress || isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Place Order • ₹{total}
                      </>
                    )}
                  </Button>

                  {!selectedAddress && (
                    <p className="text-sm text-muted-foreground text-center mt-3">
                      Please select a delivery address
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
