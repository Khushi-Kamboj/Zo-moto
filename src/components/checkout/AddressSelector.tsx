import React, { useState } from 'react';
import { MapPin, Plus, Check, Home, Briefcase, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAddresses, SavedAddress, AddressInput } from '@/hooks/useAddresses';
import { cn } from '@/lib/utils';

interface AddressSelectorProps {
  selectedAddressId: string | null;
  onSelectAddress: (address: SavedAddress) => void;
}

const labelIcons: Record<string, React.ReactNode> = {
  Home: <Home className="w-4 h-4" />,
  Work: <Briefcase className="w-4 h-4" />,
  Other: <Building2 className="w-4 h-4" />,
};

const AddressSelector: React.FC<AddressSelectorProps> = ({
  selectedAddressId,
  onSelectAddress,
}) => {
  const { addresses, isLoading, addAddress } = useAddresses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<AddressInput>({
    label: 'Home',
    address_line: '',
    city: '',
    pincode: '',
    is_default: false,
  });

  const handleAddAddress = async () => {
    if (!newAddress.address_line || !newAddress.city) return;
    
    await addAddress.mutateAsync(newAddress);
    setIsDialogOpen(false);
    setNewAddress({
      label: 'Home',
      address_line: '',
      city: '',
      pincode: '',
      is_default: false,
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-20 bg-secondary rounded-xl" />
        <div className="h-20 bg-secondary rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Delivery Address
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Address Type</Label>
                <RadioGroup
                  value={newAddress.label}
                  onValueChange={(value) => setNewAddress({ ...newAddress, label: value })}
                  className="flex gap-4"
                >
                  {['Home', 'Work', 'Other'].map((label) => (
                    <div key={label} className="flex items-center space-x-2">
                      <RadioGroupItem value={label} id={label} />
                      <Label htmlFor={label} className="flex items-center gap-1 cursor-pointer">
                        {labelIcons[label]}
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line">Address</Label>
                <Input
                  id="address_line"
                  placeholder="House/Flat No., Building, Street"
                  value={newAddress.address_line}
                  onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    placeholder="Pincode"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={newAddress.is_default}
                  onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                  className="rounded border-border"
                />
                <Label htmlFor="is_default" className="text-sm cursor-pointer">
                  Set as default address
                </Label>
              </div>

              <Button
                onClick={handleAddAddress}
                disabled={!newAddress.address_line || !newAddress.city || addAddress.isPending}
                className="w-full"
              >
                {addAddress.isPending ? 'Adding...' : 'Add Address'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8 bg-secondary/30 rounded-xl border border-dashed border-border">
          <MapPin className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">No saved addresses</p>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <button
              key={address.id}
              onClick={() => onSelectAddress(address)}
              className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all",
                selectedAddressId === address.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 bg-card"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    selectedAddressId === address.id ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                  )}>
                    {labelIcons[address.label] || <MapPin className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{address.label}</span>
                      {address.is_default && (
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {address.address_line}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}{address.pincode ? ` - ${address.pincode}` : ''}
                    </p>
                  </div>
                </div>
                {selectedAddressId === address.id && (
                  <div className="p-1 bg-primary rounded-full">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
