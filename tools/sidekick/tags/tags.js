let tagsData = {};
let currentCategory = 'topics';

async function loadTags() {
  try {
    const resp = await fetch('https://main--military--jfoxx.aem.live/admin/tags.json');
    const data = await resp.json();
    tagsData = data;
    renderCategory(currentCategory);
  } catch (err) {
    console.error('Error loading tags:', err);
    document.getElementById('tab-content').textContent = 'Failed to load tags.';
  }
}

function renderCategory(category) {
  currentCategory = category;
  const container = document.getElementById('tab-content');
  container.innerHTML = '';

  const tags = tagsData[category]?.data || [];
  tags.forEach(tag => {
    const label = document.createElement('label');
    label.className = 'tag-item';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = tag.name; // copy name value

    label.appendChild(input);
    label.appendChild(document.createTextNode(' ' + tag.title));
    container.appendChild(label);
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.category === category);
  });
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => renderCategory(tab.dataset.category));
});

document.getElementById('copy-btn').addEventListener('click', () => {
  const selected = [...document.querySelectorAll('#tab-content input[type=checkbox]:checked')]
    .map(cb => cb.value)
    .join(',');

  if (selected) {
    navigator.clipboard.writeText(selected);

    // Reset all checkboxes for all categories so palette is fresh next open
    Object.keys(tagsData).forEach(cat => {
      document.querySelectorAll('#tab-content input[type=checkbox]').forEach(cb => cb.checked = false);
    });

    // Close the palette using your extension messaging approach
    chrome.runtime.sendMessage('igkmdomcgoebiipaifhmpfjhbjccggml', {
      id: 'tags',
      action: 'closePalette',
    });
  }
});

// Load tags on page load
loadTags();
