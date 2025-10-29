# Ecommerce Website UI/UX Guidelines

## FORMS DESIGN
- Use single column layouts for all forms (checkout, registration, login)
- Remove unnecessary borders for cleaner design
- Hide infrequent/advanced options by default
- Add icons to input fields (email, password, search icons)
- Use user-friendly language, avoid technical jargon
- Accent important fields with visual elements

### Checkboxes vs Switches
**Use Checkboxes when:**
- User must confirm/verify before submission (shipping options, terms)
- Requires action button like Submit, OK, Next, Apply
- Selecting multiple options from a list
- Changes need additional steps to take effect

**Use Switches when:**
- Instant response expected (filter toggles, view options)
- Result is simple on/off or show/hide
- No verification or confirmation needed

## TYPOGRAPHY RULES
- **Line Length:** 60 characters per line for desktop, 30-40 for mobile
- **Line Spacing:** 30% larger than character height (line-height: 1.3-1.5)
- **Font Choice:** Use sans-serif fonts for body text (easier screen reading)
- **Alignment:** Left-align all body text
- **Minimize Fonts:** Use 2-3 fonts maximum across the site
- **Text Color:** Avoid pure red or green text for accessibility
- **Standard Fonts:** Prefer Google Fonts, Adobe Fonts, or system fonts
- Display fonts for headlines only, sans-serif for body text

## COLOR STRATEGY
### 60-30-10 Rule
- 60% Dominant/Brand color (main backgrounds, large areas)
- 30% Secondary color (supporting backgrounds, cards)
- 10% Accent color (CTAs, buttons, highlights, sale tags)

### Color Meanings for Ecommerce
- **Blue:** Trust, safety, responsibility (ideal for primary brand color)
- **Red:** Urgency, sales, danger (use for sales tags, limited offers)
- **Green:** Success, eco-friendly, nature (confirmations, eco products)
- **Black:** Luxury, elegance (premium products)
- **White:** Purity, cleanliness (backgrounds, minimalism)

### Color Guidelines
- Avoid pure gray and pure black - use slightly tinted versions
- Use complementary colors for call-to-action buttons (makes them pop)
- Use analogous colors for cohesive category grouping
- Ensure sufficient contrast for accessibility
- Blue recommended as primary color (inspires confidence, accessible for colorblind users)

## LAYOUT & ATTENTION PRINCIPLES
### Grouping (7±2 Rule)
- Display 5-9 items per group/row
- Group related products in chunks of 7 or fewer
- Break large lists into manageable sections

### Edge Effect
- Place important elements at top and bottom of page
- Users notice edges (top/bottom) more than middle
- Position: prices, CTAs, key info at strategic edges

### Attention Flow
- Design clear visual hierarchy: Product Image → Title → Price → CTA
- Use faces in product photos to catch attention
- Create attention vector that guides user linearly through content

### Banner Blindness
- Avoid making CTAs look like ads
- Integrate important elements into natural content flow
- Don't place critical info in typical ad positions

## COMPONENT-SPECIFIC GUIDELINES

### Product Cards
- Clear product image (use faces when relevant)
- Product title (left-aligned, readable font)
- Price prominently displayed
- CTA button with accent color
- Group in sets of 6-8 per row/section

### Checkout Form
- Single column layout
- Checkboxes for shipping options
- Icons for input fields
- Clear error messages in user language
- Progress indicator at top
- CTA at bottom (edge effect)

### Navigation
- Group menu items in 5-7 categories max
- Use icons with labels for clarity
- Sticky navigation for easy access

### Product Filters
- Use switches for instant filter toggles
- Use checkboxes for filters requiring "Apply" button
- Group filters logically (price, category, brand)
- Show filter count (e.g., "Filters (3)")

### Product Pages
- Images dominate top section
- Text content: 60 chars per line
- Complementary color for "Add to Cart"
- Related products grouped in 6-8 items

## RESPONSIVE DESIGN
- Mobile: 30-40 characters per line
- Desktop: 60 characters per line
- Stack single column on mobile
- Maintain color ratios across breakpoints
- Touch targets minimum 44x44px on mobile

## ACCESSIBILITY
- Blue primary color works for most colorblind users
- Avoid red/green for critical text
- Ensure color contrast ratios meet WCAG standards
- Left-aligned text for easier reading
- Sans-serif fonts for better screen legibility