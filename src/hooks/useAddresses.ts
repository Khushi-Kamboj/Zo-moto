import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface SavedAddress {
  id: string;
  user_id: string;
  label: string;
  address_line: string;
  city: string;
  pincode: string | null;
  is_default: boolean;
  created_at: string;
}

export interface AddressInput {
  label: string;
  address_line: string;
  city: string;
  pincode?: string;
  is_default?: boolean;
}

export const useAddresses = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('saved_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return data as SavedAddress[];
    },
    enabled: !!user,
  });

  const addAddress = useMutation({
    mutationFn: async (input: AddressInput) => {
      if (!user) throw new Error('Must be logged in');

      // If this is the default address, unset other defaults first
      if (input.is_default) {
        await supabase
          .from('saved_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('saved_addresses')
        .insert({
          user_id: user.id,
          label: input.label,
          address_line: input.address_line,
          city: input.city,
          pincode: input.pincode || null,
          is_default: input.is_default || addresses.length === 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add address');
      console.error(error);
    },
  });

  const updateAddress = useMutation({
    mutationFn: async ({ id, ...input }: AddressInput & { id: string }) => {
      if (!user) throw new Error('Must be logged in');

      if (input.is_default) {
        await supabase
          .from('saved_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('saved_addresses')
        .update({
          label: input.label,
          address_line: input.address_line,
          city: input.city,
          pincode: input.pincode || null,
          is_default: input.is_default,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address updated');
    },
    onError: (error) => {
      toast.error('Failed to update address');
      console.error(error);
    },
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('saved_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete address');
      console.error(error);
    },
  });

  const defaultAddress = addresses.find(a => a.is_default) || addresses[0];

  return {
    addresses,
    isLoading,
    defaultAddress,
    addAddress,
    updateAddress,
    deleteAddress,
  };
};
