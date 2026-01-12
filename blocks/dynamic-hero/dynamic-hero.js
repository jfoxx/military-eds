import { fetchNewsArticles } from '../../scripts/news-data.js';

/**
 * Get base image URL without query parameters
 */
function getBaseImageUrl(imageUrl) {
  return imageUrl.split('?')[0];
}

/**
 * Build hero HTML from article data (dynamic mode)
 */
function buildHeroFromArticle(article) {
  const baseImage = getBaseImageUrl(article.image);
  const heroHTML = `
    <picture>
      <source type="image/webp" srcset="${baseImage}?width=1600&format=webply&optimize=high" media="(min-width: 600px)">
      <source type="image/webp" srcset="${baseImage}?width=800&format=webply&optimize=high">
      <source type="image/jpeg" srcset="${baseImage}?width=1600&format=pjpg&optimize=high" media="(min-width: 600px)">
      <img loading="eager" alt="${article.title}" src="${baseImage}?width=1600&format=pjpg&optimize=high" width="2000" height="1000">
    </picture>
    <div class="dynamic-hero-content">
      <h1>${article.title}</h1>
      <p>${article.description}</p>
      ${article.path ? `<p class="button-container"><a href="${article.path}" class="usa-button">Read More</a></p>` : ''}
    </div>
  `;

  return heroHTML;
}

/**
 * Build hero from manually authored content
 */
function buildHeroFromContent(picture, headline, description, cta) {
  const fragment = document.createDocumentFragment();

  // Add the picture element
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'eager');
    }
    fragment.appendChild(picture);
  }

  // Create content wrapper
  const contentDiv = document.createElement('div');
  contentDiv.className = 'dynamic-hero-content';

  // Add headline
  if (headline) {
    const h1 = document.createElement('h1');
    h1.textContent = headline;
    contentDiv.appendChild(h1);
  }

  // Add description
  if (description) {
    const p = document.createElement('p');
    p.textContent = description;
    contentDiv.appendChild(p);
  }

  // Add CTA button
  if (cta) {
    const buttonContainer = document.createElement('p');
    buttonContainer.className = 'button-container';
    cta.className = 'usa-button';
    buttonContainer.appendChild(cta);
    contentDiv.appendChild(buttonContainer);
  }

  fragment.appendChild(contentDiv);
  return fragment;
}

/**
 * Extract manual content from block rows
 * Expected structure:
 * Row 1: Image
 * Row 2: Headline
 * Row 3: Description
 * Row 4: CTA link (optional)
 */
function extractManualContent(block) {
  const rows = [...block.children];

  // Check if there's any content
  if (rows.length === 0) {
    return null;
  }

  // Get the picture from the first row
  const picture = rows[0]?.querySelector('picture');

  // If no picture found, not manual mode
  if (!picture) {
    return null;
  }

  // Get headline from second row
  const headlineRow = rows[1];
  const headline = headlineRow?.querySelector('h1, h2, h3')?.textContent
    || headlineRow?.textContent?.trim();

  // Get description from third row
  const descriptionRow = rows[2];
  const description = descriptionRow?.textContent?.trim();

  // Get CTA from fourth row (optional)
  const ctaRow = rows[3];
  const cta = ctaRow?.querySelector('a')?.cloneNode(true);

  return {
    picture: picture.cloneNode(true),
    headline,
    description,
    cta,
  };
}

export default async function decorate(block) {
  // First, check if manual content is provided
  const manualContent = extractManualContent(block);

  if (manualContent) {
    // Manual mode: use authored content
    block.innerHTML = '';
    block.appendChild(buildHeroFromContent(
      manualContent.picture,
      manualContent.headline,
      manualContent.description,
      manualContent.cta,
    ));
    return;
  }

  // Dynamic mode: fetch from query index
  const articles = await fetchNewsArticles({
    featured: true,
    limit: 1,
    sortBy: 'releaseDate',
  });

  if (!articles || articles.length === 0) {
    block.innerHTML = '<p>No featured article available</p>';
    return;
  }

  // Build and inject the hero content
  block.innerHTML = buildHeroFromArticle(articles[0]);
}
