import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, MapPin, Star, Clock, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import type { ShopWithProducts } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { formatDistance } from "@/lib/geolocation";
import { formatDeliveryFeeDetails } from "@/lib/delivery-pricing";

export default function ShopDetailPage() {
  const [, params] = useRoute("/shop/:id");
  const [, setLocation] = useLocation();
  const { getCartItemCount, getCartTotal, shop: cartShop } = useCart();
  
  const cartCount = getCartItemCount();
  const cartTotal = getCartTotal();

  const { data: shop, isLoading } = useQuery<ShopWithProducts>({
    queryKey: ["/api/shops", params?.id],
    enabled: !!params?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
        <h2 className="text-h1 font-semibold mb-2">Shop not found</h2>
        <Button onClick={() => setLocation("/shops")} className="mt-4">
          Browse Shops
        </Button>
      </div>
    );
  }

  const showCartBar = cartCount > 0 && cartShop?.id === shop.id;

  return (
    <div className="flex flex-col h-screen pb-16">
      {/* Hero Section */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
        {shop.coverImageUrl && (
          <img
            src={shop.coverImageUrl}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        {/* Back Button */}
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setLocation("/shops")}
          className="absolute top-4 left-4 backdrop-blur-sm bg-background/80"
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Shop Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-hero font-bold text-foreground drop-shadow-lg" data-testid="text-shop-name">
            {shop.name}
          </h1>
        </div>
      </div>

      {/* Info Bar - Sticky */}
      <div className="sticky top-0 z-30 bg-card border-b px-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          {shop.distance !== undefined && (
            <Badge variant="secondary" className="gap-1 whitespace-nowrap">
              <MapPin className="w-3 h-3" />
              {formatDistance(shop.distance)}
            </Badge>
          )}
          
          <Badge variant="secondary" className="gap-1 whitespace-nowrap">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {parseFloat(shop.rating).toFixed(1)}
          </Badge>
          
          <Badge variant="secondary" className="gap-1 whitespace-nowrap">
            <Clock className="w-3 h-3" />
            {shop.avgDeliveryTime} min
          </Badge>

          {shop.deliveryFeeCalculated !== undefined && (
            <Badge 
              variant={shop.deliveryFeeCalculated === 0 ? "default" : "secondary"}
              className="whitespace-nowrap font-semibold"
            >
              {formatDeliveryFeeDetails(shop, shop.distance || 0)}
            </Badge>
          )}
        </div>
      </div>

      {/* Products List */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 space-y-4" style={{ paddingBottom: showCartBar ? '80px' : '0' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-h1 font-semibold">Menu</h2>
            <span className="text-small text-muted-foreground">
              {shop.products?.length || 0} items
            </span>
          </div>

          {shop.products && shop.products.length > 0 ? (
            <div className="space-y-3">
              {shop.products.map((product) => (
                <ProductCard key={product.id} product={product} shop={shop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No items available</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Summary Bar - Sticky Bottom */}
      {showCartBar && (
        <div className="fixed bottom-16 left-0 right-0 z-40 bg-primary text-primary-foreground px-4 py-3 shadow-xl border-t border-primary-border">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-small opacity-90">{cartCount} items</span>
              <span className="text-body-lg font-semibold">₹{cartTotal.toFixed(0)}</span>
            </div>
            <Button
              variant="secondary"
              onClick={() => setLocation("/cart")}
              className="gap-2"
              data-testid="button-view-cart"
            >
              <ShoppingCart className="w-4 h-4" />
              View Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
