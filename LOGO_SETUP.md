# 🎨 Logo Setup Guide - Navbar

## 📍 Where to Put Your Logo

### Primary Location
```
iaas-web/
└── public/
    ├── logo.svg    ← Recommended (scalable)
    └── logo.png    ← Fallback
```

---

## ✅ Logo Configuration

The navbar automatically looks for your logo in this order:

1. **`/logo.svg`** - SVG format (preferred)
2. **`/logo.png`** - PNG fallback
3. **Icon** - BusinessIcon if no logo files found

---

## 🚀 Quick Setup

### Step 1: Prepare Your Logo

**Recommended Format: SVG**
- Scalable to any size
- Crisp on all displays
- Small file size

**Alternative: PNG**
- Transparent background
- High resolution (at least 200px height)
- Optimized for web

### Step 2: Copy Logo to Public Folder

```bash
# Navigate to your project
cd iaas-web

# Copy your logo (SVG preferred)
cp /path/to/your/logo.svg public/

# Or PNG
cp /path/to/your/logo.png public/

# Or both for maximum compatibility
cp /path/to/your/logo.svg public/
cp /path/to/your/logo.png public/
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

### Step 4: Verify

Open `http://localhost:5173` and check the navbar - your logo should appear!

---

## 📐 Logo Size Guidelines

### Optimal Dimensions

**SVG (Recommended)**
- Any size (scalable)
- Aspect ratio: Horizontal or square works best
- Navbar height: 40px (auto-width)
- Max width: 150px

**PNG**
- Height: 200-400px (will scale down)
- Width: Proportional to height
- Transparent background
- Format: PNG-24 with alpha

### Aspect Ratios

```
✅ Good:
- Horizontal: 3:1, 2:1, 16:9
- Square: 1:1
- Slight vertical: 4:5

❌ Avoid:
- Very tall/vertical logos (2:3, 1:2)
- Very wide logos (4:1, 5:1)
```

---

## 🎨 Design Recommendations

### Color

1. **Single Color Logo**
   - Use your brand color
   - Will display well on white navbar

2. **Multi-Color Logo**
   - Full color version works
   - Ensure good contrast with white background

3. **Dark Mode Consideration**
   - Provide logo with good contrast
   - Consider adding dark mode variant later

### Style

```
✅ Works Well:
- Horizontal logos (company name + icon)
- Wordmarks (company name only)
- Icon + text combination
- Simple, clean designs

❌ Problematic:
- Very complex designs (too many details)
- Thin lines (may not be visible at small size)
- Text that's too small to read
```

---

## 🛠️ Creating Your Logo

### Online Logo Makers (Free)

1. **[Canva](https://www.canva.com/)**
   - Free templates
   - Easy to use
   - Export as PNG or SVG

2. **[Looka](https://looka.com/)**
   - AI-powered
   - Professional designs
   - Free preview

3. **[Hatchful by Shopify](https://www.shopify.com/tools/logo-maker)**
   - Completely free
   - Quick generation
   - Download PNG/SVG

### Design Tools

**Vector (SVG)**
- Adobe Illustrator
- Figma (free)
- Inkscape (free, open-source)
- Affinity Designer

**Raster (PNG)**
- Adobe Photoshop
- GIMP (free, open-source)
- Canva (free)

---

## 📋 Logo Formats Comparison

| Format | Size | Quality | Transparency | Best For |
|--------|------|---------|--------------|----------|
| **SVG** | Small | Perfect at any size | Yes | Modern browsers, scalable |
| **PNG** | Medium | Good | Yes | Fallback, compatibility |
| **JPG** | Small | Good | No | ❌ Not recommended |
| **WebP** | Small | Excellent | Yes | Modern only |

**Recommendation**: Use **SVG** with **PNG** fallback

---

## 🎯 For IAAS Project

### Logo Suggestions

1. **Text-based**
   ```
   IAAS
   Infrastructure Asset Analysis System
   ```

2. **Icon + Text**
   ```
   [Pipeline Icon] IAAS
   [Network Icon] IAAS
   [Infrastructure Icon] IAAS
   ```

3. **Industry Symbols**
   - Oil pipeline
   - Network diagram
   - Infrastructure grid
   - Industrial facility

### Color Scheme

Based on your theme (`#1976d2` primary):

```css
Primary: #1976d2 (Blue)
Secondary: #424242 (Dark Gray)
Accent: #ff9800 (Orange)
```

---

## 🧪 Testing Your Logo

### Checklist

- [ ] Logo visible in navbar
- [ ] Proper size (not too big/small)
- [ ] Clear and readable
- [ ] Good contrast with white background
- [ ] Looks good on desktop
- [ ] Looks good on mobile
- [ ] Transparent background (no white box)
- [ ] Loads quickly

### Test Browsers

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

### Test Devices

- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px)

---

## 🔧 Customization

### Change Logo Size

Edit `src/shared/components/Layout/Navbar.tsx`:

```typescript
<Box
  component="img"
  src="/logo.svg"
  sx={{
    height: 50,        // Change this (default: 40)
    maxWidth: 200,     // Change this (default: 150)
  }}
/>
```

### Logo-Only (No Text)

If your logo includes text, hide the app name:

```typescript
{/* Comment out or remove */}
{/* <Typography variant="h6">{t('app.name')}</Typography> */}
```

### Add Link to Home

Make logo clickable:

```typescript
<Box 
  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
  onClick={() => navigate('/')}
>
  <Box component="img" src="/logo.svg" ... />
</Box>
```

---

## 🐛 Troubleshooting

### Logo not showing

**Check 1: File exists**
```bash
ls -la public/logo.svg
ls -la public/logo.png
```

**Check 2: File accessible**
```bash
# Dev server running, check:
curl http://localhost:5173/logo.svg
```

**Check 3: Console errors**
```
Open DevTools (F12) → Console
Look for 404 errors or loading issues
```

**Solution**: Restart dev server
```bash
# Ctrl+C to stop
npm run dev
```

### Logo too big/small

**Solution**: Adjust size in Navbar.tsx
```typescript
sx={{
  height: 40,      // Increase/decrease
  maxWidth: 150,   // Increase/decrease
}}
```

### Logo has white background

**Problem**: PNG without transparency

**Solution**:
1. Open in image editor (Photoshop, GIMP, etc.)
2. Remove background
3. Save as PNG-24 with transparency
4. Or use online tool: [Remove.bg](https://www.remove.bg/)

### Logo blurry

**Problem**: PNG too small or low quality

**Solution**:
1. Use SVG instead (always crisp)
2. Or use higher resolution PNG (2x-3x display size)

---

## 📁 File Structure

```
iaas-web/
├── public/
│   ├── logo.svg              ✅ Primary logo (SVG)
│   ├── logo.png              ✅ Fallback logo (PNG)
│   ├── logo-dark.svg         ⭐ Optional (dark mode)
│   ├── logo-dark.png         ⭐ Optional (dark mode)
│   └── ...
├── src/
│   └── shared/
│       └── components/
│           └── Layout/
│               └── Navbar.tsx  ✅ Logo component
└── ...
```

---

## 🎨 Example Logos

### Text-Only Logo (SVG)

```svg
<svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
  <text x="0" y="30" font-family="Arial, sans-serif" font-size="32" 
        font-weight="bold" fill="#1976d2">IAAS</text>
</svg>
```

Save as `public/logo.svg`

### Simple Icon + Text

Use Canva or Figma to create:
1. Add icon (pipeline, network, etc.)
2. Add text "IAAS"
3. Export as SVG
4. Save to `public/logo.svg`

---

## ✅ Quick Checklist

- [ ] Create or get your logo file
- [ ] Convert to SVG or PNG with transparency
- [ ] Copy to `public/logo.svg` (or `logo.png`)
- [ ] Restart dev server
- [ ] Check navbar - logo should appear
- [ ] Test on different screen sizes
- [ ] Verify logo is clear and readable
- [ ] Check file size (< 100KB recommended)

---

## 🔗 Resources

- [Canva Logo Maker](https://www.canva.com/create/logos/)
- [Looka AI Logo Generator](https://looka.com/)
- [Remove Background Tool](https://www.remove.bg/)
- [SVG Optimizer](https://jakearchibald.github.io/svgomg/)
- [TinyPNG - Image Compressor](https://tinypng.com/)

---

**Updated**: December 27, 2025  
**Author**: CHOUABBIA Amine  
**Component**: Navbar Logo
