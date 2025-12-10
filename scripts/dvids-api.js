/**
 * DVIDS API utilities for fetching news articles
 * API Documentation: https://api.dvidshub.net/
 */

const API_BASE_SEARCH = 'https://api.dvidshub.net/search';
const API_BASE_ASSET = 'https://api.dvidshub.net/asset';

// Note: For production, consider proxying through your own endpoint to hide the API key
const API_KEY = 'key-6911edd214ab0';

/**
 * Search for DVIDS news articles
 * @param {Object} options - Search options
 * @param {string} options.keyword - Search keyword/query
 * @param {string} options.branch - (Army, Navy, Air Force, Marines, Coast Guard, etc.)
 * @param {string} options.unit - Unit ID to filter by
 * @param {number} options.limit - Maximum number of results (default: 10)
 * @param {number} options.page - Page number for pagination (default: 1)
 * @param {string} options.sort - Sort field: date, publishdate, timestamp, score (default: date)
 * @param {string} options.sortdir - Sort direction: asc, desc (default: desc)
 * @returns {Promise<Object>} Search results with articles array and metadata
 */
export async function searchDVIDSNews(options = {}) {
  const {
    keyword = '',
    branch = '',
    unit = '',
    limit = 10,
    page = 1,
    sort = 'date',
    sortdir = 'desc',
  } = options;

  const params = new URLSearchParams();
  params.set('api_key', API_KEY);
  params.set('type[]', 'news'); // Only fetch news articles
  params.set('max_results', String(limit));
  params.set('page', String(page));
  params.set('sort', sort);
  params.set('sortdir', sortdir);

  if (keyword) params.set('q', keyword);
  if (branch) params.set('branch', branch);
  if (unit) params.set('unit', unit);

  const url = `${API_BASE_SEARCH}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`DVIDS API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      articles: Array.isArray(data.results) ? data.results : [],
      totalResults: data.total_results || 0,
      page: data.page || 1,
      pageCount: data.page_count || 1,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching DVIDS news:', error);
    return {
      articles: [], totalResults: 0, page: 1, pageCount: 1,
    };
  }
}

/**
 * Fetch a single DVIDS article by ID
 * @param {string} id - DVIDS asset ID
 * @returns {Promise<Object|null>} Article data or null if not found
 */
export async function fetchDVIDSArticle(id) {
  if (!id) return null;

  const params = new URLSearchParams();
  params.set('api_key', API_KEY);
  params.set('id', id);

  const url = `${API_BASE_ASSET}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`DVIDS API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.results) {
      return data.results;
    }

    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching DVIDS article:', error);
    return null;
  }
}

/**
 * Format a DVIDS date string for display
 * @param {string} dateStr - Date string from DVIDS API
 * @returns {string} Formatted date
 */
export function formatDVIDSDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get the on-site article URL for a DVIDS article
 * @param {string} id - DVIDS article ID
 * @returns {string} On-site URL path
 */
export function getDVIDSArticlePath(id) {
  return `/dvids/article?id=${encodeURIComponent(id)}`;
}
