// ===================================
// State Management
// ===================================
let allBookmarks = [];
let filteredBookmarks = [];
let currentSearchQuery = '';
let currentCategory = '';
let currentSort = 'date-desc';

// ===================================
// DOM Elements
// ===================================
const elements = {
    searchInput: document.getElementById('search-input'),
    categoryFilter: document.getElementById('category-filter'),
    sortSelect: document.getElementById('sort-select'),
    bookmarksContainer: document.getElementById('bookmarks-container'),
    bookmarkCount: document.getElementById('bookmark-count'),
    themeToggle: document.getElementById('theme-toggle')
};

// ===================================
// Theme Management
// ===================================
function initTheme() {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const icon = elements.themeToggle.querySelector('.theme-icon');
    icon.textContent = isDark ? '☀️' : '🌙';
}

// ===================================
// Data Loading
// ===================================
async function loadBookmarks() {
    try {
        const response = await fetch('bookmarks.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allBookmarks = await response.json();

        // Sort by date initially (newest first)
        sortBookmarks('date-desc');

        // Populate category filter
        populateCategoryFilter();

        // Initial render
        filterAndRenderBookmarks();
    } catch (error) {
        console.error('Error loading bookmarks:', error);
        elements.bookmarksContainer.innerHTML = `
            <div class="no-results">
                Failed to load bookmarks. Please check that bookmarks.json exists.
            </div>
        `;
    }
}

// ===================================
// Category Filter Population
// ===================================
function populateCategoryFilter() {
    // Get all unique categories
    const categories = new Set();
    allBookmarks.forEach(bookmark => {
        bookmark.categories.forEach(category => categories.add(category));
    });

    // Sort categories alphabetically
    const sortedCategories = Array.from(categories).sort();

    // Populate dropdown
    elements.categoryFilter.innerHTML = '<option value="">All Categories</option>';
    sortedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        elements.categoryFilter.appendChild(option);
    });
}

// ===================================
// Search and Filter
// ===================================
function filterAndRenderBookmarks() {
    // Start with all bookmarks
    filteredBookmarks = allBookmarks.filter(bookmark => {
        // Category filter
        if (currentCategory && !bookmark.categories.includes(currentCategory)) {
            return false;
        }

        // Search filter
        if (currentSearchQuery) {
            const query = currentSearchQuery.toLowerCase();
            const searchableText = [
                bookmark.title,
                bookmark.description,
                bookmark.url,
                bookmark.notes || '',
                ...bookmark.categories
            ].join(' ').toLowerCase();

            return searchableText.includes(query);
        }

        return true;
    });

    // Apply current sort
    applySorting();

    // Render
    renderBookmarks();
}

// ===================================
// Sorting
// ===================================
function sortBookmarks(sortType) {
    currentSort = sortType;
    applySorting();
}

function applySorting() {
    switch (currentSort) {
        case 'date-desc':
            filteredBookmarks.sort((a, b) =>
                new Date(b.dateAdded) - new Date(a.dateAdded)
            );
            break;
        case 'date-asc':
            filteredBookmarks.sort((a, b) =>
                new Date(a.dateAdded) - new Date(b.dateAdded)
            );
            break;
        case 'title-asc':
            filteredBookmarks.sort((a, b) =>
                a.title.localeCompare(b.title)
            );
            break;
        case 'title-desc':
            filteredBookmarks.sort((a, b) =>
                b.title.localeCompare(a.title)
            );
            break;
    }
}

// ===================================
// Rendering
// ===================================
function renderBookmarks() {
    // Update count
    const total = allBookmarks.length;
    const filtered = filteredBookmarks.length;
    elements.bookmarkCount.textContent =
        filtered === total
            ? `Showing all ${total} bookmarks`
            : `Showing ${filtered} of ${total} bookmarks`;

    // Render bookmarks
    if (filteredBookmarks.length === 0) {
        elements.bookmarksContainer.innerHTML = `
            <div class="no-results">
                No bookmarks found. Try adjusting your search or filters.
            </div>
        `;
        return;
    }

    elements.bookmarksContainer.innerHTML = filteredBookmarks
        .map(bookmark => createBookmarkCard(bookmark))
        .join('');
}

function createBookmarkCard(bookmark) {
    const faviconHtml = bookmark.favicon
        ? `<img src="${escapeHtml(bookmark.favicon)}"
                alt=""
                class="bookmark-favicon"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="bookmark-favicon-placeholder" style="display:none;">
               ${escapeHtml(bookmark.title.charAt(0).toUpperCase())}
           </div>`
        : `<div class="bookmark-favicon-placeholder">
               ${escapeHtml(bookmark.title.charAt(0).toUpperCase())}
           </div>`;

    const tagsHtml = bookmark.categories
        .map(cat => `<span class="bookmark-tag">${escapeHtml(cat)}</span>`)
        .join('');

    const notesHtml = bookmark.notes
        ? `<div class="bookmark-notes">📝 ${escapeHtml(bookmark.notes)}</div>`
        : '';

    const formattedDate = formatDate(bookmark.dateAdded);

    return `
        <div class="bookmark-card">
            <div class="bookmark-header">
                ${faviconHtml}
                <div class="bookmark-title">
                    <a href="${escapeHtml(bookmark.url)}"
                       target="_blank"
                       rel="noopener noreferrer">
                        ${escapeHtml(bookmark.title)}
                    </a>
                    <div class="bookmark-url">${escapeHtml(truncateUrl(bookmark.url))}</div>
                </div>
            </div>
            <div class="bookmark-description">
                ${escapeHtml(bookmark.description)}
            </div>
            <div class="bookmark-tags">
                ${tagsHtml}
            </div>
            <div class="bookmark-date">
                Added: ${formattedDate}
            </div>
            ${notesHtml}
        </div>
    `;
}

// ===================================
// Utility Functions
// ===================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function truncateUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname + urlObj.pathname;
    } catch {
        return url;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ===================================
// Event Listeners
// ===================================
function initEventListeners() {
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Search with debounce
    let searchTimeout;
    elements.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentSearchQuery = e.target.value.trim();
            filterAndRenderBookmarks();
        }, 300);
    });

    // Category filter
    elements.categoryFilter.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        filterAndRenderBookmarks();
    });

    // Sort
    elements.sortSelect.addEventListener('change', (e) => {
        sortBookmarks(e.target.value);
        renderBookmarks();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            elements.searchInput.focus();
        }

        // Ctrl/Cmd + D to toggle theme
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

// ===================================
// Initialization
// ===================================
function init() {
    initTheme();
    initEventListeners();
    loadBookmarks();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
