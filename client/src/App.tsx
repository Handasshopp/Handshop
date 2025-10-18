import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocationProvider } from "@/contexts/LocationContext";
import { CartProvider } from "@/contexts/CartContext";
import { BottomNavigation } from "@/components/BottomNavigation";
import MapPage from "@/pages/MapPage";
import ShopsPage from "@/pages/ShopsPage";
import ShopDetailPage from "@/pages/ShopDetailPage";
import CartPage from "@/pages/CartPage";
import OrdersPage from "@/pages/OrdersPage";
import AccountPage from "@/pages/AccountPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={MapPage} />
        <Route path="/shops" component={ShopsPage} />
        <Route path="/shop/:id" component={ShopDetailPage} />
        <Route path="/cart" component={CartPage} />
        <Route path="/orders" component={OrdersPage} />
        <Route path="/account" component={AccountPage} />
        <Route component={NotFound} />
      </Switch>
      <BottomNavigation />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LocationProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </LocationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
