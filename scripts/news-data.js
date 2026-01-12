/**
 * Shared utility for fetching and filtering news articles
 * @param {Object} filterOptions - Options for filtering articles
 * @param {boolean} filterOptions.featured - Filter for featured articles only
 * @param {number} filterOptions.limit - Limit the number of articles returned
 * @param {string} filterOptions.sortBy - Sort field (e.g., 'releaseDate')
 * @param {string} filterOptions.category - Filter by category
 * @param {string} filterOptions.tag - Filter by tag
 * @param {Array<string>} filterOptions.excludePaths - Array of article paths to exclude
 * @returns {Promise<Array>} Array of article objects
 */
export async function fetchNewsArticles(filterOptions = {}) {
  try {
    const response = await fetch('/news/query-index.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    const data = await response.json();
    let articles = data.data || [];

    // Apply filters
    if (filterOptions.featured) {
      articles = articles.filter((article) => article.feature === 'true');
    }

    if (filterOptions.category) {
      articles = articles.filter((article) => article.category === filterOptions.category);
    }

    if (filterOptions.tag) {
      articles = articles.filter(
        (article) => article.tags && article.tags.includes(filterOptions.tag),
      );
    }

    // Exclude specific article paths (for deduplication)
    if (filterOptions.excludePaths && filterOptions.excludePaths.length > 0) {
      articles = articles.filter((article) => !filterOptions.excludePaths.includes(article.path));
    }

    // Apply sorting
    if (filterOptions.sortBy === 'releaseDate') {
      articles = articles.sort((a, b) => parseInt(b.releaseDate, 10) - parseInt(a.releaseDate, 10));
    }

    // Apply limit
    if (filterOptions.limit && filterOptions.limit > 0) {
      articles = articles.slice(0, filterOptions.limit);
    }

    return articles;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching news articles:', error);
    return [];
  }
}

/**
 * Build an optimized picture element for an article image
 * @param {string} imageSrc - Source URL of the image
 * @param {string} alt - Alt text for the image
 * @param {boolean} eager - Whether to load eagerly (default: false)
 * @returns {string} HTML string for picture element
 */
export function buildArticleImage(imageSrc, alt, eager = false) {
  const loading = eager ? 'eager' : 'lazy';
  return `
    <picture>
      <source type="image/webp" srcset="${imageSrc}?format=webply&optimize=medium" media="(min-width: 600px)">
      <source type="image/webp" srcset="${imageSrc}?format=webply&optimize=medium">
      <source type="image/jpeg" srcset="${imageSrc}?format=pjpg&optimize=medium" media="(min-width: 600px)">
      <img loading="${loading}" alt="${alt}" src="${imageSrc}?format=pjpg&optimize=medium" width="750" height="375">
    </picture>
  `;
}

/**
 * Convert Excel serial date to JavaScript Date
 * Excel serial dates count days since December 30, 1899
 * @param {number} serialDate - Excel serial date number
 * @returns {Date}
 */
function excelSerialToDate(serialDate) {
  // Excel epoch: December 30, 1899 (accounting for Excel's leap year bug)
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(excelEpoch.getTime() + serialDate * 24 * 60 * 60 * 1000);
}

/**
 * Parse a date value which could be an Excel serial date, Unix timestamp, or date string
 * @param {string|number} value - The date value to parse
 * @returns {Date|null}
 */
export function parseArticleDate(value) {
  if (!value) return null;

  const num = typeof value === 'string' ? parseInt(value, 10) : value;

  if (Number.isNaN(num)) return null;

  // Determine if this is an Excel serial date or Unix timestamp
  // Excel serial dates for reasonable years (1970-2100) are roughly 25569-73050
  // Unix timestamps in seconds (1970-2100) are roughly 0-4102444800
  // Unix timestamps in milliseconds are much larger (13+ digits)

  // If the number is less than 100000, it's likely an Excel serial date
  // (covers dates from 1900 to ~2173)
  if (num > 0 && num < 100000) {
    return excelSerialToDate(num);
  }

  // If larger than 1 billion, treat as Unix timestamp in milliseconds
  if (num > 1000000000000) {
    return new Date(num);
  }

  // Otherwise treat as Unix timestamp in seconds
  if (num > 1000000000) {
    return new Date(num * 1000);
  }

  // Fallback: try as milliseconds
  return new Date(num);
}

/**
 * Format a date for display
 * @param {string|number} releaseDate - Release date (Excel serial, Unix timestamp, or string)
 * @returns {string} Formatted date string
 */
export function formatArticleDate(releaseDate) {
  const date = parseArticleDate(releaseDate);
  if (!date || Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get article paths that are already displayed on the page
 * Checks for dynamic-hero and any other dynamic blocks that have been rendered
 * @param {HTMLElement} currentBlock - The current block element (to exclude from search)
 * @returns {Array<string>} Array of article paths already displayed
 */
export function getDisplayedArticlePaths(currentBlock) {
  const displayedPaths = [];

  // Check for dynamic-hero blocks
  const heroBlocks = document.querySelectorAll('.dynamic-hero');
  heroBlocks.forEach((hero) => {
    // Get the link from the hero block
    const link = hero.querySelector('a[href*="/news/"]');
    if (link) {
      displayedPaths.push(link.getAttribute('href'));
    }
  });

  // Check for other dynamic blocks that have been rendered (excluding current block)
  const dynamicBlocks = document.querySelectorAll('.dynamic-carousel, .dynamic-cards');
  dynamicBlocks.forEach((block) => {
    // Skip the current block being decorated
    if (block === currentBlock) return;

    // Get all article links
    const links = block.querySelectorAll('a[href*="/news/"]');
    links.forEach((link) => {
      displayedPaths.push(link.getAttribute('href'));
    });
  });

  // Remove duplicates
  return [...new Set(displayedPaths)];
}
