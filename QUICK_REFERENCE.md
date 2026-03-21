# GRASA Upgrade - Quick Reference

## Import Everything From One Place

```tsx
import { 
  // Components
  PremiumCard, StatCard, FeatureCard,
  PremiumButton, IconButton,
  ResponsiveContainer, ResponsiveGrid,
  ScrollFadeIn, ScrollSlide, Parallax,
  
  // Hooks
  useData, useMutation, useForm,
  useBreakpoint, useIsMobile,
  useAnimation, useParallax,
  
  // Utilities
  animationPresets, apiClient, a11y
} from '@/lib'
```

## Most Used Components

### Cards
```tsx
<PremiumCard hover="lift" animated delay={200}>
  Content here
</PremiumCard>

<StatCard label="Users" value="1.2K" icon={<UsersIcon />} />

<FeatureCard title="Feature" description="..." image="/img.jpg" />
```

### Buttons
```tsx
<PremiumButton variant="primary" size="lg">
  Click Me
</PremiumButton>

<IconButton icon={<X />} variant="ghost" size="md" />
```

### Layouts
```tsx
<ResponsiveContainer maxWidth="2xl" padding="lg">
  <ResponsiveGrid columns={{ md: 2, lg: 3 }}>
    {/* items */}
  </ResponsiveGrid>
</ResponsiveContainer>
```

### Animations
```tsx
<ScrollFadeIn delay={100}>
  Fades in when scrolled into view
</ScrollFadeIn>

<Parallax offset={0.5}>
  <img src="img.jpg" />
</Parallax>
```

## Most Used Hooks

### Data Fetching
```tsx
// Read
const { data, isLoading, error, refetch } = useData('/api/items')

// Create/Update/Delete
const { mutate, isLoading } = useMutation('POST', '/api/items')

// Pagination
const { items, nextPage, prevPage } = usePagination('/api/items')

// Search
const { results, handleSearch } = useDebouncedSearch('/api/search')
```

### Forms
```tsx
const form = useForm(
  { email: '', password: '' },
  (values) => submitForm(values),
  (values) => validateForm(values)
)

<form onSubmit={form.handleSubmit}>
  <input {...form.getFieldProps('email')} />
  <button type="submit" disabled={form.isSubmitting}>
    Submit
  </button>
</form>
```

### Responsive
```tsx
const { breakpoint } = useBreakpoint()
const isMobile = useIsMobile()
const isDesktop = useIsDesktop()
```

## Tailwind Utilities

### Animations
```tsx
<div className="animate-fade-in-up">
<div className="animate-fade-in hover-lift">
<div className="transition-smooth">
```

### Spacing
```tsx
<div className="px-4 py-6 sm:px-6 sm:py-12 lg:px-8">
```

### Shadows & Effects
```tsx
<div className="shadow-premium hover-glow">
<div className="glass-effect backdrop-blur-premium">
```

## Color Reference

- **Primary Accent:** `#C5D82D` (use as `[#C5D82D]`)
- **Dark:** `#0a0a0a` or `#1a1a1a`
- **Light:** `white`, `gray-50`, `gray-100`
- **Grays:** `gray-200` to `gray-900`

## Button Variants

| Variant | Use Case |
|---------|----------|
| primary | Main CTA, important actions |
| secondary | Secondary actions |
| outline | Alternative actions |
| ghost | Subtle actions, text-like |
| danger | Destructive actions |

## Button Sizes

| Size | Use Case |
|------|----------|
| sm | Small UI elements, compact layouts |
| md | Standard buttons (default) |
| lg | Large CTAs, hero sections |
| xl | Extra large, prominent CTAs |

## Animation Delays

```tsx
// For staggered lists:
<PremiumCard delay={0}>
<PremiumCard delay={100}>    // 100ms delay
<PremiumCard delay={200}>    // 200ms delay
<PremiumCard delay={300}>    // etc.
```

## Responsive Breakpoints

```tsx
<!-- Mobile first: -->
<div className="block md:hidden">Mobile only</div>
<div className="hidden md:block">Desktop only</div>

<!-- Grid columns: -->
<ResponsiveGrid columns={{ mobile: 1, md: 2, lg: 3 }}>
```

## Common Patterns

### Loading State
```tsx
{isLoading && <Shimmer count={3} />}
{!isLoading && data && <YourComponent data={data} />}
{error && <ErrorMessage error={error} />}
```

### Empty State
```tsx
{data?.length === 0 && <EmptyState />}
{data?.length > 0 && <ListComponent items={data} />}
```

### Conditional Rendering
```tsx
const isMobile = useIsMobile()

return isMobile ? <MobileView /> : <DesktopView />
```

### Combining Hooks
```tsx
const form = useForm(...)
const { mutate, isLoading } = useMutation('POST', '/api/submit')

const handleSubmit = form.handleSubmit(async (values) => {
  await mutate(values)
})
```

## Accessibility

### Always Include
```tsx
// Alt text for images
<img alt="Description" src="..." />

// Labels for inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Semantic buttons
<button onClick={...}>Click me</button>  // Not <div onClick>

// ARIA for custom components
<div role="button" aria-label="Close">
```

### Keyboard Navigation
```tsx
// Handled automatically by PremiumButton
// Custom elements need:
onKeyDown={(e) => {
  if (e.key === 'Enter') handleClick()
}}
```

## Performance Tips

1. **Use caching**
   ```tsx
   useData(url, { cache: true, revalidateInterval: 30000 })
   ```

2. **Debounce search**
   ```tsx
   useDebouncedSearch(url, 300)  // 300ms delay
   ```

3. **Lazy load images**
   ```tsx
   <img loading="lazy" src="..." alt="..." />
   ```

4. **Memoize expensive renders**
   ```tsx
   const MemoizedComponent = React.memo(ExpensiveComponent)
   ```

## Debugging

```tsx
// Check breakpoint
console.log(breakpoint)  // 'sm', 'md', 'lg', etc.

// Monitor API calls
import { apiClient } from '@/lib'
apiClient.clearCache()  // Clear cache if needed

// Check animation state
const { isAnimating, startAnimation } = useAnimationState()
```

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Animations choppy | Use `transition-smooth` class |
| Form not submitting | Check `form.isSubmitting` |
| Data not loading | Call `refetch()` |
| Mobile layout broken | Check `useIsMobile()` breakpoint |
| Images stretched | Add `object-cover` with `w-full h-full` |

## Resources

- **Full Guide:** See `UPGRADE_GUIDE.md`
- **Summary:** See `IMPLEMENTATION_SUMMARY.md`
- **Type Definitions:** Each component has full TS types
- **Examples:** Check component JSDoc comments

---

**Need more details?** Check the full documentation in `UPGRADE_GUIDE.md`
