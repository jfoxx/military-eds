async function loadTags() {
  try {
    const resp = await fetch('https://main--military--jfoxx.aem.live/admin/tags.json?sheet=topics');
    const data = await resp.json();

    const container = document.getElementById('tag-list');
    container.innerHTML = '';

    // Use only the "title" field
    const tags = data.data.map(t => t.title);

    tags.forEach(title => {
      const label = document.createElement('label');
      label.className = 'tag-item';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = title; // copy the title itself

      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + title));
      container.appendChild(label);
    });
  } catch (err) {
    console.error('Error loading tags:', err);
    document.getElementById('tag-list').textContent = 'Failed to load tags.';
  }
}

document.getElementById('copy-btn').addEventListener('click', () => {
  const selected = [...document.querySelectorAll('#tag-list input[type=checkbox]:checked')]
    .map(cb => cb.value) // copy the titles
    .join(',');
  if (selected) {
    navigator.clipboard.writeText(selected);
    alert('Copied: ' + selected);
  } else {
    alert('No tags selected.');
  }
});

// Load tags on page load
loadTags();
