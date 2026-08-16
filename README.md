# ✦ EDITIVE

### **Create. Edit. Unlock. Reframe.**

> A modern, beginner-friendly web image editor that combines professional editing tools, AI-powered image manipulation, and intelligent workflows for working with visual designs.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E" alt="Supabase" />
  <img src="https://img.shields.io/badge/MongoDB-001E2B?style=for-the-badge&logo=mongodb&logoColor=47A248" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-the-editive-difference">The EDITIVE Difference</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a>
</p>

---

## 🎨 Overview

EDITIVE is a browser-based image editor designed to make powerful visual editing easier to discover and use.

It combines the workflows users expect from a modern image editor with AI-assisted tools and three distinctive capabilities:

* **Unlock Design**
* **Smart Reframe**
* **Design Memory**

The core idea is simple:

> **You have the image. You need the design. EDITIVE bridges the gap.**

Unlike a traditional image editor that assumes you already have an editable source, EDITIVE is designed to work with the visual assets users already have — including flattened JPGs, PNGs, screenshots, posters, menus, social creatives, and other visual content.

---

# ✦ Why EDITIVE?

Modern visual editing often forces users into one of two workflows:

**Start from scratch**

or

**Find the original editable file.**

But in the real world, users frequently only have the final exported image.

Maybe the original Photoshop/Canva file is:

* lost
* unavailable
* inaccessible
* owned by someone else
* outdated
* simply never created

EDITIVE introduces a different workflow:

```text
Finished Image
      ↓
   EDITIVE
      ↓
Unlock / Edit / Enhance
      ↓
 Reframe / Restyle
      ↓
   Final Design
```

---

# 🚀 Features

## 🧱 Full Image Editor

EDITIVE provides a complete browser-based visual editing workspace.

### Canvas

* Blank canvas creation
* Custom dimensions
* Instagram Post
* Instagram Story / Reel
* YouTube Thumbnail
* LinkedIn Post
* Poster
* Grid
* Rulers
* Guides
* Safe margins
* Snap to grid
* Snap to objects
* Zoom
* Pan
* Fit to screen

### Selection & Transform

* Select
* Multi-select
* Move
* Resize
* Rotate
* Crop
* Flip horizontal / vertical
* Duplicate
* Delete
* Copy / Paste / Cut
* Lock / Unlock
* Exact positioning
* Precise dimensions
* Opacity

### Layers

* Layer ordering
* Rename layers
* Hide / Show
* Lock / Unlock
* Duplicate
* Delete
* Group / Ungroup
* Nested groups
* Opacity
* Layer-based editing

### Text

* Font selection
* Font size
* Weight
* Bold / Italic / Underline
* Alignment
* Letter spacing
* Line height
* Text color
* Text background
* Outline
* Shadow
* Rotation
* Editable text boxes

### Shapes

* Rectangle
* Rounded rectangle
* Circle
* Ellipse
* Triangle
* Star
* Polygon
* Line
* Arrow
* Fill
* Border
* Gradient
* Shadow
* Opacity

### Drawing

* Brush
* Pencil
* Marker
* Highlighter
* Eraser
* Stroke width
* Stroke color
* Opacity

### Image Editing

* Crop
* Resize
* Rotate
* Flip
* Masking
* Clipping
* Borders
* Corner radius
* Shadows
* Opacity
* Image replacement

### Adjustments

* Brightness
* Contrast
* Saturation
* Exposure
* Hue
* Temperature
* Tint
* Sharpen
* Blur
* Grayscale
* Sepia
* Invert
* Transparency

### Effects

* Shadow
* Glow
* Blur
* Inner Shadow
* Border
* Duotone

### Compositing

* Normal
* Multiply
* Screen
* Overlay
* Darken
* Lighten

---

# 🤖 AI Studio

AI tools are integrated directly into the editor instead of replacing the editor itself.

### Background

* Remove Background
* Blur Background

### Object Editing

* Remove Object
* Replace Object

### Quality

* Smart Enhance
* AI Upscale 2×

### Canvas

* AI Expand

### Text

* OCR / Extract Text

### Selection

* Smart Object Select

### Crop

* Smart Crop

AI operations are designed to work with the existing canvas and layer system.

---

# 🔓 Unlock Design

## **The core EDITIVE experience**

Ever received a JPG or PNG but didn't have the original editable design?

EDITIVE's **Unlock Design** workflow is designed around that exact problem.

```text
FLAT IMAGE
    ↓
ANALYZE
    ↓
DETECT
    ↓
REVIEW
    ↓
EDITABLE LAYERS
```

Where supported, EDITIVE can identify visual components such as:

* Text
* Image regions
* Shapes
* Logo-like elements
* Background

Those elements can then become part of the editable canvas.

### Manual Recovery

Automatic detection does not have to be perfect.

Users can manually select a region:

```text
Select Region
      ↓
Draw Region
      ↓
Convert to Layer
```

This keeps the workflow usable even when automatic reconstruction needs correction.

---

# 📐 Smart Reframe

## **One design. Multiple formats.**

Design once and adapt the composition to different formats.

Examples:

```text
Instagram Post
      ↓
Smart Reframe
      ↓
Instagram Story
```

Supported formats include:

* Instagram Post
* Instagram Story / Reel
* YouTube Thumbnail
* LinkedIn Post
* Poster
* Custom

Smart Reframe attempts to preserve:

* visual hierarchy
* important images
* subject placement
* CTA visibility
* composition

The result remains editable.

---

# 🧠 Design Memory

## **Save the look. Reuse the style.**

Design Memory allows a visual style to be saved and reused across designs.

It can preserve:

* Typography
* Color palette
* Spacing
* Borders
* Shadows
* CTA treatment
* Image treatment

Workflow:

```text
Design
  ↓
Save Style
  ↓
Design Memory
  ↓
New Design
  ↓
Apply Style
```

---

# 🖼️ PSD Support

EDITIVE is designed to support importing existing Photoshop projects where technically supported.

### PSD Import

Attempts to preserve:

* Canvas dimensions
* Supported layers
* Layer ordering
* Text
* Images
* Visibility
* Opacity
* Supported blend modes

Unsupported PSD features may be flattened or represented with reduced editability.

### PSD Export

Where supported, EDITIVE can export project structure into a PSD-compatible format while preserving supported layer information.

The application does not fake PSD support by simply renaming image files.

---

# 🧩 Start Your Way

EDITIVE does not force users into a predefined design.

Users can choose:

```text
Create Blank Canvas
        │
        ├── Open Project
        │
        ├── Upload Image
        │
        ├── Import PSD
        │
        └── Unlock Design
```

There is no automatically loaded fake/demo project.

---

# 🎯 Design Philosophy

EDITIVE is built around three principles:

### Simple to start

A beginner should be able to open the editor and understand what to do.

### Powerful underneath

Advanced controls remain available through contextual tools and organized panels.

### Different where it matters

The editor should not feel like another Photoshop clone or generic Canva clone.

The goal is:

> **Familiar enough to use. Different enough to remember.**

---

# 🛠️ Tech Stack

| Technology                 | Purpose                                               |
| -------------------------- | ----------------------------------------------------- |
| **Next.js**                | Application framework                                 |
| **React**                  | UI and editor architecture                            |
| **Canvas / Editor Engine** | Visual manipulation                                   |
| **Supabase**               | Storage, project data and supporting backend services |
| **MongoDB**                | Structured project/editor data                        |
| **AI APIs**                | Image processing and AI-assisted editing              |
| **Vercel**                 | Deployment                                            |
| **GitHub**                 | Version control and collaboration                     |

---

# 🏗️ Architecture

High-level architecture:

```text
                      EDITIVE
                         │
             ┌───────────┴───────────┐
             │                       │
         Web Editor              AI Studio
             │                       │
      ┌──────┼──────┐         ┌──────┼──────┐
      │      │      │         │      │      │
   Canvas  Layers  Tools    Images  OCR  Segmentation
      │      │      │
      └──────┴──────┘
             │
       Project State
             │
      ┌──────┴──────┐
      │             │
   Supabase      MongoDB
      │             │
      └──────┬──────┘
             │
           Vercel
```

---

# 📁 Project Structure

A simplified structure:

```text
editive/
│
├── app/
│   ├── editor/
│   ├── api/
│   │   └── ai/
│   └── ...
│
├── components/
│   ├── editor/
│   ├── canvas/
│   ├── layers/
│   ├── ai/
│   ├── panels/
│   └── ui/
│
├── lib/
│   ├── ai/
│   ├── canvas/
│   ├── database/
│   └── utils/
│
├── public/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# ⚙️ Getting Started

## 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/editive.git
cd editive
```

## 2. Install dependencies

```bash
npm install
```

## 3. Environment Variables

Create:

```text
.env.local
```

Example:

```env
REMOVE_BG_API_KEY=
CLIPDROP_API_KEY=
OCR_SPACE_API_KEY=
REPLICATE_API_TOKEN=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

MONGODB_URI=
```

### ⚠️ Security

Never commit real API keys.

Keep secrets inside:

```text
.env.local
```

and configure production secrets through Vercel Environment Variables.

---

# ▶️ Run Locally

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# ▲ Deployment

EDITIVE is designed for deployment on Vercel.

Typical workflow:

```text
GitHub
   ↓
Vercel
   ↓
Production
```

Configure required environment variables in the Vercel project settings before deployment.

---

# 🔐 Security

API credentials should always remain server-side.

Never expose provider secrets through:

* Client-side React code
* `NEXT_PUBLIC_*`
* Local storage
* Browser-accessible configuration
* GitHub
* README files

---

# 🏆 Built for Hackathon

EDITIVE was developed as a web-development hackathon project focused on combining:

**Image Editing**

*

**AI-assisted workflows**

*

**Visual reconstruction**

*

**Modern UX**

The project is designed to demonstrate that an image editor can go beyond simply manipulating pixels.

---

# 💡 The Idea

Traditional editors usually ask:

> **What do you want to create?**

EDITIVE also asks:

> **What do you already have?**

Because sometimes the hardest part isn't creating a design.

It's getting control back over one that already exists.

---

# 📌 Project Status

🚧 **Active Development**

EDITIVE is currently being developed and refined.

Some advanced functionality may vary depending on browser capabilities and third-party API availability.

---

# 🤝 Contributing

This project is primarily being developed as a hackathon project.

Suggestions, feedback, and improvements are welcome.

---

# 📄 License

MIT License.

---

<p align="center">

### **EDITIVE**

**Create. Edit. Unlock. Reframe.**

Built with ❤️ for the next generation of visual creators.

</p>
