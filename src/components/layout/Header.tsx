import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, MapPin, Shield, LogIn } from 'lucide-react';
import logoImage from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
const Header: React.FC = () => {
  const {
    getItemCount
  } = useCart();
  const {
    user,
    isAdmin,
    signOut
  } = useAuth();
  const location = useLocation();
  const itemCount = getItemCount();
  return <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logoImage} alt="Zo-moto Hub Logo" className="w-12 h-12 object-contain" />
            <span className="text-xl font-bold text-foreground hidden sm:block">
              Zo-moto<span className="text-primary">​</span>
            </span>
          </Link>

          {/* Location */}
          <button className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium"> India</span>
            <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">Change</span>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search for restaurants, cuisines..." className="pl-10 bg-secondary/50 border-transparent focus:border-primary/50 focus:bg-card" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="w-5 h-5" />
            </Button>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className={cn('relative', location.pathname === '/cart' && 'bg-primary/10 text-primary')}>
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-bounce-in">
                    {itemCount}
                  </span>}
              </Button>
            </Link>

            {user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Link to="/auth">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>}
          </div>
        </div>
      </div>
    </header>;
};
export default Header;