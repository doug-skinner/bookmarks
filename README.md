# 🔖 Bookmark Manager

A modern, fast, and beautiful bookmark manager built as a static site for GitHub Pages. No backend required!

**Live Site:** [https://dsknr.com/bookmarks/](https://dsknr.com/bookmarks/)

## ✨ Features

- **🔍 Real-time Search** - Search across titles, descriptions, URLs, and tags as you type
- **🏷️ Category Filtering** - Filter bookmarks by category/tag
- **📊 Multiple Sort Options** - Sort by date added or alphabetically
- **🌓 Dark Mode** - Automatic system preference detection with manual toggle
- **📱 Fully Responsive** - Works beautifully on desktop, tablet, and mobile
- **⚡ Fast & Lightweight** - Pure vanilla JavaScript, no heavy frameworks
- **⌨️ Keyboard Shortcuts** - Quick access to search and theme toggle
- **🎨 Modern Design** - Clean, accessible interface with smooth animations

## 🚀 Quick Start

### Viewing the Site

1. Clone this repository
2. Open `index.html` in your browser, or
3. Serve it locally:
   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # Using PHP
   php -S localhost:8000

   # Using Node.js http-server
   npx http-server
   ```
4. Visit `http://localhost:8000`

### Deploying to GitHub Pages

1. Push this repository to GitHub
2. Go to repository **Settings** → **Pages**
3. Under "Source", select the branch (usually `main`) and `/root` folder
4. Click **Save**
5. Your site will be live at `https://yourusername.github.io/bookmarks/`

## 📝 Adding New Bookmarks

### Method 1: Edit JSON Directly

1. Open `bookmarks.json` in your editor
2. Add a new bookmark object following this structure:

```json
{
  "id": 16,
  "title": "Example Site",
  "url": "https://example.com",
  "description": "A brief description of what this site is about",
  "categories": ["Category1", "Category2"],
  "dateAdded": "2025-01-15",
  "favicon": "https://example.com/favicon.ico",
  "notes": "Optional personal notes"
}
```

### Field Descriptions

| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ Yes | Unique identifier (increment from last bookmark) |
| `title` | ✅ Yes | Name of the bookmark |
| `url` | ✅ Yes | Full URL including `https://` |
| `description` | ✅ Yes | What the site is about |
| `categories` | ✅ Yes | Array of categories/tags |
| `dateAdded` | ✅ Yes | Date in `YYYY-MM-DD` format |
| `favicon` | ❌ No | URL to favicon (displays first letter if missing) |
| `notes` | ❌ No | Personal notes about the bookmark |

### Method 2: Quick Add Script

Create a script to quickly add bookmarks:

```bash
#!/bin/bash
# save as add-bookmark.sh

# Get bookmark details
echo "Title: "
read title
echo "URL: "
read url
echo "Description: "
read description
echo "Categories (comma-separated): "
read categories
echo "Notes (optional): "
read notes

# Get current date
date=$(date +%Y-%m-%d)

# Get next ID (requires jq)
next_id=$(jq '[.[] | .id] | max + 1' bookmarks.json)

# Create new bookmark
new_bookmark=$(cat <<EOF
{
  "id": $next_id,
  "title": "$title",
  "url": "$url",
  "description": "$description",
  "categories": [$(echo $categories | sed 's/,/", "/g' | sed 's/^/"/' | sed 's/$/"/')],
  "dateAdded": "$date",
  "notes": "$notes"
}
EOF
)

# Add to bookmarks.json
jq ". += [$new_bookmark]" bookmarks.json > temp.json && mv temp.json bookmarks.json

echo "✅ Bookmark added successfully!"
```

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + K` - Focus search input
- `Ctrl/Cmd + D` - Toggle dark/light mode
- `Esc` - Clear search (when focused)

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `css/styles.css`:

```css
:root {
    --accent: #0d6efd;        /* Primary accent color */
    --accent-hover: #0a58ca;   /* Hover state */
    /* ... more variables ... */
}
```

### Modifying Categories

Categories are automatically generated from your `bookmarks.json` file. Just add categories to your bookmarks and they'll appear in the filter dropdown.

### Changing the Title

Edit the `<h1>` tag in `index.html`:

```html
<h1>🔖 My Bookmarks</h1>
```

## 📁 Project Structure

```
bookmarks/
├── index.html           # Main HTML file
├── bookmarks.json       # Bookmark data
├── css/
│   └── styles.css       # All styles and themes
├── js/
│   └── app.js          # Application logic
└── README.md           # This file
```

## 🔧 Technical Details

### Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance

- **First Load:** < 100ms (with local server)
- **Search Response:** Real-time with 300ms debounce
- **Bundle Size:** ~15KB total (HTML + CSS + JS)

### Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - No frameworks, just modern ES6+
- **JSON** - Simple data storage

## 🐛 Troubleshooting

### Bookmarks not loading

- Check browser console for errors
- Ensure `bookmarks.json` is valid JSON (use [JSONLint](https://jsonlint.com/))
- Make sure you're serving the site via HTTP (not `file://`)

### Dark mode not persisting

- Check if localStorage is enabled in your browser
- Try clearing browser cache

### Search not working

- Ensure JavaScript is enabled
- Check console for errors
- Try clearing browser cache

## 📄 License

MIT License - feel free to use this project however you like!

## 🤝 Contributing

This is a personal bookmark manager, but feel free to fork and customize for your own use!

## 💡 Tips

1. **Regular Backups:** Keep a backup of your `bookmarks.json` file
2. **Favicon URLs:** Use full URLs for favicons (many sites have them at `/favicon.ico`)
3. **Categories:** Keep category names consistent (use "Development" not sometimes "Dev")
4. **Descriptions:** Write clear descriptions to make searching easier
5. **Git History:** Commit changes to track your bookmark history

## 🚀 Future Enhancements (Optional)

- Import/Export functionality
- Browser bookmark import
- Tags cloud visualization
- Archive/favorite system
- Statistics dashboard
- PWA support for offline access

---

Made with 💙 for organizing the web, one bookmark at a time.
