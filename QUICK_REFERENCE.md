# GRASA UI - Developer Quick Reference

Quick copy-paste guide for common patterns and components.

---

## Color Tokens

```javascript
// Primary Colors
bg-accent              // #C5D82D (lime green)
text-accent            // #C5D82D (lime green)
text-foreground        // #1f2937 (dark gray)

// Grays
bg-white              // #ffffff
bg-gray-50            // #f9fafb (light bg)
bg-gray-100           // #f3f4f6
text-gray-600         // #4b5563
text-gray-700         // #374151

// Status
bg-green-50           // Light green
text-green-600        // Dark green
bg-red-500            // Error/Alert
```

---

## Container Width Pattern

**Use this for ALL major containers:**
```jsx
<div className="w-[90%] md:w-[95%] mx-auto px-4 sm:px-6 md:px-8">
  {/* Content */}
</div>
```

---

## Button Patterns

### Primary CTA Button
```jsx
<button className="bg-accent text-foreground font-semibold px-8 py-4 rounded-lg
  hover:shadow-lg hover:scale-105 transition-all duration-300">
  START TEST
</button>
```

### Secondary Button
```jsx
<button className="bg-white border border-gray-200 text-foreground font-semibold
  px-8 py-4 rounded-lg hover:bg-gray-50 transition-all duration-300">
  Learn More
</button>
```

### Icon Button
```jsx
<button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
  <FiShoppingCart className="w-6 h-6" />
</button>
```

---

## Card Patterns

### Standard Card
```jsx
<div className="bg-white rounded-xl border border-gray-200 shadow-md
  hover:shadow-lg transition-shadow p-4 sm:p-6">
  {/* Content */}
</div>
```

### Interactive Card (with hover lift)
```jsx
<div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200
  shadow-md hover:shadow-xl hover:-translate-y-2
  transition-all duration-300 p-4 sm:p-5">
  {/* Content */}
</div>
```

---

## Typography Patterns

### Heading with Gradient
```jsx
<h1 className="text-6xl font-bold">
  Know the root cause
  <span className="bg-gradient-to-r from-accent via-lime-400 to-accent
    bg-clip-text text-transparent">
    of your digestive problems
  </span>
</h1>
```

### Section Heading
```jsx
<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
  Millet Products
</h2>
<p className="text-gray-600 max-w-2xl text-base sm:text-lg leading-relaxed">
  Description...
</p>
```

### Body Text
```jsx
<p className="text-gray-600 leading-relaxed">
  Regular paragraph text with good readability
</p>
```

---

## Grid Patterns

### 2-Column Responsive
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### 3-Column Responsive
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### 4-Column Responsive
```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## Hover Effects

### Button Hover
```jsx
hover:shadow-lg hover:scale-105 transition-all duration-300
```

### Card Hover (Lift)
```jsx
hover:shadow-xl hover:-translate-y-2 transition-all duration-300
```

### Link Hover
```jsx
hover:text-accent transition-colors duration-300
```

### Image Hover
```jsx
hover:scale-105 transition-transform duration-300
```

---

## Responsive Padding

```jsx
// Horizontal padding
px-4 sm:px-6 md:px-8 lg:px-12

// Vertical padding
py-4 sm:py-6 md:py-8 lg:py-12

// Combined
p-4 sm:p-6 md:p-8
```

---

## Responsive Text Sizing

```jsx
// Small to Large
text-sm sm:text-base md:text-lg lg:text-xl

// Medium to XL
text-base sm:text-lg md:text-xl lg:text-2xl

// Large to 2XL
text-lg sm:text-xl md:text-2xl lg:text-3xl

// XL to 4XL
text-2xl sm:text-3xl md:text-4xl lg:text-5xl
```

---

## Navigation Bar

```jsx
<header className="w-full bg-white fixed top-0 z-50 border-b border-gray-200">
  <div className="w-[90%] md:w-[95%] mx-auto h-[72px] flex items-center justify-between">
    {/* Logo */}
    <div>Logo</div>

    {/* Desktop Nav (hidden on mobile) */}
    <nav className="hidden md:flex gap-8">
      <a href="/products">Products</a>
      <a href="/blog">Blog</a>
    </nav>

    {/* Right Section */}
    <div className="flex items-center gap-4">
      {/* CTA Button */}
      <button>START TEST</button>
      
      {/* Cart Icon */}
      <button className="relative p-2">
        <FiShoppingCart />
        <span className="absolute -top-1 -right-1 bg-red-500">1</span>
      </button>

      {/* Mobile Menu */}
      <button className="md:hidden">
        {open ? <FiX /> : <FiMenu />}
      </button>
    </div>
  </div>
</header>
```

---

## Product Card

```jsx
<div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200
  shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300
  overflow-hidden flex flex-col">
  
  {/* Image */}
  <div className="w-full h-48 sm:h-56 overflow-hidden bg-gray-100">
    <img src={image} className="w-full h-full object-cover
      hover:scale-105 transition-transform duration-300" />
  </div>

  {/* Content */}
  <div className="p-4 sm:p-5 flex flex-col flex-grow">
    <h3 className="text-lg font-bold text-foreground mb-2">Product Name</h3>
    
    {/* Price */}
    <div className="flex items-center gap-2 mb-4">
      <span className="text-gray-500 line-through text-sm">₹100</span>
      <span className="text-green-600 font-bold text-sm">50% OFF</span>
    </div>
    <div className="text-2xl font-bold text-accent mb-4">₹50</div>

    {/* Description */}
    <p className="text-gray-600 text-sm mb-auto">Product description</p>

    {/* Buttons */}
    <div className="flex gap-3 pt-4 mt-auto">
      <button className="flex-1 bg-foreground text-white py-3 rounded-lg
        font-semibold hover:bg-gray-800 transition-colors">
        View
      </button>
      <button className="flex-1 bg-accent text-foreground py-3 rounded-lg
        font-semibold hover:shadow-lg hover:scale-105 transition-all">
        Add
      </button>
    </div>
  </div>
</div>
```

---

## Badge/Label

```jsx
// Colored badge
<span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
  Label
</span>

// White badge
<span className="bg-white border border-gray-200 text-foreground px-3 py-1
  rounded-full text-sm font-medium">
  Label
</span>
```

---

## Form Input

```jsx
<input 
  type="text"
  placeholder="Search..."
  className="w-full px-4 py-3 rounded-lg border border-gray-200
    focus:outline-none focus:ring-2 focus:ring-accent
    transition-all duration-300"
/>
```

---

## Loading State

```jsx
{loading ? (
  <div className="text-center py-12">
    <div className="text-lg font-medium text-gray-600">Loading...</div>
  </div>
) : (
  {/* Content */}
)}
```

---

## Empty State

```jsx
<div className="text-center py-12">
  <h3 className="text-lg font-semibold text-foreground mb-2">
    No items found
  </h3>
  <p className="text-gray-600 mb-4">
    Try adjusting your filters
  </p>
  <button className="bg-accent text-foreground px-6 py-3 rounded-lg">
    Reset Filters
  </button>
</div>
```

---

## Mobile Menu

```jsx
{/* Overlay */}
{open && (
  <div className="fixed inset-0 bg-black/40 z-40 md:hidden"
    onClick={() => setOpen(false)} />
)}

{/* Sidebar */}
<div className={`fixed top-[72px] right-0 h-[calc(100vh-72px)]
  w-80 bg-white shadow-xl z-50 md:hidden
  transform transition-transform duration-300
  ${open ? 'translate-x-0' : 'translate-x-full'}`}>
  <div className="p-6 space-y-4">
    <a href="/products">Products</a>
    <a href="/blog">Blog</a>
  </div>
</div>
```

---

## Hero Section

```jsx
<section className="w-full px-4 py-12">
  <div className="w-[90%] md:w-[95%] mx-auto">
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl
      overflow-hidden min-h-[600px] relative">
      
      {/* Background */}
      <div className="absolute inset-0 opacity-50"
        style={{backgroundImage: `url('/bg.png')`}} />
      <div className="absolute inset-0
        bg-gradient-to-r from-black via-black/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-8 py-20 text-white max-w-2xl">
        <h1 className="text-6xl font-bold mb-6">
          Main Headline
        </h1>
        <button className="bg-accent text-foreground px-8 py-4 rounded-lg
          font-bold hover:shadow-lg hover:scale-105 transition-all">
          CTA Button
        </button>
      </div>
    </div>
  </div>
</section>
```

---

## Responsive Images

```jsx
<img 
  src={image}
  alt="Description"
  className="w-full h-auto object-cover"
/>

// With aspect ratio
<div className="w-full aspect-square">
  <img src={image} className="w-full h-full object-cover" />
</div>
```

---

## Useful Classes

```javascript
// Responsive Display
hidden md:block           // Hide on mobile, show on desktop
hidden md:flex            // Hide on mobile, flex on desktop
block md:inline-block     // Block on mobile, inline on desktop

// Text Utilities
text-balance              // Better line breaks
text-pretty               // Prettier text
line-clamp-1              // Truncate to 1 line
line-clamp-2              // Truncate to 2 lines

// Opacity
opacity-50                // Semi-transparent
opacity-0 pointer-events-none  // Hidden & not clickable

// Transitions
transition-all duration-300
transition-colors duration-300
transition-transform duration-300

// Positioning
fixed top-0 left-0 z-50
absolute right-0 top-1/2 -translate-y-1/2

// Flexbox
flex items-center justify-between
flex-1                    // Take available space
gap-4                     // Space between items
```

---

## Debugging Classes

Add to any element to see boundaries:
```jsx
className="border border-red-500"  // Red border
className="bg-red-100"             // Light red bg
className="outline"                // Outline focus
```

---

## Common Issues & Solutions

### Hydration Mismatch
```jsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

{mounted && <Component />}
```

### Preventing Event Propagation
```jsx
onClick={(e) => e.stopPropagation()}
```

### Fixed Header Spacing
```jsx
// Add padding-top to main equal to header height
<main className="pt-[72px]">
```

---

## Performance Tips

1. Use semantic color tokens instead of hex codes
2. Keep transitions to 300ms for snappy feel
3. Use transform/opacity for smooth animations
4. Lazy load images with Next.js Image
5. Use grid/flex instead of positioning
6. Avoid bg-gradient on hover (use scale instead)

---

## Browser Testing
- Test on Chrome, Firefox, Safari, Edge
- Test on mobile (375px), tablet (768px), desktop (1440px)
- Check hover effects on desktop
- Check touch interactions on mobile
- Verify dark colors have enough contrast

---

**Last Updated**: March 2026
**Version**: 1.0 (Redesigned)
