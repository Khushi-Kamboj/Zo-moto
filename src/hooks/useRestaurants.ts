import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  delivery_time: string;
  price_range: string;
  featured: boolean;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string;
  is_veg: boolean;
  is_bestseller: boolean;
  created_at: string;
  updated_at: string;
}

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      return data as Restaurant[];
    },
  });
};

export const useRestaurant = (id: string) => {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Restaurant | null;
    },
    enabled: !!id,
  });
};

export const useMenuItems = (restaurantId: string) => {
  return useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('category');

      if (error) throw error;
      return data as MenuItem[];
    },
    enabled: !!restaurantId,
  });
};

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (restaurant: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('restaurants')
        .insert(restaurant)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      toast.success('Restaurant created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...restaurant }: Partial<Restaurant> & { id: string }) => {
      const { data, error } = await supabase
        .from('restaurants')
        .update(restaurant)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      toast.success('Restaurant updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('restaurants').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      toast.success('Restaurant deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(menuItem)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', data.restaurant_id] });
      toast.success('Menu item created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...menuItem }: Partial<MenuItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('menu_items')
        .update(menuItem)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', data.restaurant_id] });
      toast.success('Menu item updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, restaurantId }: { id: string; restaurantId: string }) => {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      return { restaurantId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', data.restaurantId] });
      toast.success('Menu item deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
