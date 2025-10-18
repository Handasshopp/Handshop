import { MapPin, Star, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ShopWithDistance } from "@shared/schema";
import { formatDistance } from "@/lib/geolocation";
import { formatDeliveryFee } from "@/lib/delivery-pricing";
import { Link } from "wouter";

interface ShopCardProps {
  shop: ShopWithDistance;
}

export function ShopCard({ shop }: ShopCardProps) {
  const isFreeDelivery = shop.deliveryFeeCalculated === 0;

  return (
    <Link href={`/shop/${shop.id}`}>
      <Card 
        data-testid={`card-shop-${shop.id}`}
        className="overflow-hidden hover-elevate active-elevate-2 transition-transform cursor-pointer"
      >
        <div className="flex gap-3 p-3">
          {/* Shop Image */}
          <div className="w-20 h-20 rounded-md bg-muted flex-shrink-0 overflow-hidden">
            {shop.imageUrl ? (
              <img
                src={shop.imageUrl}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Store className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Shop Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-h2 font-semibold truncate" data-testid={`text-shop-name-${shop.id}`}>
                {shop.name}
              </h3>
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-0.5 gap-1 flex-shrink-0"
                data-testid={`badge-distance-${shop.id}`}
              >
                <MapPin className="w-3 h-3" />
                {formatDistance(shop.distance)}
              </Badge>
            </div>

            <p className="text-small text-muted-foreground mb-2 line-clamp-1">
              {shop.category}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-small font-medium">
                  {parseFloat(shop.rating).toFixed(1)}
                </span>
              </div>

              {/* Delivery Time */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-small">{shop.avgDeliveryTime} min</span>
              </div>

              {/* Delivery Fee */}
              <Badge
                variant={isFreeDelivery ? "default" : "outline"}
                className={`text-xs font-semibold ${
                  isFreeDelivery ? "bg-primary text-primary-foreground" : ""
                }`}
                data-testid={`badge-delivery-fee-${shop.id}`}
              >
                {formatDeliveryFee(shop.deliveryFeeCalculated)}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function Store(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  );
}
