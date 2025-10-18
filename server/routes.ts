import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertShopSchema, insertProductSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

// Helper function to calculate Haversine distance in km
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Helper function to calculate delivery fee
function calculateDeliveryFee(shop: any, distanceKm: number): number {
  if (shop.deliveryType === "flat") {
    return parseFloat(shop.flatDeliveryFee || "0");
  }
  
  const baseFee = parseFloat(shop.baseDeliveryFee || "0");
  const perKmFee = parseFloat(shop.perKmFee || "0");
  return baseFee + (distanceKm * perKmFee);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get nearby shops with distance and delivery fee calculation
  app.get("/api/shops/nearby", async (req, res) => {
    try {
      const latitude = parseFloat(req.query.latitude as string);
      const longitude = parseFloat(req.query.longitude as string);
      const radius = parseFloat(req.query.radius as string) || 10; // Default 10km radius

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: "Invalid coordinates" });
      }

      const shops = await storage.getNearbyShops(latitude, longitude, radius);

      // Calculate distance and delivery fee for each shop
      const shopsWithDistance = shops.map((shop) => {
        const distance = calculateDistance(latitude, longitude, shop.latitude, shop.longitude);
        const deliveryFeeCalculated = calculateDeliveryFee(shop, distance);

        return {
          ...shop,
          distance,
          deliveryFeeCalculated,
        };
      });

      // Sort by distance
      shopsWithDistance.sort((a, b) => a.distance - b.distance);

      res.json(shopsWithDistance);
    } catch (error) {
      console.error("Error fetching nearby shops:", error);
      res.status(500).json({ error: "Failed to fetch nearby shops" });
    }
  });

  // Get shop by ID with products and distance calculation
  app.get("/api/shops/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const latitude = req.query.latitude ? parseFloat(req.query.latitude as string) : null;
      const longitude = req.query.longitude ? parseFloat(req.query.longitude as string) : null;

      const shop = await storage.getShopWithProducts(id);

      if (!shop) {
        return res.status(404).json({ error: "Shop not found" });
      }

      let shopWithDistance = { ...shop };

      if (latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude)) {
        const distance = calculateDistance(latitude, longitude, shop.latitude, shop.longitude);
        const deliveryFeeCalculated = calculateDeliveryFee(shop, distance);

        shopWithDistance = {
          ...shop,
          distance,
          deliveryFeeCalculated,
        };
      }

      res.json(shopWithDistance);
    } catch (error) {
      console.error("Error fetching shop:", error);
      res.status(500).json({ error: "Failed to fetch shop" });
    }
  });

  // Create shop (for admin/shop owners)
  app.post("/api/shops", async (req, res) => {
    try {
      const shopData = insertShopSchema.parse(req.body);
      const shop = await storage.createShop(shopData);
      res.status(201).json(shop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid shop data", details: error.errors });
      }
      console.error("Error creating shop:", error);
      res.status(500).json({ error: "Failed to create shop" });
    }
  });

  // Create product (for shop owners)
  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // Get all orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const { items, ...orderData } = req.body;

      // Validate order data
      const validatedOrder = insertOrderSchema.parse(orderData);

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Order must include at least one item" });
      }

      // Create order with items
      const order = await storage.createOrder(validatedOrder, items);
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
