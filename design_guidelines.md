# Design Guidelines: Palu AI Streaming Platform

## Design Approach

**Selected Approach:** Reference-based with BNB Chain brand identity

**Primary References:**
- aikotv.com: Modern streaming interface, dark theme, clean chat integration
- BNB Chain visual identity: Yellow/gold primary color with high-tech aesthetics
- Twitch/YouTube Live: Streaming platform patterns for familiarity

**Core Design Principles:**
1. **Dark-First Immersion:** Deep black backgrounds that make the 3D model and chat content pop
2. **Pastel Yellow Accents:** Soft, eye-friendly yellows that contrast beautifully against black without overwhelming
3. **Tech-Forward Minimalism:** Clean, uncluttered interface that keeps focus on Max and interactions
4. **Responsive Real-time Feel:** Visual feedback for all AI and chat interactions

## Color Palette

**Dark Mode (Primary):**
- Background Base: `0 0% 8%` (near black, slightly warm)
- Background Secondary: `0 0% 12%` (cards, panels)
- Background Elevated: `0 0% 16%` (modals, dropdowns)

**BNB Chain Yellows (Pastel Range):**
- Primary Yellow: `48 85% 75%` (soft pastel yellow - main accent)
- Primary Yellow Hover: `48 90% 65%` (slightly deeper on interaction)
- Gold Accent: `45 80% 70%` (warm golden touch)
- Yellow Glow: `48 100% 60%` (for subtle glows and highlights)

**Functional Colors:**
- Text Primary: `0 0% 95%` (high contrast white)
- Text Secondary: `0 0% 65%` (muted descriptions)
- Text Muted: `0 0% 45%` (timestamps, metadata)
- Success: `142 70% 65%` (pastel green for confirmations)
- Error: `0 70% 70%` (pastel red for errors)
- Chat Bubble AI: `48 40% 25%` (dark yellow for Max's messages)

## Typography

**Font Families:**
- Primary: 'Inter', system-ui, sans-serif (modern, highly readable)
- Display/Headers: 'Space Grotesk', sans-serif (tech-forward personality)
- Monospace: 'JetBrains Mono', monospace (wallet addresses, technical data)

**Type Scale:**
- Hero/Display: text-5xl to text-6xl, font-bold (Space Grotesk)
- Section Headers: text-3xl, font-semibold
- Card Titles: text-xl, font-medium
- Body: text-base, font-normal
- Chat Messages: text-sm, font-normal
- Metadata/Labels: text-xs, font-medium, uppercase tracking-wide

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Micro spacing: p-2, gap-2 (tight elements)
- Standard spacing: p-4, p-6, gap-4 (general use)
- Section spacing: p-8, p-12, py-16 (major sections)
- Hero spacing: py-24 (landing areas)

**Grid System:**
- Main Layout: Split viewport design
  - Left: 3D Model viewer (70% width on desktop, full on mobile)
  - Right: Chat panel (30% width on desktop, slide-over on mobile)
- Max width containers: max-w-7xl for content sections
- Chat messages: Single column, full width with proper padding

**Responsive Breakpoints:**
- Mobile: Single column, full-screen 3D with slide-up chat
- Tablet (md): 60/40 split between model and chat
- Desktop (lg): 70/30 split with comfortable viewing
- Ultra-wide (xl): Maximum 1920px width, centered

## Component Library

### Navigation & Header
- Sticky top navigation with blur backdrop (backdrop-blur-md bg-black/70)
- Logo left, wallet connection right
- Subtle bottom border with yellow accent (border-b border-white/10)
- Mobile: Hamburger menu with slide-in drawer

### 3D Model Viewer Container
- Full-height dark canvas (bg-gradient-to-b from-black via-neutral-950 to-black)
- Subtle yellow glow around Max when speaking (box-shadow with yellow glow)
- Loading state: Animated skeleton with pulse effect
- Controls overlay: Minimal, bottom-right positioned

### Chat Interface
- Message Container: Scrollable, auto-scroll to latest
- User Messages: Right-aligned, dark gray bubbles (bg-neutral-800)
- AI Messages (Max): Left-aligned, pastel yellow bubbles (bg-[hsl(48,40%,25%)])
- Avatar indicators: Small circular icons (user vs Max)
- Input Field: Sticky bottom, black background with yellow focus ring
- Send Button: Pastel yellow with hover lift effect
- Timestamp: Muted text below messages (text-neutral-500)

### Action Buttons & CTAs
- Primary (Connect Wallet, Send): Pastel yellow background, black text, rounded-lg
- Secondary: Transparent with yellow border, yellow text
- Ghost: No background, yellow text on hover
- Icon buttons: p-2, hover:bg-white/5 transition

### Status Indicators
- Live Badge: Pulsing red dot with "LIVE" text (top-left of model viewer)
- AI Status: "Thinking...", "Speaking", "Listening" with animated dots
- Viewer Count: Yellow text with user icon
- Connection Status: Subtle indicator in header

### Cards & Panels
- Background: bg-neutral-900/50 with border-neutral-800
- Hover state: bg-neutral-900/80 transition
- Border radius: rounded-xl for cards, rounded-lg for smaller elements

### Forms & Inputs
- Text Input: Dark background (bg-neutral-900), yellow focus ring, white text
- Textarea (chat): Same styling, auto-resize
- Placeholder: text-neutral-500

### Overlays & Modals
- Backdrop: bg-black/60 backdrop-blur-sm
- Modal Container: bg-neutral-900 border border-neutral-800
- Close button: Top-right, hover:bg-white/10

## Animation Guidelines

**Use Sparingly - Only for:**
1. Max's speaking indicator: Subtle head bob or audio wave visualization
2. Chat message entry: Slide-up with fade (duration-200)
3. Button interactions: Scale and glow on hover (scale-105)
4. Live badge pulse: Continuous subtle pulse
5. AI status dots: Loading animation when processing

**Forbidden:**
- Excessive page transitions
- Distracting background animations
- Auto-playing effects unrelated to user actions

## Images & Media

**Hero/Header Area:**
No traditional hero image needed - the 3D model IS the hero element

**Supporting Visuals:**
- Max Avatar Icon: Circular crop from 3D model for chat bubbles
- BNB Chain Logo: Header/footer branding
- User Placeholder: Generic avatar for anonymous users
- Background Pattern: Optional subtle dot grid pattern (opacity: 0.03) for texture

**3D Model Display:**
- Centered in viewport with proper lighting (three-point lighting setup)
- Subtle rim light with pastel yellow tint
- Dark background with gradient for depth

## Special Considerations

**Real-time Feedback:**
- Visual typing indicators when Max is generating response
- Smooth scroll behavior in chat
- Instant visual feedback for all user actions

**Accessibility:**
- High contrast ratios (yellow on black exceeds WCAG AAA)
- Focus states with yellow outline
- Screen reader labels for all interactive elements
- Keyboard navigation support

**Performance:**
- Lazy load chat history
- Optimize 3D model rendering
- Debounce chat input
- Use CSS transforms for animations (GPU accelerated)

**Mobile Optimization:**
- Portrait mode: Stacked layout (3D top, chat bottom)
- Landscape mode: Side-by-side with smaller chat panel
- Touch-friendly tap targets (min 44px)
- Swipe gestures to toggle chat visibility