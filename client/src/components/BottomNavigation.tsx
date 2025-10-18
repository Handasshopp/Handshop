import { MapPin, Store, ShoppingBag, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { path: "/", icon: MapPin, label: "Map" },
  { path: "/shops", icon: Store, label: "Shops" },
  { path: "/orders", icon: ShoppingBag, label: "Orders" },
  { path: "/account", icon: User, label: "Account" },
];

export function BottomNavigation() {
  const [location] = useLocation();
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t shadow-lg h-16">
      <div className="max-w-7xl mx-auto h-full">
        <div className="flex items-center justify-around h-full px-4">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location === path;
            
            return (
              <Link key={path} href={path}>
                <button
                  data-testid={`button-nav-${label.toLowerCase()}`}
                  className={`flex flex-col items-center justify-center gap-1 min-w-[60px] h-full relative transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                    {label === "Orders" && cartCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 min-w-[20px] flex items-center justify-center p-0 px-1 text-[10px] font-semibold"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </div>
                  {isActive && (
                    <span className="text-[11px] font-medium leading-none">
                      {label}
                    </span>
                  )}
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
