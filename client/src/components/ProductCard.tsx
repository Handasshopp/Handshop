import { Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product, Shop } from "@shared/schema";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
  shop: Shop;
}

export function ProductCard({ product, shop }: ProductCardProps) {
  const { cart, addToCart, updateQuantity } = useCart();
  
  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (quantity === 0) {
      addToCart(product, shop);
    } else {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleRemove = () => {
    updateQuantity(product.id, quantity - 1);
  };

  return (
    <Card 
      data-testid={`card-product-${product.id}`}
      className="overflow-hidden"
    >
      <div className="flex gap-3 p-3">
        {/* Product Image */}
        <div className="w-20 h-20 rounded-md bg-muted flex-shrink-0 overflow-hidden">
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

        {/* Product Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h4 className="text-body font-semibold truncate mb-0.5" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h4>
          {product.description && (
            <p className="text-small text-muted-foreground line-clamp-2 mb-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-body-lg font-semibold" data-testid={`text-product-price-${product.id}`}>
              ₹{parseFloat(product.price).toFixed(0)}
            </span>

            {/* Add to Cart Button */}
            {quantity === 0 ? (
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={!product.isAvailable}
                data-testid={`button-add-to-cart-${product.id}`}
                className="gap-1.5 h-8"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            ) : (
              <div className="flex items-center gap-2" data-testid={`controls-quantity-${product.id}`}>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleRemove}
                  data-testid={`button-decrease-${product.id}`}
                  className="h-8 w-8"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-body font-semibold min-w-[20px] text-center" data-testid={`text-quantity-${product.id}`}>
                  {quantity}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleAdd}
                  data-testid={`button-increase-${product.id}`}
                  className="h-8 w-8"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
