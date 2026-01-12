import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  status: OrderStatus;
  total_amount: number;
  delivery_address: string;
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
  restaurant?: {
    name: string;
    image: string;
  };
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  created_at: string;
  menu_item?: {
    name: string;
    image: string | null;
  };
}

export const useOrders = (userId?: string) => {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.id;

  return useQuery({
    queryKey: ['orders', effectiveUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          restaurant:restaurants(name, image),
          order_items(
            *,
            menu_item:menu_items(name, image)
          )
        `)
        .eq('user_id', effectiveUserId!)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
    enabled: !!effectiveUserId,
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: ['all-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          restaurant:restaurants(name, image),
          order_items(
            *,
            menu_item:menu_items(name, image)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      specialInstructions,
    }: {
      restaurantId: string;
      items: { menuItemId: string; quantity: number; price: number }[];
      totalAmount: number;
      deliveryAddress: string;
      specialInstructions?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          restaurant_id: restaurantId,
          total_amount: totalAmount,
          delivery_address: deliveryAddress,
          special_instructions: specialInstructions || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.menuItemId,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order placed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      toast.success('Order status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
