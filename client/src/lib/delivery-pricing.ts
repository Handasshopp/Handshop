import type { Shop } from "@shared/schema";

// Calculate delivery fee based on shop's pricing configuration
export const calculateDeliveryFee = (
  shop: Shop,
  distanceKm: number
): number => {
  if (shop.deliveryType === "flat") {
    return parseFloat(shop.flatDeliveryFee || "0");
  }
  
  // Distance-based pricing
  const baseFee = parseFloat(shop.baseDeliveryFee || "0");
  const perKmFee = parseFloat(shop.perKmFee || "0");
  const total = baseFee + (distanceKm * perKmFee);
  
  return Math.round(total * 100) / 100; // Round to 2 decimal places
};

// Format delivery fee for display
export const formatDeliveryFee = (fee: number): string => {
  if (fee === 0) {
    return "FREE";
  }
  return `₹${fee.toFixed(0)}`;
};

// Format delivery fee with pricing details
export const formatDeliveryFeeDetails = (
  shop: Shop,
  distanceKm: number
): string => {
  if (shop.deliveryType === "flat") {
    const fee = parseFloat(shop.flatDeliveryFee || "0");
    return fee === 0 ? "FREE delivery" : `₹${fee.toFixed(0)} delivery`;
  }
  
  const baseFee = parseFloat(shop.baseDeliveryFee || "0");
  const perKmFee = parseFloat(shop.perKmFee || "0");
  
  if (baseFee === 0 && perKmFee === 0) {
    return "FREE delivery";
  }
  
  return `₹${baseFee.toFixed(0)} + ₹${perKmFee.toFixed(0)}/km`;
};
