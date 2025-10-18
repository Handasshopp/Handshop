import { db } from "./db";
import { shops, products } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Sample shops in Nairobi area (around -1.286389, 36.817223)
    const sampleShops = [
      {
        name: "Fresh Groceries Market",
        description: "Your neighborhood grocery store with fresh produce and daily essentials",
        category: "Groceries",
        imageUrl: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=400&fit=crop",
        coverImageUrl: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&h=400&fit=crop",
        latitude: -1.2864,
        longitude: 36.8172,
        address: "123 Kenyatta Avenue, Nairobi",
        deliveryType: "flat" as const,
        flatDeliveryFee: "50",
        baseDeliveryFee: "0",
        perKmFee: "0",
        rating: "4.5",
        avgDeliveryTime: 25,
      },
      {
        name: "Quick Bites Restaurant",
        description: "Fast food and quick meals delivered hot to your door",
        category: "Restaurant",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop",
        coverImageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=400&fit=crop",
        latitude: -1.2890,
        longitude: 36.8205,
        address: "456 Moi Avenue, Nairobi",
        deliveryType: "distance-based" as const,
        flatDeliveryFee: "0",
        baseDeliveryFee: "30",
        perKmFee: "10",
        rating: "4.7",
        avgDeliveryTime: 35,
      },
      {
        name: "Pharmacy Plus",
        description: "Medical supplies, prescriptions, and health products",
        category: "Pharmacy",
        imageUrl: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=400&fit=crop",
        coverImageUrl: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1200&h=400&fit=crop",
        latitude: -1.2820,
        longitude: 36.8150,
        address: "789 Uhuru Highway, Nairobi",
        deliveryType: "flat" as const,
        flatDeliveryFee: "0",
        baseDeliveryFee: "0",
        perKmFee: "0",
        rating: "4.8",
        avgDeliveryTime: 20,
      },
      {
        name: "Coffee Corner Cafe",
        description: "Artisan coffee, pastries, and light meals",
        category: "Cafe",
        imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop",
        coverImageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=400&fit=crop",
        latitude: -1.2915,
        longitude: 36.8180,
        address: "321 Haile Selassie Avenue, Nairobi",
        deliveryType: "distance-based" as const,
        flatDeliveryFee: "0",
        baseDeliveryFee: "20",
        perKmFee: "5",
        rating: "4.6",
        avgDeliveryTime: 30,
      },
      {
        name: "Tech Gadgets Store",
        description: "Electronics, accessories, and tech products",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
        coverImageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop",
        latitude: -1.2875,
        longitude: 36.8240,
        address: "555 Tom Mboya Street, Nairobi",
        deliveryType: "flat" as const,
        flatDeliveryFee: "100",
        baseDeliveryFee: "0",
        perKmFee: "0",
        rating: "4.4",
        avgDeliveryTime: 45,
      },
    ];

    const insertedShops = await db.insert(shops).values(sampleShops).returning();
    console.log(`✅ Inserted ${insertedShops.length} shops`);

    // Sample products for each shop
    const sampleProducts = [
      // Fresh Groceries Market
      { shopId: insertedShops[0].id, name: "Fresh Tomatoes", description: "Locally grown organic tomatoes", price: "150", imageUrl: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=400&fit=crop", category: "Vegetables" },
      { shopId: insertedShops[0].id, name: "Whole Milk", description: "Fresh pasteurized whole milk 1L", price: "120", imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop", category: "Dairy" },
      { shopId: insertedShops[0].id, name: "Brown Bread", description: "Freshly baked whole wheat bread", price: "80", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop", category: "Bakery" },
      { shopId: insertedShops[0].id, name: "Farm Eggs", description: "Free-range eggs - 1 dozen", price: "200", imageUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop", category: "Dairy" },

      // Quick Bites Restaurant
      { shopId: insertedShops[1].id, name: "Burger Deluxe", description: "Beef burger with cheese and fries", price: "450", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop", category: "Main Course" },
      { shopId: insertedShops[1].id, name: "Chicken Pizza", description: "12-inch pizza with chicken toppings", price: "650", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop", category: "Pizza" },
      { shopId: insertedShops[1].id, name: "Caesar Salad", description: "Fresh greens with grilled chicken", price: "350", imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop", category: "Salads" },
      { shopId: insertedShops[1].id, name: "Soda Can", description: "Cold refreshing soda", price: "80", imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop", category: "Beverages" },

      // Pharmacy Plus
      { shopId: insertedShops[2].id, name: "Pain Relief Tablets", description: "Paracetamol 500mg - 20 tablets", price: "150", category: "Medicine" },
      { shopId: insertedShops[2].id, name: "Vitamin C", description: "Immune support supplement", price: "250", category: "Supplements" },
      { shopId: insertedShops[2].id, name: "First Aid Kit", description: "Complete home first aid kit", price: "800", category: "Health" },
      { shopId: insertedShops[2].id, name: "Hand Sanitizer", description: "Antibacterial gel 500ml", price: "180", category: "Health" },

      // Coffee Corner Cafe
      { shopId: insertedShops[3].id, name: "Cappuccino", description: "Espresso with steamed milk foam", price: "250", imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop", category: "Coffee" },
      { shopId: insertedShops[3].id, name: "Croissant", description: "Buttery flaky pastry", price: "150", imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop", category: "Pastry" },
      { shopId: insertedShops[3].id, name: "Iced Latte", description: "Cold espresso with milk", price: "280", imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop", category: "Coffee" },
      { shopId: insertedShops[3].id, name: "Blueberry Muffin", description: "Fresh baked muffin with blueberries", price: "180", imageUrl: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop", category: "Pastry" },

      // Tech Gadgets Store
      { shopId: insertedShops[4].id, name: "Wireless Earbuds", description: "Bluetooth 5.0 earbuds with case", price: "2500", imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop", category: "Audio" },
      { shopId: insertedShops[4].id, name: "Phone Case", description: "Protective silicone case", price: "500", imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop", category: "Accessories" },
      { shopId: insertedShops[4].id, name: "USB Cable", description: "Fast charging USB-C cable", price: "350", imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop", category: "Cables" },
      { shopId: insertedShops[4].id, name: "Power Bank", description: "10000mAh portable charger", price: "1800", imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop", category: "Power" },
    ];

    const insertedProducts = await db.insert(products).values(sampleProducts).returning();
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
