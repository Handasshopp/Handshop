import { useEffect, useRef } from "react";
import L from "leaflet";
import { useLocation } from "@/contexts/LocationContext";
import type { ShopWithDistance } from "@shared/schema";
import { Loader2 } from "lucide-react";

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewProps {
  shops: ShopWithDistance[];
  onShopClick?: (shopId: string) => void;
  className?: string;
}

export function MapView({ shops, onShopClick, className = "" }: MapViewProps) {
  const { userLocation, isLoadingLocation } = useLocation();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
    }).setView([0, 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map center when user location changes
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    mapRef.current.setView([userLocation.latitude, userLocation.longitude], 13);

    // Add user location marker with pulsing effect
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
      icon: userIcon,
    }).addTo(mapRef.current);

    markersRef.current.push(userMarker);

    return () => {
      userMarker.remove();
    };
  }, [userLocation]);

  // Update shop markers
  useEffect(() => {
    if (!mapRef.current || !shops.length) return;

    // Clear existing shop markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add shop markers
    shops.forEach((shop) => {
      if (!mapRef.current) return;

      const shopIcon = L.divIcon({
        className: 'shop-marker',
        html: `
          <div class="relative">
            <div class="w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4M2 7h20M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([shop.latitude, shop.longitude], {
        icon: shopIcon,
      })
        .addTo(mapRef.current)
        .bindPopup(`
          <div class="text-sm">
            <strong>${shop.name}</strong><br/>
            ${shop.category}<br/>
            ${shop.distance.toFixed(1)} km away
          </div>
        `);

      if (onShopClick) {
        marker.on('click', () => onShopClick(shop.id));
      }

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (shops.length > 0 && userLocation) {
      const bounds = L.latLngBounds(
        shops.map((shop) => [shop.latitude, shop.longitude])
      );
      bounds.extend([userLocation.latitude, userLocation.longitude]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [shops, userLocation, onShopClick]);

  if (isLoadingLocation) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainerRef} 
      className={`w-full ${className}`}
      data-testid="map-view"
    />
  );
}
