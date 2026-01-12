import React from 'react';
import { useAllOrders } from '@/hooks/useOrders';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useUsers } from '@/hooks/useUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Store, ShoppingBag, TrendingUp, Package, Clock } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { data: orders = [] } = useAllOrders();
  const { data: restaurants = [] } = useRestaurants();
  const { data: users = [] } = useUsers();

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
  const preparingOrders = orders.filter((o) => o.status === 'preparing').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Restaurants',
      value: restaurants.length,
      icon: Store,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  const orderStats = [
    { label: 'Pending', value: pendingOrders, color: 'bg-yellow-500' },
    { label: 'Preparing', value: preparingOrders, color: 'bg-blue-500' },
    { label: 'Delivered', value: deliveredOrders, color: 'bg-green-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                    <span className="text-sm">{stat.label}</span>
                  </div>
                  <span className="font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{order.restaurant?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{Number(order.total_amount).toFixed(0)}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'delivered'
                        ? 'bg-green-500/10 text-green-500'
                        : order.status === 'preparing'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
