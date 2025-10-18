import { MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/contexts/LocationContext";
import { Badge } from "@/components/ui/badge";

export function LocationHeader() {
  const { userLocation, locationError, isLoadingLocation, refreshLocation } = useLocation();

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b h-14 flex items-center justify-between px-4 gap-3 shadow-sm">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
        {isLoadingLocation ? (
          <span className="text-sm text-muted-foreground">Getting location...</span>
        ) : locationError ? (
          <span className="text-sm text-destructive truncate">{locationError}</span>
        ) : userLocation ? (
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-medium truncate">
            <span className="truncate">
              {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </span>
          </Badge>
        ) : null}
      </div>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={refreshLocation}
        disabled={isLoadingLocation}
        data-testid="button-refresh-location"
        className="flex-shrink-0"
      >
        <RefreshCw className={`w-4 h-4 ${isLoadingLocation ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}
