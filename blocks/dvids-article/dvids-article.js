import { fetchDVIDSArticle, formatDVIDSDate } from '../../scripts/dvids-api.js';

/**
 * Get article ID from URL parameters
 * @returns {string|null} Article ID or null
 */
function getArticleIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

/**
 * Render the full article content
 * @param {Object} article - Article data from DVIDS API
 * @returns {HTMLElement} Article content element
 */
function renderArticle(article) {
  const container = document.createElement('article');
  container.classList.add('dvids-article-content');

  // Header section
  const header = document.createElement('header');
  header.classList.add('dvids-article-header');

  // Title
  const title = document.createElement('h1');
  title.textContent = article.title || 'Untitled Article';
  header.appendChild(title);

  // Metadata row
  const meta = document.createElement('div');
  meta.classList.add('dvids-article-meta');

  if (article.date) {
    const date = document.createElement('span');
    date.classList.add('dvids-article-date');
    date.textContent = formatDVIDSDate(article.date);
    meta.appendChild(date);
  }

  if (article.branch) {
    const branch = document.createElement('span');
    branch.classList.add('dvids-article-branch');
    branch.textContent = article.branch;
    meta.appendChild(branch);
  }

  if (article.unit_name) {
    const unit = document.createElement('span');
    unit.classList.add('dvids-article-unit');
    unit.textContent = article.unit_name;
    meta.appendChild(unit);
  }

  header.appendChild(meta);

  // Author/credit
  if (article.credit) {
    const credit = document.createElement('p');
    credit.classList.add('dvids-article-credit');
    credit.textContent = `By ${article.credit}`;
    header.appendChild(credit);
  }

  container.appendChild(header);

  // Featured image
  if (article.image) {
    const imageWrapper = document.createElement('figure');
    imageWrapper.classList.add('dvids-article-image');

    const img = document.createElement('img');
    img.src = article.image;
    img.alt = article.title || '';
    img.loading = 'eager'; // Load hero image immediately
    imageWrapper.appendChild(img);

    if (article.description) {
      const caption = document.createElement('figcaption');
      caption.textContent = article.description;
      imageWrapper.appendChild(caption);
    }

    container.appendChild(imageWrapper);
  }

  // Article body
  if (article.body) {
    const body = document.createElement('div');
    body.classList.add('dvids-article-body');
    // DVIDS returns HTML content in the body field
    body.innerHTML = article.body;
    container.appendChild(body);
  }

  // Tags
  if (article.keywords && article.keywords.length > 0) {
    const tagsSection = document.createElement('div');
    tagsSection.classList.add('dvids-article-tags');

    const tagsLabel = document.createElement('span');
    tagsLabel.classList.add('dvids-tags-label');
    tagsLabel.textContent = 'Tags: ';
    tagsSection.appendChild(tagsLabel);

    const tagsList = document.createElement('span');
    tagsList.classList.add('dvids-tags-list');
    tagsList.textContent = article.keywords.join(', ');
    tagsSection.appendChild(tagsList);

    container.appendChild(tagsSection);
  }

  // Footer with DVIDS attribution and original link
  const footer = document.createElement('footer');
  footer.classList.add('dvids-article-footer');
  footer.innerHTML = `
    <p class="dvids-attribution">
      This article is provided by 
      <a href="https://www.dvidshub.net" target="_blank" rel="noopener">DVIDS</a> 
      (Defense Visual Information Distribution Service).
    </p>
    ${article.url ? `<p class="dvids-original-link"><a href="${article.url}" target="_blank" rel="noopener">View original on DVIDS →</a></p>` : ''}
  `;
  container.appendChild(footer);

  return container;
}

/**
 * Render error state
 * @param {string} message - Error message
 * @returns {HTMLElement} Error element
 */
function renderError(message) {
  const error = document.createElement('div');
  error.classList.add('dvids-article-error');
  error.innerHTML = `
    <h2>Unable to Load Article</h2>
    <p>${message}</p>
    <p><a href="javascript:history.back()">← Go Back</a></p>
  `;
  return error;
}

/**
 * Render loading state
 * @returns {HTMLElement} Loading element
 */
function renderLoading() {
  const loading = document.createElement('div');
  loading.classList.add('dvids-article-loading');
  loading.innerHTML = `
    <div class="dvids-loading-spinner"></div>
    <p>Loading article from DVIDS...</p>
  `;
  return loading;
}

/**
 * Decorate the DVIDS Article block
 * Fetches and displays a single article based on URL parameter
 * @param {HTMLElement} block - The block element
 */
export default async function decorate(block) {
  // Get article ID from URL
  const articleId = getArticleIdFromUrl();

  if (!articleId) {
    block.innerHTML = '';
    block.appendChild(renderError('No article ID provided. Please select an article from the news listing.'));
    return;
  }

  // Show loading state
  block.innerHTML = '';
  block.appendChild(renderLoading());

  // Fetch the article
  const article = await fetchDVIDSArticle(articleId);

  // Clear loading state
  block.innerHTML = '';

  if (!article) {
    block.appendChild(renderError('Article not found or could not be loaded from DVIDS.'));
    return;
  }

  // Update page title
  if (article.title) {
    document.title = `${article.title} | DVIDS News`;
  }

  // Render the article
  block.appendChild(renderArticle(article));
}
