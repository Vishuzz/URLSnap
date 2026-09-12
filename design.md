# Design System & UI Specification — URLSnap (Calm Editorial SaaS Aesthetic)

This document defines the visual design system, color tokens, typography hierarchy, component specifications, and layout architecture for the **URLSnap** web application, inspired by high-end, calm, editorial SaaS interfaces (Verve / Linear style).

---

## 🎨 Design Philosophy & Aesthetic Guidelines

1. **Editorial Elegance meets High-Performance Utility**:
   - Replaces generic dark mode with a sophisticated dual-tone palette: a deep obsidian sunset top mesh gradient (`#0f0a15` ➔ `#241424` ➔ `#7a3b2e`) melting into a warm, serene cream background (`#faf7f2` / `#f3eee7`).
2. **Typography Pairing**:
   - **Headings**: Editorial serif with italics (`Playfair Display` / `Instrument Serif` style) for emotional resonance and calm authority.
   - **Body & Code**: Clean, crisp sans-serif (`Plus Jakarta Sans` / `Inter`) and monospace for URL data.
3. **Structured Bento Layout**:
   - Clear numbered steps (`01`, `02`, `03`), stat counters (`99.99%`, `< 5ms`, `10M+`), and editorial quote cards.
4. **Refined Micro-Interactions**:
   - Subtle copper/gold glow effects, smooth card hover lifts, glassmorphism borders, and instant interactive feedback.

---

## 🖌️ Color Palette & Tokens

### Primary Theme Colors

| Token Name | Hex Code | Visual Role |
|---|---|---|
| `--color-obsidian-950` | `#0d0814` | Hero Section Deep Background |
| `--color-sunset-800` | `#2d172b` | Hero Mid-Gradient Mesh |
| `--color-amber-burnt` | `#8c432d` | Sunset Accent Highlight |
| `--color-cream-100` | `#faf7f2` | Main Body Background (Calm Light Theme) |
| `--color-cream-200` | `#f2ebe1` | Card Surfaces & Bento Grids |
| `--color-cream-300` | `#e4d9ca` | Border Lines & Dividers |
| `--color-charcoal-900` | `#1c1917` | Primary Body Text & Headings |
| `--color-copper-500` | `#b45309` | Accent Badges & Italic Highlighting |

---

## 📐 Layout Architecture

```
+-----------------------------------------------------------------------------------+
|  [NAVBAR] Logo: URLSnap  ·  Features  ·  Architecture  ·  Docs     [Get Started]  |
+-----------------------------------------------------------------------------------+
|  [HERO SECTION - Deep Sunset Obsidian Mesh Gradient]                             |
|                                                                                   |
|           Give ambitious links a calmer, shorter way to move.                     |
|         Transform long, cluttered URLs into quiet, elegant short links            |
|                                                                                   |
|   +-------------------------------------------------------------+ +------------+  |
|   |  https://example.com/very-long-unhurried-destination-path   | | Shorten    |  |
|   +-------------------------------------------------------------+ +------------+  |
|                                                                                   |
|   [RESULT CARD - Floating Glassmorphic Sunset Card]                               |
|   Short URL: http://localhost:8080/cyJtnj   [Copy Link]  [QR Code]                 |
|                                                                                   |
|   [TRUSTED LOGO STRIP]  Northwind  ·  Lattice  ·  Halcyon  ·  Sable               |
+-----------------------------------------------------------------------------------+
|  [BENTO GRID 1 - Three Unhurried Steps from Scattered to In Flow]                 |
|   01 Bring your long URL     02 Instant Base62 Hash     03 Direct Quiet Redirect |
+-----------------------------------------------------------------------------------+
|  [METRICS & TESTIMONIAL BENTO]                                                    |
|   +-----------------------------------+ +-------------------------------------+  |
|   |  38%          2x          10M+    | | "URLSnap is the first shortener our |  |
|   |  Faster Load  Redirects   Links   | |  team actually kept. The noise      |  |
|   |                                   | |  dropped — work got clearer."       |  |
|   +-----------------------------------+ +-------------------------------------+  |
+-----------------------------------------------------------------------------------+
|  [FOOTER - Dark Sunset Banner]                                                    |
|  Bring a little more calm to how your URLs work.                                  |
+-----------------------------------------------------------------------------------+
```

---

## 🧱 Component Specifications

### 1. Header (`Navbar.tsx`)
- Minimalist brand mark (`URLSnap`) in serif text with obsidian/copper pill button.
- Real-time AWS API Health Status badge.

### 2. Hero & Shortener Card (`ShortenForm.tsx` & `ResultCard.tsx`)
- High-contrast input pill with integrated paste action.
- Glowing copper button with loading spinner.
- Result card featuring copy-to-clipboard, QR code download modal, and original URL reference.

### 3. Bento Grid Section (`BentoFeatures.tsx`)
- Step-by-step numbered breakdown (`01`, `02`, `03`) with editorial typography.
- Performance statistics & quote card.

### 4. Recent History Drawer (`HistoryList.tsx`)
- Warm cream card container displaying recently shortened links with quick copy buttons.

---

## 💻 Tech Implementation Stack

- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4 + Custom CSS Variables & Animations
- **Icons**: Lucide React
- **QR Engine**: `qrcode.react` (with PNG canvas export)
