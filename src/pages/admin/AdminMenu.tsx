import React, { useState } from 'react';
import { useRestaurants, useMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem, MenuItem } from '@/hooks/useRestaurants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Leaf } from 'lucide-react';
import { toast } from 'sonner';

const AdminMenu: React.FC = () => {
  const { data: restaurants = [] } = useRestaurants();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const { data: menuItems = [], isLoading } = useMenuItems(selectedRestaurant);
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    is_veg: true,
    is_bestseller: false,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      is_veg: true,
      is_bestseller: false,
    });
    setEditingItem(null);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      image: item.image || '',
      category: item.category,
      is_veg: item.is_veg,
      is_bestseller: item.is_bestseller,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRestaurant) {
      toast.error('Please select a restaurant first');
      return;
    }

    const menuItemData = {
      restaurant_id: selectedRestaurant,
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      image: formData.image || null,
      category: formData.category,
      is_veg: formData.is_veg,
      is_bestseller: formData.is_bestseller,
    };

    if (editingItem) {
      await updateMenuItem.mutateAsync({ id: editingItem.id, ...menuItemData });
    } else {
      await createMenuItem.mutateAsync(menuItemData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      await deleteMenuItem.mutateAsync({ id, restaurantId: selectedRestaurant });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu Items</h1>
          <p className="text-muted-foreground">Manage menu items for restaurants</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary" disabled={!selectedRestaurant}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
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
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Main Course, Sides, etc."
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_veg}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_veg: checked })}
                  />
                  <Label>Vegetarian</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_bestseller}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_bestseller: checked })}
                  />
                  <Label>Bestseller</Label>
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary">
                {editingItem ? 'Update' : 'Create'} Menu Item
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Restaurant Selector */}
      <Card>
        <CardContent className="p-4">
          <Label>Select Restaurant</Label>
          <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
            <SelectTrigger className="w-full md:w-80 mt-2">
              <SelectValue placeholder="Choose a restaurant" />
            </SelectTrigger>
            <SelectContent>
              {restaurants.map((restaurant) => (
                <SelectItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Menu Items Table */}
      {selectedRestaurant && (
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Bestseller</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                              🍽️
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>
                        <span
                          className={`flex items-center gap-1 text-xs ${
                            item.is_veg ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          <Leaf className="w-3 h-3" />
                          {item.is_veg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            item.is_bestseller ? 'bg-primary/10 text-primary' : 'bg-secondary'
                          }`}
                        >
                          {item.is_bestseller ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {menuItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No menu items found. Add your first item!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminMenu;
