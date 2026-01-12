# Happy Birthday Dad! 🎉

A beautiful, interactive, and mobile-responsive birthday website to celebrate your dad's special day!

## Features

✨ **Interactive Elements:**
- Animated confetti on button click
- Floating cake with flickering candle
- Scroll animations for smooth reveal
- Image gallery with modal view
- Sparkle effects on click
- Floating balloons on page load

📱 **Mobile Responsive:**
- Fully optimized for all screen sizes
- Touch-friendly interactions
- Beautiful layout on phones and tablets

🎨 **Beautiful Design:**
- Modern gradient backgrounds
- Smooth animations and transitions
- Elegant typography
- Colorful, celebratory theme

## How to Add Your Images

1. **Prepare your images:**
   - Resize them to be square or similar aspect ratios (recommended: 800x800px or larger)
   - Save them in a folder (e.g., `images/`)

2. **Add images to the gallery:**
   - Open `index.html`
   - Find the gallery section (around line 80-110)
   - Replace the placeholder divs with `<img>` tags
   
   **Example:**
   ```html
   <!-- Replace this: -->
   <div class="image-placeholder">
       <span>Add Photo 1</span>
   </div>
   
   <!-- With this: -->
   <img src="images/photo1.jpg" alt="Memory 1" class="gallery-image">
   ```

3. **Add as many photos as you want!**
   - You can add more gallery items by copying the gallery-item structure
   - The grid will automatically adjust

## Customization

### Change the Birthday Message
Edit the text in the `.message-content` section in `index.html` (around line 60)

### Change Colors
Edit the CSS variables in `style.css` at the top:
```css
:root {
    --primary-color: #ff6b6b;
    --secondary-color: #4ecdc4;
    --accent-color: #ffe66d;
    /* ... */
}
```

### Add More Sections
You can easily add more sections by copying the structure of existing sections!

## How to View

1. Simply open `index.html` in your web browser
2. Or use a local server:
   - Python: `python -m http.server 8000`
   - Node.js: `npx serve`
   - Then visit `http://localhost:8000`

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers

Enjoy celebrating your dad's birthday! 🎉🎈🎊
