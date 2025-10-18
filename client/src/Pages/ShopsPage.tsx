import { useQuery } from "@tanstack/react-query";
import { useLocation as useUserLocation } from "@/contexts/LocationContext";
import { LocationHeader } from "@/components/LocationHeader";
import { ShopCard } from "@/components/ShopCard";
import { Input } from "@/components/ui/input";
import { Search, Store, Loader2 } from "lucide-react";
import type { ShopWithDistance } from "@shared/schema";
import { useState } from "react";

export default function ShopsPage() {
  const { userLocation, isLoadingLocation } = useUserLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: shops, isLoading } = useQuery<ShopWithDistance[]>({
    queryKey: ["/api/shops/nearby", userLocation],
    enabled: !!userLocation,
  });

  const filteredShops = shops?.filter((shop) =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col h-screen pb-16">
      <LocationHeader />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search shops, items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-full bg-card border-input"
              data-testid="input-search-shops"
            />
          </div>

          {/* Shop List */}
          {isLoadingLocation || isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {isLoadingLocation ? "Getting your location..." : "Loading nearby shops..."}
                </p>
              </div>
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Store className="w-12 h-12 text-muted-foreground mb-3" />
              <h3 className="text-h2 font-semibold mb-2">No shops found</h3>
              <p className="text-body text-muted-foreground max-w-md">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "There are no shops in your area yet. Check back soon!"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="text-h1 font-semibold">
                Nearby Shops ({filteredShops.length})
              </h2>
              {filteredShops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
