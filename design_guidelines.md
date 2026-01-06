# Smile Ink Design Guidelines

## Design Approach
**Reference-Based**: Discord/Roblox-inspired dark interface with yellow/gold accents for a modern gaming community aesthetic. Balances information density with visual hierarchy through strategic use of cards, panels, and grid layouts.

## Typography
- **Primary Font**: Inter (Google Fonts) - Clean, readable for UI elements
- **Display Font**: Space Grotesk (Google Fonts) - Bold headers and feature titles
- **Hierarchy**:
  - Hero/Main Headers: Space Grotesk, 3xl-6xl, font-bold
  - Section Headers: Space Grotesk, 2xl-3xl, font-semibold
  - Subheadings: Inter, lg-xl, font-medium
  - Body Text: Inter, base-sm, font-normal
  - Labels/Meta: Inter, xs-sm, font-medium, uppercase tracking-wide

## Layout System
**Spacing Units**: Tailwind units 2, 4, 6, 8, 12, 16, 24
- Cards/Components: p-6 to p-8
- Section Spacing: py-16 to py-24
- Grid Gaps: gap-4 to gap-8
- Container: max-w-7xl with px-4 to px-8

## Component Library

### Navigation
- Fixed top navbar with glass-morphism effect (backdrop-blur-lg, bg-opacity-80)
- Logo left, primary nav center, user profile/CTA right
- Mobile: Hamburger menu with slide-out drawer
- Include marketplace, teams, animations, community tabs

### Hero Section
- Full-width dark gradient background with large hero image overlay
- Height: min-h-screen with centered content
- Headline + subtext + dual CTA buttons (primary yellow, secondary outlined)
- Animated statistics row below (Active Animators, Total Animations, Teams)
- Buttons over image: backdrop-blur-md with bg-black/30

### Marketplace Cards
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Each card: rounded-xl with dark background, hover lift effect
- Preview thumbnail, title, creator avatar/name, price tag (yellow badge), rating stars
- Compact info footer with views/likes icons

### Team Display
- Large feature cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Team banner image, logo overlay, member count, active status indicator
- Members grid (small avatars), team description excerpt
- "View Team" CTA button

### Animation Showcase
- Masonry grid or horizontal scroll row for featured animations
- Video thumbnail previews with play icon overlay
- Metadata: creator, duration, category tags (pill-shaped)

### Community Feed
- Discord-style message/post cards
- User avatar left, content right, timestamp, interaction buttons (like, comment)
- Nested reply threading with subtle indentation

### Profile Cards
- Compact user cards throughout: avatar, username, role badge, online status dot
- Hover reveals quick stats (animations, followers)

### Sidebar Filters (Marketplace/Browse)
- Sticky left sidebar on desktop
- Collapsible categories, price range sliders, tag chips
- Yellow accent for active filters

### Footer
- Three-column layout: About/Links, Quick Access, Social/Newsletter
- Dark background with subtle top border
- Small Roblox disclaimer text

## Images
1. **Hero Image**: Large 1920x1080 dramatic Roblox animation scene with vibrant characters, slightly darkened overlay for text readability, positioned as background-cover
2. **Marketplace Thumbnails**: 400x300 animation preview images per item
3. **Team Banners**: 1200x400 custom team graphics/branding
4. **Animation Previews**: 16:9 video thumbnails with play button overlay
5. **Creator Avatars**: 64x64 circular profile images throughout
6. **Featured Section**: 800x600 high-quality showcase animations in hero carousel

**Visual Treatment**: All images use rounded corners (rounded-lg to rounded-xl), subtle shadow effects, and maintain dark mode compatibility with slight overlays where needed.