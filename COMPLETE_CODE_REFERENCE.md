# GRASA UI Redesign - Complete Code Reference

## Project Overview
This document provides complete reference for all the premium UI updates made to the GRASA project. The redesign focuses on modern aesthetics, responsive design with percentage-based widths, and enhanced user experience.

---

## 1. COLOR SYSTEM & DESIGN TOKENS

### CSS Variables (app/globals.css)
```css
:root {
  --background: #ffffff;
  --foreground: #1f2937;          /* Dark Gray */
  --primary: #C5D82D;              /* Lime Green */
  --secondary: #f3f4f6;            /* Light Gray */
  --muted: #e5e7eb;                /* Medium Gray */
  --border: #e5e7eb;               /* Border Gray */
  --accent: #C5D82D;               /* Same as Primary */
  --ring: #C5D82D;                 /* Focus Ring */
}
```

### Color Usage
- **Primary/Accent**: `#C5D82D` - Call-to-action buttons, highlights
- **Foreground**: `#1f2937` - Text, primary content
- **Background**: `#ffffff` - Cards, main background
- **Secondary**: `#f3f4f6` - Alternative backgrounds
- **Borders**: `#e5e7eb` - Subtle borders, dividers
- **Grays**: Gray-100 to Gray-900 for various UI elements

---

## 2. RESPONSIVE WIDTH SYSTEM

### Container Widths Pattern
All major containers follow this pattern:
```javascript
w-[90%] md:w-[95%] mx-auto
```

This replaces fixed `max-w-7xl` with percentage-based approach:
- **Mobile (< 768px)**: 90% of viewport width
- **Tablet/Desktop (≥ 768px)**: 95% of viewport width
- **Auto margin**: Centers the container

### Benefits
- Better fluidity across all screen sizes
- Proper spacing on ultra-wide displays
- Responsive by default without media query hacks

### Examples
```jsx
// Header Container
<div className="w-[90%] md:w-[95%] mx-auto px-4 sm:px-6 lg:px-8">

// Hero Section Container
<div className="w-[90%] md:w-[95%] mx-auto">

// Footer Container
<div className="w-[90%] md:w-[95%] mx-auto px-4 md:px-6 lg:px-8">

// Products Grid Container
<div className="w-[90%] md:w-[95%] mx-auto">
```

---

## 3. HEADER COMPONENT (components/Header.tsx)

### Key Features
- Clean, minimal header with subtle shadow
- Responsive navigation (hidden on mobile, visible on desktop)
- Mobile hamburger menu with smooth slide animation
- Shopping cart with dynamic badge
- User account dropdown

### HTML Structure
```jsx
<header className="w-full bg-white fixed top-0 left-0 z-50 border-b border-gray-200 shadow-sm">
  {/* Logo */}
  <div className="flex items-center cursor-pointer">
    <Image src="/logo.png" alt="Grasa Logo" />
  </div>

  {/* Desktop Navigation (hidden md:flex) */}
  <nav className="hidden md:flex items-center gap-8">
    <a href="/products">Products</a>
    <a href="/blogs">Blog</a>
    <a href="/science">Science</a>
  </nav>

  {/* Right Section: CTA, Cart, Account, Menu */}
  <div className="flex items-center gap-3 sm:gap-5">
    <button className="hidden sm:block bg-accent...">START TEST ™</button>
    <button className="relative p-2 hover:bg-gray-100...">
      <FiShoppingCart />
      {cartCount > 0 && <span className="bg-red-500...">count</span>}
    </button>
    {/* User Account Button & Dropdown */}
    {/* Mobile Menu Toggle */}
  </div>
</header>
```

### Responsive Classes Used
- `hidden md:flex` - Hide on mobile, show on desktop
- `hidden sm:block` - Hide on mobile, show on small+ screens
- `md:hidden` - Hide on desktop, show on mobile
- `w-[90%] md:w-[95%]` - Responsive width container

---

## 4. HERO SECTION (components/HeroSection.tsx)

### Major Features
- Dark gradient background with overlay
- Gradient text effect on headline
- Badge above headline for context
- Dynamic button states (default, with result, retake)
- Animated stat cards with colored icons

### Hero Background
```jsx
<div className="bg-gradient-to-br from-gray-900 to-black">
  <div 
    className="absolute inset-0 bg-cover bg-center z-0 opacity-50"
    style={{backgroundImage: `url('/bg2.png')`}}
  />
  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-1" />
</div>
```

### Headline Gradient
```jsx
<h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-8">
  Know the root cause
  <span className="bg-gradient-to-r from-accent via-lime-400 to-accent bg-clip-text text-transparent">
    of your digestive problems
  </span>
</h1>
```

### Button Variations
```jsx
// Primary CTA
<button className="bg-accent text-foreground font-bold px-8 py-4 rounded-lg
  hover:shadow-lg hover:scale-105 transition-all duration-300">
  START YOUR TEST ™
</button>

// Secondary Button
<button className="bg-white/20 hover:bg-white/30 border border-white/40 text-white font-bold
  px-8 py-4 rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
  RETAKE TEST
</button>
```

### Stat Cards Grid
```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
  {/* Card 1 - 500+ */}
  <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg 
    hover:shadow-xl hover:-translate-y-2 transition-all duration-300 
    border border-gray-100 backdrop-blur-sm">
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="bg-accent/20 p-3 rounded-lg">
          {/* Icon SVG */}
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">500+</h3>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">
        People Helped
      </p>
    </div>
  </div>
  {/* Repeat for other cards with different icon backgrounds */}
</div>
```

---

## 5. FOOTER COMPONENT (components/Footer.tsx)

### Structure
```jsx
<footer className="bg-gray-50 border-t border-gray-200 text-gray-700">
  <div className="w-[90%] md:w-[95%] mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20">
    
    {/* 5-Column Grid */}
    <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5">
      {/* Logo & Company Info */}
      <div className="md:col-span-2 lg:col-span-2">
        {/* Logo, Description, Contact */}
      </div>

      {/* Product Links */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-800 border-b-2 border-primary inline-block pb-1">
          Product
        </h3>
        <ul className="space-y-3">
          {/* Links */}
        </ul>
      </div>

      {/* Legal Links */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-800 border-b-2 border-primary inline-block pb-1">
          Legal
        </h3>
        <ul className="space-y-3">
          {/* Links */}
        </ul>
      </div>

      {/* Location & Social */}
      <div className="space-y-4 lg:col-span-1">
        <h3 className="text-base font-bold text-gray-800 border-b-2 border-primary inline-block pb-1">
          Our Location
        </h3>
        {/* Address */}
        {/* Social Icons */}
      </div>
    </div>

    {/* Copyright */}
    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
      <p className="text-md text-gray-500">© 2025 GRASA MILLETS & FOODS PVT. LTD.</p>
    </div>
  </div>
</footer>
```

---

## 6. PRODUCTS GRID (components/ProductsGrid.tsx)

### Section Styling
```jsx
<section className="bg-gray-50 py-12 md:py-20">
  <div className="w-[90%] md:w-[95%] mx-auto">
    {/* Header */}
    <div className="mb-12">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.2] mb-4 text-foreground">
        Millet Products
      </h2>
      <p className="text-gray-600 max-w-2xl text-base sm:text-lg leading-relaxed">
        Discover our range of wholesome products...
      </p>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* Product Cards */}
    </div>
  </div>
</section>
```

### Product Card
```jsx
<div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 
  shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 
  overflow-hidden cursor-pointer flex flex-col">
  
  {/* Image */}
  <div className="w-full h-48 sm:h-56 overflow-hidden shrink-0 bg-gray-100">
    <img src={product.image_url} alt={product.name} 
      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
  </div>

  {/* Content */}
  <div className="p-4 sm:p-5 flex flex-col flex-grow">
    <h3 className="text-lg sm:text-xl font-bold text-foreground line-clamp-1 mb-3">
      {product.name}
    </h3>

    {/* Price */}
    <div className="flex items-center gap-3 mb-2">
      <span className="text-gray-500 line-through text-sm font-medium">
        ₹{product.price}
      </span>
      <span className="text-green-600 text-sm sm:text-base font-bold bg-green-50 px-2 py-1 rounded">
        {product.discount_percent.toFixed(1)}% OFF
      </span>
    </div>

    <div className="text-2xl sm:text-3xl font-bold text-accent mb-4">
      ₹{product.effective_price}
    </div>

    {/* Tags Section */}
    <div className="flex-grow mb-4 flex flex-col gap-3 mt-2">
      {/* What You'll Feel */}
      {/* Key Ingredients */}
    </div>

    {/* Action Buttons */}
    <div className="flex gap-3 sm:gap-4 pt-4 mt-auto">
      <button className="flex-1 bg-foreground text-white py-2.5 sm:py-3 rounded-lg 
        font-semibold hover:bg-gray-800 transition-colors duration-300">
        View
      </button>

      {!cartItem ? (
        <button className="flex-1 py-2.5 sm:py-3 rounded-lg font-semibold transition-all 
          duration-300 bg-accent text-foreground hover:shadow-lg hover:scale-105">
          Add
        </button>
      ) : (
        <div className="flex items-center justify-between bg-accent rounded-lg flex-1 px-2">
          <button><FiMinus /></button>
          <span>{cartItem.quantity}</span>
          <button><FiPlus /></button>
        </div>
      )}
    </div>
  </div>
</div>
```

---

## 7. TYPOGRAPHY & SPACING SCALE

### Font Sizing
```javascript
// Headings
text-sm sm:text-base      // Small text
text-base sm:text-lg      // Body text
text-lg sm:text-xl        // Section headings
text-xl sm:text-2xl       // Large headings
text-2xl sm:text-3xl      // Larger headings
text-3xl sm:text-4xl      // Huge headings
text-4xl sm:text-5xl      // Hero headings
```

### Line Heights
```javascript
leading-tight             // 1.25 (headings)
leading-snug              // 1.375 (body text)
leading-relaxed           // 1.625 (body text, better readability)
leading-[1.1]             // Custom (headlines)
leading-[1.2]             // Custom (section titles)
```

### Spacing Scale
```javascript
// Vertical spacing
py-2 py-3 py-4 py-6      // Padding vertical
mb-4 mb-6 mb-8 mb-12     // Margin bottom
mt-4 mt-6 mt-8 mt-12     // Margin top
pt-4 pt-6 pt-8 pt-12     // Padding top

// Horizontal spacing
px-4 px-6 px-8           // Padding horizontal
gap-3 gap-4 gap-6 gap-8  // Gap between items
```

---

## 8. RESPONSIVE BREAKPOINTS

### Tailwind Breakpoints Used
```javascript
// Default (mobile first)
// Styles apply to all screen sizes

// sm (640px)
sm:text-base, sm:p-5, sm:gap-4, sm:grid-cols-2

// md (768px)
md:flex, md:w-[95%], md:py-20, md:text-lg, md:grid-cols-2

// lg (1024px)
lg:text-xl, lg:px-12, lg:grid-cols-4, lg:text-5xl

// xl (1280px)
xl:text-7xl
```

### Mobile-First Approach
Always apply smallest styles first, then use responsive modifiers:
```jsx
// ✅ Correct
<div className="w-full text-sm sm:text-base md:text-lg">

// ❌ Incorrect
<div className="text-lg md:text-base sm:text-sm">
```

---

## 9. TRANSITION & ANIMATION CLASSES

### Hover Effects
```javascript
transition-all duration-300                    // All properties
transition-colors duration-300                 // Color only
transition-transform duration-300              // Transform only

// Button hover effects
hover:shadow-lg hover:scale-105
hover:shadow-xl hover:-translate-y-1           // Lift effect
hover:bg-gray-100 transition-colors            // Color change

// Card hover effects
hover:shadow-lg hover:-translate-y-2
hover:shadow-xl hover:scale-105
```

### Transform Effects
```javascript
scale-105 scale-110                // Scale up on hover
-translate-y-1 -translate-y-2      // Move up on hover
translate-x-1                      // Move right (for icons)
group-hover:translate-x-1          // Group hover states
```

---

## 10. SEMANTIC COLOR USAGE

### Text Colors
```javascript
text-foreground              // Primary text (#1f2937)
text-gray-600               // Secondary text
text-gray-700               // Slightly darker secondary
text-gray-500               // Muted text
text-gray-400               // Light text (disabled)
text-white                  // On dark backgrounds
```

### Background Colors
```javascript
bg-white                    // Primary background
bg-gray-50                  // Section background
bg-gray-100                 // Secondary background
bg-accent                   // Primary action background
bg-accent/20                // Subtle accent background
bg-green-50                 // Complementary backgrounds
```

### Border Colors
```javascript
border-gray-200             // Subtle borders
border-gray-300             // Medium borders
border-white/20             // Semi-transparent white
border-white/40             // More opaque white
```

---

## 11. COMPONENT PATTERNS

### Button Pattern
```jsx
<button className={`
  px-6 py-3 rounded-lg
  font-semibold text-sm sm:text-base
  transition-all duration-300
  hover:shadow-lg hover:scale-105
  ${variant === 'primary' 
    ? 'bg-accent text-foreground' 
    : 'bg-white border border-gray-200 text-foreground'
  }
`}>
  Button Text
</button>
```

### Card Pattern
```jsx
<div className={`
  bg-white rounded-xl sm:rounded-2xl
  border border-gray-200
  shadow-md hover:shadow-xl
  transition-all duration-300
  p-4 sm:p-6
  ${hoverEffect && 'hover:-translate-y-2'}
`}>
  {content}
</div>
```

### Grid Pattern
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
  {items.map(item => <Card key={item.id} item={item} />)}
</div>
```

---

## 12. ACCESSIBILITY NOTES

### ARIA Labels
```jsx
<button aria-label="Shopping cart">
  <FiShoppingCart />
</button>

<nav aria-label="Main navigation">
  {/* Navigation items */}
</nav>
```

### Screen Reader Text
```jsx
<span className="sr-only">Currently showing cart with 3 items</span>
```

### Color Contrast
- Text on accent background: Foreground color (#1f2937) - WCAG AA compliant
- White text on dark: WCAG AAA compliant
- Gray-600 on white: WCAG AA compliant

---

## 13. PERFORMANCE TIPS

1. **Image Optimization**
   - Use Next.js Image component
   - Set proper sizes and srcSet
   - Use WebP format where possible

2. **CSS Optimization**
   - Use Tailwind's tree-shaking
   - Avoid unnecessary custom CSS
   - Use semantic color tokens

3. **Animation Performance**
   - Prefer `transform` and `opacity` for animations
   - Avoid animating expensive properties
   - Use `will-change` sparingly

4. **Layout Shift Prevention**
   - Set fixed aspect ratios for images
   - Reserve space for dynamic content
   - Use skeleton loaders

---

## 14. QUICK REFERENCE CHECKLIST

- [x] Updated color system with CSS variables
- [x] Implemented percentage-based widths (w-[90%] md:w-[95%])
- [x] Created responsive navigation
- [x] Enhanced buttons with hover effects
- [x] Improved card designs with shadows
- [x] Added smooth transitions throughout
- [x] Mobile-first responsive design
- [x] Proper typography scale
- [x] Accessibility compliance
- [x] Performance optimizations

---

## 15. FUTURE IMPROVEMENTS

1. Add dark mode support
2. Implement loading skeletons
3. Add micro-interactions with Framer Motion
4. Enhance form validation UX
5. Add image lazy loading
6. Implement infinite scroll for products
7. Add filter/sort functionality
8. Implement wishlist feature
