import React from 'react';
import { useAllOrders, useUpdateOrderStatus, OrderStatus } from '@/hooks/useOrders';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-500/10 text-blue-500' },
  { value: 'preparing', label: 'Preparing', color: 'bg-orange-500/10 text-orange-500' },
  { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-purple-500/10 text-purple-500' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-500/10 text-green-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500/10 text-red-500' },
];

const AdminOrders: React.FC = () => {
  const { data: orders = [], isLoading } = useAllOrders();
  const updateOrderStatus = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus.mutateAsync({ orderId, status });
  };

  const getStatusColor = (status: OrderStatus) => {
    return statusOptions.find((s) => s.value === status)?.color || '';
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage and track all orders</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    #{order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.restaurant?.image && (
                        <img
                          src={order.restaurant.image}
                          alt={order.restaurant.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <span>{order.restaurant?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.order_items?.slice(0, 2).map((item) => (
                        <div key={item.id} className="text-sm">
                          {item.quantity}x {item.menu_item?.name}
                        </div>
                      ))}
                      {order.order_items && order.order_items.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{order.order_items.length - 2} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ₹{Number(order.total_amount).toFixed(0)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                    >
                      <SelectTrigger className={`w-40 ${getStatusColor(order.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No orders yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
