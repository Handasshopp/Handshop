import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useLocation as useUserLocation } from "@/contexts/LocationContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { calculateDeliveryFee } from "@/lib/delivery-pricing";
import { calculateDistance } from "@/lib/geolocation";
import type { InsertOrder } from "@shared/schema";

export default function CartPage() {
  const [, setLocation] = useLocation();
  const { cart, shop, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { userLocation } = useUserLocation();
  const { toast } = useToast();
  
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const subtotal = getCartTotal();
  // Use proper Haversine distance calculation
  const distance = shop && userLocation 
    ? calculateDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: shop.latitude, longitude: shop.longitude }
      )
    : 0;
  const deliveryFee = shop ? calculateDeliveryFee(shop, distance) : 0;
  const total = subtotal + deliveryFee;

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: InsertOrder) => {
      return await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: (data) => {
      toast({
        title: "Order placed successfully!",
        description: `Your order #${data.id.slice(0, 8)} is being prepared.`,
      });
      clearCart();
      setLocation("/orders");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to place order",
        description: "Please try again later.",
      });
    },
  });

  const handlePlaceOrder = () => {
    if (!customerName || !customerPhone || !deliveryAddress) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all delivery details.",
      });
      return;
    }

    if (!shop || !userLocation) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Shop or location information is missing.",
      });
      return;
    }

    const orderData: InsertOrder = {
      shopId: shop.id,
      customerName,
      customerPhone,
      deliveryAddress,
      deliveryLatitude: userLocation.latitude,
      deliveryLongitude: userLocation.longitude,
      distance: distance.toString(),
      subtotal: subtotal.toString(),
      deliveryFee: deliveryFee.toString(),
      total: total.toString(),
    };

    placeOrderMutation.mutate(orderData);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center pb-20">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-h1 font-semibold mb-2">Your cart is empty</h2>
        <p className="text-body text-muted-foreground mb-6">
          Browse shops and add items to get started
        </p>
        <Button onClick={() => setLocation("/shops")}>
          Browse Shops
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen pb-16">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background border-b px-4 py-3 flex items-center gap-3">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setLocation("/shops")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-h1 font-semibold">Your Cart</h1>
      </div>

      {/* Cart Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-6 pb-24">
          {/* Shop Info */}
          {shop && (
            <Card className="p-4">
              <h3 className="text-body-lg font-semibold mb-1">{shop.name}</h3>
              <p className="text-small text-muted-foreground">{shop.address}</p>
            </Card>
          )}

          {/* Cart Items */}
          <div className="space-y-3">
            <h3 className="text-body-lg font-semibold">Items</h3>
            {cart.map(({ product, quantity }) => (
              <Card key={product.id} className="p-4" data-testid={`cart-item-${product.id}`}>
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-body font-semibold truncate">{product.name}</h4>
                    <p className="text-body-lg font-semibold text-primary mt-1">
                      ₹{parseFloat(product.price).toFixed(0)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFromCart(product.id)}
                      className="h-8 w-8"
                      data-testid={`button-remove-${product.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="h-7 w-7"
                        data-testid={`button-decrease-cart-${product.id}`}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-body font-semibold min-w-[20px] text-center" data-testid={`text-cart-quantity-${product.id}`}>
                        {quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="h-7 w-7"
                        data-testid={`button-increase-cart-${product.id}`}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Delivery Details Form */}
          <Card className="p-4 space-y-4">
            <h3 className="text-body-lg font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Delivery Details
            </h3>

            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  data-testid="input-customer-name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  data-testid="input-customer-phone"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter delivery address"
                  data-testid="input-delivery-address"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Price Breakdown */}
          <Card className="p-4 space-y-2">
            <div className="flex justify-between text-body">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium" data-testid="text-subtotal">₹{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-body">
              <span className="text-muted-foreground">Delivery Fee ({distance.toFixed(1)} km)</span>
              <span className="font-medium" data-testid="text-delivery-fee">₹{deliveryFee.toFixed(0)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-body-lg">
              <span className="font-semibold">Total</span>
              <span className="font-bold" data-testid="text-total">₹{total.toFixed(0)}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Place Order Button - Fixed Bottom */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-background border-t px-4 py-3 shadow-xl">
        <div className="max-w-3xl mx-auto">
          <Button
            onClick={handlePlaceOrder}
            disabled={placeOrderMutation.isPending}
            className="w-full h-12 text-body-lg font-semibold"
            data-testid="button-place-order"
          >
            {placeOrderMutation.isPending ? "Placing Order..." : `Place Order • ₹${total.toFixed(0)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
