import { useQuery } from "@tanstack/react-query";
import { useLocation as useUserLocation } from "@/contexts/LocationContext";
import { MapView } from "@/components/MapView";
import { LocationHeader } from "@/components/LocationHeader";
import { useLocation } from "wouter";
import type { ShopWithDistance } from "@shared/schema";
import { Loader2, MapPinOff } from "lucide-react";

export default function MapPage() {
  const { userLocation, isLoadingLocation } = useUserLocation();
  const [, setLocation] = useLocation();

  const { data: shops, isLoading } = useQuery<ShopWithDistance[]>({
    queryKey: ["/api/shops/nearby", userLocation],
    enabled: !!userLocation,
  });

  const handleShopClick = (shopId: string) => {
    setLocation(`/shop/${shopId}`);
  };

  return (
    <div className="flex flex-col h-screen pb-16">
      <LocationHeader />
      
      <div className="flex-1 relative">
        {isLoadingLocation || isLoading ? (
          <div className="flex items-center justify-center h-full bg-muted">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                {isLoadingLocation ? "Getting your location..." : "Loading nearby shops..."}
              </p>
            </div>
          </div>
        ) : !userLocation ? (
          <div className="flex items-center justify-center h-full bg-muted">
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              <MapPinOff className="w-12 h-12 text-muted-foreground" />
              <h3 className="text-h2 font-semibold">Location Required</h3>
              <p className="text-body text-muted-foreground max-w-md">
                We need your location to show nearby shops and calculate delivery prices.
              </p>
            </div>
          </div>
        ) : (
          <MapView 
            shops={shops || []} 
            onShopClick={handleShopClick}
            className="h-full"
          />
        )}
      </div>
    </div>
  );
}
