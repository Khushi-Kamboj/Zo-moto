import React, { useState } from 'react';
import { useRestaurants, useCreateRestaurant, useUpdateRestaurant, useDeleteRestaurant, Restaurant } from '@/hooks/useRestaurants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

const AdminRestaurants: React.FC = () => {
  const { data: restaurants = [], isLoading } = useRestaurants();
  const createRestaurant = useCreateRestaurant();
  const updateRestaurant = useUpdateRestaurant();
  const deleteRestaurant = useDeleteRestaurant();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    cuisine: '',
    rating: '4.0',
    delivery_time: '30-40 min',
    price_range: '$$',
    address: '',
    featured: false,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      cuisine: '',
      rating: '4.0',
      delivery_time: '30-40 min',
      price_range: '$$',
      address: '',
      featured: false,
    });
    setEditingRestaurant(null);
  };

  const openEditDialog = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      image: restaurant.image,
      cuisine: restaurant.cuisine.join(', '),
      rating: String(restaurant.rating),
      delivery_time: restaurant.delivery_time,
      price_range: restaurant.price_range,
      address: restaurant.address || '',
      featured: restaurant.featured,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cuisineArray = formData.cuisine.split(',').map((c) => c.trim()).filter(Boolean);
    
    if (cuisineArray.length === 0) {
      toast.error('Please add at least one cuisine');
      return;
    }

    const restaurantData = {
      name: formData.name,
      image: formData.image,
      cuisine: cuisineArray,
      rating: parseFloat(formData.rating),
      delivery_time: formData.delivery_time,
      price_range: formData.price_range,
      address: formData.address || null,
      featured: formData.featured,
    };

    if (editingRestaurant) {
      await updateRestaurant.mutateAsync({ id: editingRestaurant.id, ...restaurantData });
    } else {
      await createRestaurant.mutateAsync(restaurantData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      await deleteRestaurant.mutateAsync(id);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Restaurants</h1>
          <p className="text-muted-foreground">Manage your restaurants</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingRestaurant ? 'Edit Restaurant' : 'Add Restaurant'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Cuisines (comma-separated)</Label>
                <Input
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  placeholder="Italian, Pizza, Pasta"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <Input
                    value={formData.price_range}
                    onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                    placeholder="$, $$, $$$"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Delivery Time</Label>
                <Input
                  value={formData.delivery_time}
                  onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                  placeholder="30-40 min"
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label>Featured Restaurant</Label>
              </div>
              <Button type="submit" className="w-full gradient-primary">
                {editingRestaurant ? 'Update' : 'Create'} Restaurant
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurant</TableHead>
                <TableHead>Cuisines</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{restaurant.name}</p>
                        <p className="text-xs text-muted-foreground">{restaurant.price_range}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {restaurant.cuisine.slice(0, 2).map((c) => (
                        <span key={c} className="text-xs bg-secondary px-2 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {restaurant.rating}
                    </div>
                  </TableCell>
                  <TableCell>{restaurant.delivery_time}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        restaurant.featured ? 'bg-primary/10 text-primary' : 'bg-secondary'
                      }`}
                    >
                      {restaurant.featured ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(restaurant)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(restaurant.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRestaurants;
