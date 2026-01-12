export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  priceRange: string;
  distance: string;
  isOpen: boolean;
  promoted?: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  isVeg: boolean;
  isBestseller?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantName: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  createdAt: Date;
  deliveryAddress: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
}

export interface ChatAction {
  type: 'add_to_cart' | 'remove_from_cart' | 'view_cart' | 'checkout' | 'search' | 'recommend';
  data?: any;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}
