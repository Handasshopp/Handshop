import { 
  shops, 
  products, 
  orders, 
  orderItems,
  type Shop, 
  type InsertShop, 
  type Product, 
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type ShopWithDistance,
  type ShopWithProducts,
  type OrderWithDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  // Shops
  getShops(): Promise<Shop[]>;
  getShop(id: string): Promise<Shop | undefined>;
  getShopWithProducts(id: string): Promise<ShopWithProducts | undefined>;
  getNearbyShops(latitude: number, longitude: number, radiusKm: number): Promise<Shop[]>;
  createShop(shop: InsertShop): Promise<Shop>;
  
  // Products
  getProductsByShop(shopId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Orders
  getOrders(): Promise<OrderWithDetails[]>;
  getOrder(id: string): Promise<OrderWithDetails | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
}

export class DatabaseStorage implements IStorage {
  // Shops
  async getShops(): Promise<Shop[]> {
    return await db.select().from(shops).where(eq(shops.isActive, true));
  }

  async getShop(id: string): Promise<Shop | undefined> {
    const [shop] = await db.select().from(shops).where(eq(shops.id, id));
    return shop || undefined;
  }

  async getShopWithProducts(id: string): Promise<ShopWithProducts | undefined> {
    const [shop] = await db.select().from(shops).where(eq(shops.id, id));
    if (!shop) return undefined;

    const shopProducts = await db
      .select()
      .from(products)
      .where(and(eq(products.shopId, id), eq(products.isAvailable, true)));

    return {
      ...shop,
      products: shopProducts,
    };
  }

  async getNearbyShops(latitude: number, longitude: number, radiusKm: number): Promise<Shop[]> {
    // Use PostGIS ST_DWithin for efficient spatial queries
    // ST_DWithin uses geography type which calculates distance in meters
    // Create a point from user's coordinates and find shops within radius
    const radiusMeters = radiusKm * 1000;

    const nearbyShops = await db
      .select()
      .from(shops)
      .where(
        and(
          eq(shops.isActive, true),
          sql`ST_DWithin(
            ST_MakePoint(${shops.longitude}, ${shops.latitude})::geography,
            ST_MakePoint(${longitude}, ${latitude})::geography,
            ${radiusMeters}
          )`
        )
      );

    return nearbyShops;
  }

  async createShop(insertShop: InsertShop): Promise<Shop> {
    const [shop] = await db
      .insert(shops)
      .values(insertShop)
      .returning();
    return shop;
  }

  // Products
  async getProductsByShop(shopId: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(and(eq(products.shopId, shopId), eq(products.isAvailable, true)));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  // Orders
  async getOrders(): Promise<OrderWithDetails[]> {
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(sql`${orders.createdAt} DESC`);

    const ordersWithDetails = await Promise.all(
      allOrders.map(async (order) => {
        const [shop] = await db.select().from(shops).where(eq(shops.id, order.shopId));
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          shop,
          items,
        };
      })
    );

    return ordersWithDetails;
  }

  async getOrder(id: string): Promise<OrderWithDetails | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const [shop] = await db.select().from(shops).where(eq(shops.id, order.shopId));
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

    return {
      ...order,
      shop,
      items,
    };
  }

  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();

    // Insert order items
    const orderItemsWithOrderId = items.map(item => ({
      ...item,
      orderId: order.id,
    }));

    await db.insert(orderItems).values(orderItemsWithOrderId);

    return order;
  }
}

export const storage = new DatabaseStorage();
