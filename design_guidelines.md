# Handshop Design Guidelines

## Design Approach

**Hybrid Reference + System Approach**
Drawing inspiration from leading delivery platforms (Uber Eats, DoorDash, Swiggy) combined with Material Design principles for mobile-first utility applications. Focus on speed, clarity, and location-first user experience.

**Core Principles:**
- Location-aware design that makes geography central to the experience
- Rapid information scanning for quick decision-making
- Trust-building through clear pricing and distance information
- Minimal friction from discovery to order placement

---

## Color Palette

### Light Mode
- **Primary**: 16 85% 47% (Vibrant delivery green - trust and action)
- **Surface**: 0 0% 100% (Pure white for clean information display)
- **Surface Secondary**: 220 13% 96% (Subtle gray for cards/sections)
- **Text Primary**: 222 47% 11% (Near-black for readability)
- **Text Secondary**: 215 14% 34% (Medium gray for supporting info)
- **Border**: 220 13% 91% (Subtle separation)
- **Accent**: 25 95% 53% (Warm orange for promotions/highlights)

### Dark Mode
- **Primary**: 16 85% 47% (Consistent green)
- **Surface**: 222 47% 11% (Deep dark background)
- **Surface Secondary**: 217 33% 17% (Elevated surfaces)
- **Text Primary**: 210 40% 98% (High contrast white)
- **Text Secondary**: 217 10% 65% (Muted for hierarchy)
- **Border**: 217 33% 24% (Subtle in dark)

---

## Typography

**Font Stack**: 'Inter', 'SF Pro', -apple-system, system-ui, sans-serif

**Hierarchy:**
- **Hero/Display**: 32px/38px, Weight 700 (Shop names, headers)
- **H1**: 24px/32px, Weight 600 (Section titles)
- **H2**: 20px/28px, Weight 600 (Card headers, shop names in list)
- **Body Large**: 16px/24px, Weight 400 (Primary content, descriptions)
- **Body**: 14px/20px, Weight 400 (Supporting text, details)
- **Small**: 12px/16px, Weight 500 (Distance, delivery fee labels)
- **Caption**: 11px/14px, Weight 500 (Timestamps, meta info)

**Emphasis:**
- Distance/pricing: Weight 600 for quick scanning
- Shop names: Weight 600 for prominence
- Status indicators: Weight 500, all-caps with letter-spacing

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 3, 4, 6, 8, 12, 16

**Mobile-First Grid:**
- Base padding: p-4 (mobile screens)
- Container max-width: max-w-7xl for desktop expansion
- Card spacing: gap-3 for dense listings, gap-4 for detailed views
- Section spacing: py-6 mobile, py-8 tablet, py-12 desktop

**Key Measurements:**
- Bottom navigation height: 64px (fixed, always visible)
- Map header height: 56px with location chip
- Shop card height: Auto with min-h-24
- Floating action button offset: 16px from bottom nav

---

## Component Library

### A. Navigation & Location

**Bottom Navigation Bar** (Fixed Mobile)
- Four icons: Map, Shops, Orders, Account
- Active state: Primary color with label
- Inactive: Text secondary with icon only
- Elevation: shadow-lg with blur backdrop

**Location Header**
- Compact 56px height
- Current location chip (pill shape, primary background)
- Edit location icon button
- Subtle shadow for separation from map

**Map View Controls**
- Floating zoom buttons (bottom-right, above bottom nav)
- Center to user location FAB (primary color, 56px circle)
- Shop markers: Custom pins with shop logos, cluster for 3+ shops
- User marker: Pulsing blue dot with accuracy radius

### B. Shop Listings

**Shop Card (List View)**
- Horizontal layout: 80px square shop image | Content | Distance pill
- Content: Shop name (Weight 600), category tags, rating stars
- Distance: Rounded pill, text-sm, secondary background
- Delivery fee: Bold, primary color if free/low, standard if higher
- Tap target: Full card with subtle scale on press

**Shop Card (Grid View - Tablet/Desktop)**
- Vertical layout: 160px image height | Content padding 4
- Shop logo: Overlapping image with white border
- Quick info badges: Distance, delivery fee, rating as chips
- Hover state: Subtle lift with shadow transition

**Distance & Pricing Display**
- Distance format: "1.2 km" with location pin icon
- Delivery pricing:
  - Free delivery: Green badge, "FREE"
  - Flat rate: Standard, "₹30 delivery"
  - Distance-based: "₹20 + ₹5/km"
- Visual hierarchy: Larger, bolder for promotional pricing

### C. Shop Detail View

**Hero Section**
- Full-width shop cover image (180px height mobile)
- Overlapping shop logo (80px circle, white border)
- Floating back button (top-left, blur background)
- Shop name overlay on gradient (bottom of hero)

**Info Bar**
- Sticky below hero: Distance, delivery fee, rating, avg time
- Horizontal scroll for additional badges
- Background: Surface secondary with subtle border

**Menu/Product Catalog**
- Category sticky headers during scroll
- Product cards: Image left (80px) | Details | Add button
- Price: Weight 600, larger size
- Add to cart: Primary button, compact on mobile

**Order Summary Bar** (Sticky Bottom, Above Nav)
- Cart item count, subtotal
- "View Cart" primary button
- Slide-up animation when items added

### D. Order Placement

**Cart View (Full Screen)**
- Scrollable item list with quantity controls
- Line-item pricing clarity
- Delivery address confirmation card
- Pricing breakdown: Subtotal, delivery, total in bold
- Place order CTA: Full-width, primary, fixed bottom

**Order Confirmation**
- Success checkmark animation
- Order ID and estimated time
- Shop contact and navigation to shop
- Track order button (secondary)

### E. Form Elements

**Search Bar**
- Rounded full (9999px), 48px height mobile
- Leading search icon, trailing filter icon
- Placeholder: "Search shops, items..."
- Focus: Primary border, no background change

**Location Input**
- Leading location icon, autocomplete suggestions
- Current location quick action
- Recently used addresses

**Buttons**
- Primary: Rounded-lg, py-3 px-6, weight 600
- Secondary: Outline variant with primary border
- Icon buttons: 40px circle for mobile, 48px for desktop
- Floating action: 56px circle, shadow-xl, primary

---

## Animations & Interactions

**Subtle, Performance-First:**
- Map marker cluster/uncluster: 200ms ease
- Card press: Scale 0.98, 100ms
- Bottom sheet slide: 300ms ease-out
- Loading states: Skeleton screens, not spinners
- Success feedback: Micro-animation (checkmark draw, 400ms)

**No Animations On:**
- Scroll events (performance)
- Map panning (native control)
- List rendering (instant)

---

## Images

### Hero Image Strategy
**No Traditional Hero** - This is a utility app, not a marketing page. Lead with:
1. **Map as Hero**: Full-screen interactive map on app open (after location permission)
2. **Shop Images**: High-quality square images in listings (600x600px optimized)
3. **Shop Covers**: Horizontal banners in detail view (1200x400px)

### Image Requirements
- **Shop Logos**: Square, transparent PNG, 200x200px minimum
- **Product Images**: Square, 600x600px, optimized WebP
- **Shop Covers**: 1200x400px, optimized, with overlay-safe zones
- **Empty States**: Friendly illustrations for no shops, no orders
- **Map Markers**: SVG custom pins with shop branding

### Placeholder Strategy
- Lazy loading for all images below fold
- Blur-up technique for shop images
- Skeleton screens for loading lists
- Neutral gray backgrounds during load

---

## Accessibility & Performance

**Mobile Optimization:**
- Touch targets minimum 48px
- Thumb-zone primary actions (bottom third of screen)
- Haptic feedback on primary actions (native)
- Offline mode indicator and cached data

**Dark Mode:**
- Automatic system preference detection
- Toggle in account settings
- Consistent contrast ratios (WCAG AA minimum)
- Map style changes with theme

**Performance Targets:**
- Initial map load: <2s
- Shop list render: <500ms
- Image optimization: WebP with fallbacks
- Location update debounce: 2s

---

This design creates a fast, intuitive, location-first ordering experience that prioritizes information density and quick decision-making while maintaining visual clarity and trust.