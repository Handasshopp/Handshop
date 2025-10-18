import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Package, Loader2 } from "lucide-react";
import type { OrderWithDetails } from "@shared/schema";
import { formatDistance } from "date-fns";

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/orders"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
      case "preparing":
        return "bg-blue-500";
      case "out-for-delivery":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen pb-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen pb-16">
      <div className="sticky top-0 z-30 bg-background border-b px-4 py-3">
        <h1 className="text-h1 font-semibold">Your Orders</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 space-y-3">
          {!orders || orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mb-3" />
              <h3 className="text-h2 font-semibold mb-2">No orders yet</h3>
              <p className="text-body text-muted-foreground">
                Your order history will appear here
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="p-4" data-testid={`card-order-${order.id}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-body-lg font-semibold" data-testid={`text-shop-name-${order.id}`}>
                      {order.shop.name}
                    </h3>
                    <p className="text-small text-muted-foreground">
                      Order #{order.id.slice(0, 8)}
                    </p>
                  </div>
                  <Badge 
                    className={`${getStatusColor(order.status)} text-white`}
                    data-testid={`badge-status-${order.id}`}
                  >
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-body">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.productName}
                      </span>
                      <span>₹{parseFloat(item.subtotal).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-4 text-small text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {parseFloat(order.distance).toFixed(1)} km
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDistance(new Date(order.createdAt), new Date(), { addSuffix: true })}
                    </div>
                  </div>
                  <span className="text-body-lg font-bold" data-testid={`text-total-${order.id}`}>
                    ₹{parseFloat(order.total).toFixed(0)}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
