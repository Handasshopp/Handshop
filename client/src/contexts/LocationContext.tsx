import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Coordinates } from "@/lib/geolocation";
import { getCurrentLocation } from "@/lib/geolocation";

interface LocationContextType {
  userLocation: Coordinates | null;
  locationError: string | null;
  isLoadingLocation: boolean;
  refreshLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const refreshLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    try {
      const result = await getCurrentLocation();
      setUserLocation(result.coords);
      setLocationError(null);
    } catch (error: any) {
      console.error("Location error:", error);
      setLocationError(error.message || "Failed to get your location");
      // Set a default location for development (Nairobi, Kenya as example)
      setUserLocation({ latitude: -1.286389, longitude: 36.817223 });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        locationError,
        isLoadingLocation,
        refreshLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
