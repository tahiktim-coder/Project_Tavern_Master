# Mobile UI Redesign - Implementation Plan

## 1. Overview

Complete redesign of the legacy version (`index.html`) to a mobile-first interface based on user mockups. This redesign transforms the Canvas-based UI into a modern DOM-based mobile experience while preserving all existing game logic.

## 2. Design Specifications

### Layout Architecture

**Viewport**: Mobile-first vertical layout (360-414px optimal width)

**Component Hierarchy**:
```
┌─────────────────────────────┐
│  Header Bar                 │ ← Guild Roster | Crown | Gold
├─────────────────────────────┤
│  Character Card             │ ← Portrait + Traits + Quote
├─────────────────────────────┤
│  Contracts Section          │ ← 3-6 Quest Cards
├─────────────────────────────┤
│  Action Button              │ ← End Day (Red)
├─────────────────────────────┤
│  Decision Buttons           │ ← Hire (Green) | Dismiss (Grey)
└─────────────────────────────┘
```

### Visual Theme
- **Color Palette**: Dark brown/black background, gold accents, parchment overlays
- **Typography**: Medieval serif for headers (MedievalSharp), clean sans-serif for body
- **Aesthetic**: Dark fantasy guild management, tactile card-based UI

## 3. Technical Approach

### Phase 1: DOM Structure Migration
**Goal**: Replace Canvas rendering with DOM elements

**Changes**:
1. **Remove**: `<canvas id="game-canvas">` and `Renderer.js` system
2. **Add**: Structured HTML components in `index.html`
3. **Keep**: All logic files (`adventurerGenerator.js`, `questData.js`, etc.)

**New HTML Structure**:
```html
<div id="mobile-app">
  <header id="top-bar">...</header>
  <main id="game-stage">
    <section id="character-card">...</section>
    <section id="contracts-grid">...</section>
  </main>
  <footer id="action-bar">...</footer>
</div>
```

### Phase 2: Character Card Component
**Visual Reference**: Screenshot 5

**Elements**:
- **Portrait**: Left side, fixed aspect ratio (square or portrait)
- **Info Panel**: Right side with:
  - Trait tags (pill-shaped buttons)
  - Character quote (italic, centered)
- **Name/Title**: Overlay or below portrait

**Click Behavior**: Opens Dossier Overlay (Screenshot 1)

### Phase 3: Contracts Grid
**Visual Reference**: Screenshots 2, 3

**Card Structure**:
```
┌──────────────────┐
│ QUEST TITLE      │ 60 G
│ Req: STR         │
└──────────────────┘
```

**Layout**: Vertical stack or 2-column grid (responsive)

**Click Behavior**: Opens Contract Detail Overlay (Screenshot 4)

### Phase 4: Overlay System

**A. Character Dossier** (Screenshot 1)
- Full-screen modal with parchment background
- Sections: Origin, Attributes, Equipment, Service Record
- Close button (X) top-right
- "Recruit to Table First" button (if applicable)

**B. Contract Detail** (Screenshot 4)
- Modal with dark background
- Shows: Quest name, flavor text, required stats, reward
- Close button (X)

### Phase 5: Interaction Logic

**Flow**:
1. Character appears on card
2. User can:
   - Click character → View dossier
   - Click quest → View quest details
   - Drag quest onto character (future enhancement) OR select quest then tap "Hire"
   - Tap "Dismiss" → Next character
3. "End Day" → Process all assigned quests

## 4. File Modifications

### Core Files to Modify
1. **`index.html`** - Complete restructure from Canvas to DOM
2. **`style.css`** - Rewrite for mobile-first, component-based styling
3. **`script.js`** - Update to manipulate DOM instead of Canvas context

### Files to Keep (Logic)
- `js/data/traitData.js`
- `js/data/questData.js`
- `js/models/Adventurer.js`
- `src/generators/adventurerGenerator.js`
- All systems (`Economy.js`, `Resolution.js`, etc.)

### New Files to Create
1. **`js/ui/MobileRenderer.js`** - DOM manipulation controller
2. **`js/ui/OverlayManager.js`** - Handles modal overlays
3. **`css/mobile.css`** - Mobile-specific styling
4. **`css/components.css`** - Reusable component styles

## 5. Implementation Phases

### ✅ Phase 1: Foundation (Target: 1-2 hours)
- [ ] Backup current `index.html` as `index.old.html`
- [ ] Create new DOM structure in `index.html`
- [ ] Set up basic CSS grid layout
- [ ] Test: Page loads, shows header/footer

### 🔨 Phase 2: Character Card (Target: 1 hour)
- [ ] Implement character card HTML
- [ ] Style portrait + info panel
- [ ] Connect to `AdventurerGenerator`
- [ ] Test: Character data displays correctly

### 🔨 Phase 3: Contracts Grid (Target: 1 hour)
- [ ] Implement quest card HTML template
- [ ] Dynamically generate 3-6 cards from `questData`
- [ ] Style cards to match mockup
- [ ] Test: Quests load and display

### 🔨 Phase 4: Overlays (Target: 2 hours)
- [ ] Create Dossier overlay HTML
- [ ] Create Contract overlay HTML
- [ ] Implement show/hide logic
- [ ] Style overlays (parchment background, etc.)
- [ ] Test: Click interactions work

### 🔨 Phase 5: Game Logic Integration (Target: 2 hours)
- [ ] Wire "Hire" button to recruitment logic
- [ ] Wire "Dismiss" to next adventurer
- [ ] Wire "End Day" to resolution system
- [ ] Test: Full game loop works

## 6. Success Criteria

**Visual**:
- [ ] Matches user mockup aesthetic
- [ ] Responsive on mobile (320-414px width)
- [ ] Smooth transitions and overlays

**Functional**:
- [ ] All existing game logic preserved
- [ ] Character generation works
- [ ] Quest assignment works
- [ ] Day progression works
- [ ] No regressions in core gameplay

## 7. Next Steps

Once approved, begin with **Phase 1: Foundation** by creating the new HTML structure.
