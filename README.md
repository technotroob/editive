# EDITIVE — Web-Based Professional Image Editor

> **Start with an existing visual and make it editable again.**

EDITIVE is a modern browser-based image editor combining professional creative tool ergonomics with intelligent workflows for unlocking, reconstructing, restyling, and reframing visual designs.

---

## 🚀 Key Differentiating Features

### 1. 🪄 Unlock Design (Hero Differentiator)
* Upload any flattened JPG/PNG (posters, social media ads, screenshots, restaurant menus).
* Automatic semantic decomposition into editable layers (Headline, Subtitle, Product/Subject, Price Badge, CTA Button, Background).
* Interactive **Before ↔ After Comparison Slider**.
* Reliable manual fallback: **Select Region → Convert to Layer**.

### 2. 🪄 Design Memory
* Extract typography hierarchy, 5-color harmonious palettes, shadow profiles, border styling, and CTA treatment from an existing design.
* Preview in visual style cards.
* 1-click **Apply Style** across designs while preserving content.

### 3. 📐 Smart Reframe
* Intelligently adapt compositions between aspect ratios (Instagram 1:1, Story 9:16, YouTube 16:9, LinkedIn 1.91:1, Poster 4:5).
* Preserves main subject focus, scales headlines, and reflows layouts harmoniously.

### 4. 🌳 Design Structure View
* High-level structural composition tree (`BACKGROUND ↓ MAIN SUBJECT ↓ HEADLINE ↓ PRICE ↓ CTA ↓ LOGO`) complementing the standard granular Layers panel.

### 5. ⚡ AI Studio (10 Action-Based Utility Tools)
* Non-blocking action tools with live progress percentage indicators:
  1. Remove Background
  2. Remove Object
  3. Replace Object
  4. AI Expand
  5. AI Upscale (2X Super-Resolution)
  6. Smart Enhance
  7. AI Blur Background (Optical Bokeh)
  8. OCR / Extract Text
  9. Smart Object Select
  10. Smart Crop

---

## 🛠️ Complete Core Editor Capabilities

* **Canvas Engine**: Pan, Zoom (10% to 500%), Preset formats, Custom dimensions, Background color & Transparency.
* **Selection & Transforms**: 8 resize handles, rotation handle with 15° shift snapping, numerical $X, Y, W, H, \theta$ controls, Smart Alignment Guides.
* **Layer System**: Reordering, Visibility toggle, Locking, Opacity, Duplication, Deletion, Confidence badges on reconstructed layers.
* **Typography**: Multi-line wrapping, Google font pairings (Outfit, Inter, Roboto, Playfair Display, Montserrat, etc.), Weight, Spacing, Line height, Alignment, Text shadow, Stroke outline.
* **Vector Shapes**: Rectangle, Rounded Rectangle, Circle, Ellipse, Triangle, Star, Polygon, Line, Arrow.
* **Freehand Drawing**: Brush, Pencil, Highlighter, Eraser with smooth quadratic curve rendering.
* **Non-destructive Adjustments**: Brightness, Contrast, Saturation, Exposure, Hue, Temperature, Tint, Blur, Sharpen, Grayscale, Sepia, Invert with real-time sliders and Reset All.
* **Effects**: Drop Shadow, Glow, Inner Shadow, Border, Duotone.
* **History Manager**: Deep state snapshot Undo/Redo (`Ctrl+Z`, `Ctrl+Y`) for all operations.
* **Multi-Format Export**: High-resolution PNG, JPG, WebP, and Transparent PNG.

---

## 💻 Tech Stack & Deployment

* **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
* **Design System**: Vanilla CSS design tokens with Dark Studio Theme
* **Iconography**: Lucide React
* **Persistence**: LocalStorage / IndexedDB with Supabase and MongoDB sync compatibility
* **Deployment**: Optimized for zero-config deployment on **Vercel**

---

## 🏃 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

### Production Build Verification

```bash
npm run build
npm run start
```

---

## 🌟 Demo Walkthrough for Judges

1. **Open Dashboard**: Click on any of the pre-loaded demo project showcases or click **New Canvas**.
2. **Unlock Design**: Click **Unlock Design** in the Top Bar → Choose one of the 1-click Demo Presets or upload a flat JPG/PNG → Inspect the semantic decomposition analysis → Slide the **Before ↔ After Slider** → Click **Reconstruct to Canvas**.
3. **Edit Reconstructed Elements**: Select the headline to modify text, change colors, adjust opacity, and reposition the product subject.
4. **Smart Reframe**: Click **Smart Reframe** → Select **9:16 Instagram Story** → Observe automatic layout reflow → Commit.
5. **Design Memory**: Click **Design Memory** → Save or apply a saved visual style across compositions.
6. **AI Studio**: Select the image layer → Open **AI Studio** → Run **Smart Enhance** or **Remove Background** with live progress feedback.
7. **Export**: Click **Export** → Download a crisp, high-res PNG / WebP graphic.
