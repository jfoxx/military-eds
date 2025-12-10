import { searchDVIDSNews, formatDVIDSDate, getDVIDSArticlePath } from '../../scripts/dvids-api.js';

/**
 * Create a card element for a DVIDS news article
 * @param {Object} article - Article data from DVIDS API
 * @returns {HTMLElement} Card list item element
 */
function createArticleCard(article) {
  const li = document.createElement('li');

  // Image container
  const imageDiv = document.createElement('div');
  imageDiv.classList.add('cards-card-image');

  if (article.thumbnail || article.image) {
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = article.thumbnail || article.image;
    img.alt = article.title || 'DVIDS News Article';
    img.loading = 'lazy';
    picture.appendChild(img);
    imageDiv.appendChild(picture);
  }

  // Body container
  const bodyDiv = document.createElement('div');
  bodyDiv.classList.add('cards-card-body');

  // Title
  const title = document.createElement('h3');
  title.textContent = article.title || 'Untitled';

  // Date and branch metadata
  const meta = document.createElement('p');
  meta.classList.add('dvids-meta');
  const datePart = formatDVIDSDate(article.date);
  const branchPart = article.branch || '';
  meta.textContent = [datePart, branchPart].filter(Boolean).join(' • ');

  // Description/summary
  const description = document.createElement('p');
  description.classList.add('dvids-description');
  // Truncate long descriptions
  const desc = article.description || article.summary || '';
  description.textContent = desc.length > 200 ? `${desc.substring(0, 200)}...` : desc;

  // Read more link (stays on-site!)
  const link = document.createElement('p');
  link.classList.add('button-container');
  const anchor = document.createElement('a');
  anchor.href = getDVIDSArticlePath(article.id);
  anchor.textContent = 'Read More';
  anchor.classList.add('button', 'primary');
  link.appendChild(anchor);

  bodyDiv.appendChild(title);
  bodyDiv.appendChild(meta);
  bodyDiv.appendChild(description);
  bodyDiv.appendChild(link);

  li.appendChild(imageDiv);
  li.appendChild(bodyDiv);

  return li;
}

/**
 * Read configuration from block table cells
 * @param {HTMLElement} block - The block element
 * @returns {Object} Configuration object
 */
function readBlockConfig(block) {
  const config = {
    limit: 6,
    page: 1,
    sort: 'date',
    sortdir: 'desc',
  };

  const rows = block.querySelectorAll(':scope > div');
  rows.forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length === 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();

      switch (key) {
        case 'limit':
          config.limit = parseInt(value, 10) || 6;
          break;
        case 'branch':
          config.branch = value;
          break;
        case 'unit':
          config.unit = value;
          break;
        case 'keyword':
        case 'query':
        case 'q':
          config.keyword = value;
          break;
        case 'sort':
          config.sort = value;
          break;
        case 'sortdir':
          config.sortdir = value;
          break;
        default:
          break;
      }
    }
  });

  return config;
}

/**
 * Decorate the DVIDS News block
 * @param {HTMLElement} block - The block element
 */
export default async function decorate(block) {
  // Read configuration from block
  const config = readBlockConfig(block);

  // Clear the block and show loading state
  block.innerHTML = '<p class="dvids-loading">Loading DVIDS news...</p>';

  // Fetch articles from DVIDS
  const { articles, totalResults } = await searchDVIDSNews(config);

  // Clear loading state
  block.innerHTML = '';

  if (!articles || articles.length === 0) {
    block.innerHTML = '<p class="dvids-empty">No DVIDS articles available</p>';
    return;
  }

  // Create header with source attribution
  const header = document.createElement('div');
  header.classList.add('dvids-header');
  header.innerHTML = `
    <span class="dvids-source">Powered by <a href="https://www.dvidshub.net" target="_blank" rel="noopener">DVIDS</a></span>
    <span class="dvids-count">${totalResults} articles found</span>
  `;
  block.appendChild(header);

  // Create the cards list
  const ul = document.createElement('ul');

  articles.forEach((article) => {
    const card = createArticleCard(article);
    ul.appendChild(card);
  });

  block.appendChild(ul);
}
