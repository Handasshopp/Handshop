# Handshop - Location-Based Shop Discovery & Delivery

## Overview
Handshop is a mobile-first progressive web application that helps users discover nearby shops, compare delivery prices based on real-time location, and place orders with ease. The app uses geolocation to find shops within range and calculates delivery fees using either flat-rate or distance-based pricing models.

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with PostGIS for geospatial queries
- **Maps**: Leaflet.js for interactive map visualization
- **State Management**: TanStack Query, React Context API
- **Routing**: Wouter

## Project Architecture

### Database Schema
- **shops**: Shop information with geolocation (latitude/longitude), delivery pricing configuration
- **products**: Menu items for each shop
- **orders**: Customer orders with delivery details and pricing breakdown
- **order_items**: Individual items in each order

### Key Features
1. **Geolocation-First**: Real-time user location detection with permission handling
2. **Interactive Map**: Leaflet-powered map showing user location and nearby shop markers
3. **Distance Calculation**: Haversine formula for accurate straight-line distance
4. **Flexible Delivery Pricing**: 
   - Flat-rate delivery fees
   - Distance-based pricing (base fee + per-km charge)
5. **Smart Cart**: Shop-specific cart that clears when switching between shops
6. **Order Management**: Full order placement with delivery address and phone
7. **Dark Mode**: Auto-detect system preference with manual toggle

### Frontend Structure
- `/pages`: Main application pages (Map, Shops, ShopDetail, Cart, Orders, Account)
- `/components`: Reusable UI components (ShopCard, ProductCard, MapView, BottomNavigation)
- `/contexts`: React Context providers for location and cart state
- `/lib`: Utility functions for geolocation and delivery pricing

### Design System
Following Material Design principles with delivery platform inspiration (Uber Eats, DoorDash):
- **Primary Color**: Vibrant delivery green (#16a34a)
- **Accent Color**: Warm orange for promotions
- **Typography**: Inter font family with mobile-optimized sizes
- **Mobile-First**: Bottom navigation, touch-friendly buttons (min 48px targets)
- **Performance**: Skeleton screens, lazy loading, debounced location updates

## Recent Changes
- Initial setup with complete schema and frontend components
- Implemented geolocation context with permission handling
- Created cart context with shop-specific cart management
- Built all core pages with mobile-first responsive design
- Integrated Leaflet.js for map visualization
- Added dark mode support with system preference detection

## User Preferences
- Mobile-first progressive web app approach
- Location-based features are central to the experience
- Clean, fast UI with minimal friction from discovery to order placement
- Transparent pricing with upfront delivery fee calculation

## Development Notes
- Database uses PostgreSQL with geolocation support (latitude/longitude fields)
- Distance calculation uses Haversine formula for MVP (can be upgraded to Google Distance Matrix API for route-based distances)
- Map markers use custom styling with primary color branding
- Cart automatically clears when user adds items from a different shop
- All interactive elements have proper data-testid attributes for testing
