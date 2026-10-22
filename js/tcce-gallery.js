/* TCCE: dependency-free, accessible album & flyer viewer. */
(() => {
  'use strict';
  const albums = {
  "ca": {
    "title": "Album 01",
    "files": [
      "1.jpg",
      "2.jpg",
      "3.jpg",
      "4.jpg",
      "5.jpg",
      "6.jpg",
      "7.jpg",
      "8.jpg",
      "9.jpg",
      "10.jpg",
      "11.jpg",
      "12.jpg",
      "13.jpg",
      "14.jpg",
      "15.jpg",
      "16.jpg",
      "17.jpg",
      "18.jpg",
      "19.jpg",
      "20.jpg",
      "21.jpg",
      "22.jpg",
      "24.jpg",
      "25.jpg",
      "26.jpg",
      "27.jpg",
      "28.jpg",
      "29.jpg",
      "30.jpg",
      "31.jpg",
      "32.jpg",
      "33.jpg",
      "34.jpg",
      "35.jpg",
      "36.jpg",
      "37.jpg",
      "38.jpg"
    ]
  },
  "cel": {
    "title": "Album 02",
    "files": [
      "Copy of 0Y2A0021.jpg",
      "Copy of 0Y2A0093.jpg",
      "Copy of 0Y2A0111.jpg",
      "Copy of 0Y2A0373.jpg",
      "Copy of 0Y2A0763.jpg",
      "Copy of 0Y2A0775.jpg",
      "Copy of 0Y2A0964.jpg",
      "Copy of 0Y2A1038.jpg",
      "Copy of 0Y2A1839.jpg",
      "Copy of 0Y2A1939.jpg",
      "Copy of 0Y2A1943.jpg",
      "Copy of 0Y2A1955.jpg",
      "Copy of 0Y2A2184.jpg"
    ]
  },
  "hah": {
    "title": "Album 03",
    "files": [
      "656727180_4436839999795268_3321910730029399234_n.jpg",
      "657830626_4436840123128589_5071809743797040186_n.jpg",
      "657835752_4436839169795351_7753067017666210025_n.jpg",
      "657928437_4436839136462021_2434660096231187437_n.jpg",
      "657955884_4436840179795250_6506763186313793848_n.jpg",
      "658167969_4436840353128566_3907776199064563385_n.jpg",
      "658420300_4436840033128598_8825991729854862189_n.jpg"
    ]
  }
};
  const dialog = document.getElementById('tcce-gallery-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const heroImage = document.getElementById('tcce-viewer-image');
  const error = document.getElementById('tcce-viewer-image-error');
  const title = document.getElementById('tcce-viewer-title');
  const kicker = document.getElementById('tcce-viewer-kicker');
  const counter = document.getElementById('tcce-viewer-counter');
  const thumbs = document.getElementById('tcce-viewer-thumbnails');
  const prev = document.getElementById('tcce-viewer-prev');
  const next = document.getElementById('tcce-viewer-next');
  const close = document.getElementById('tcce-viewer-close');
  let entries = [];
  let index = 0;
  let currentTitle = '';
  let focusReturn = null;
  let swipeStartX = null;
  let imageRequest = 0;

  // These are paths relative to index.html. encodeURIComponent correctly handles
  // the spaces in the CEL filenames, without renaming any actual files.
  function albumImage(folder, filename) {
    return 'images/gallery/' + folder + '/' + encodeURIComponent(filename);
  }

  function render() {
    const item = entries[index];
    if (!item) return;
    title.textContent = currentTitle;
    heroImage.alt = item.alt || (currentTitle + ', image ' + (index + 1));
    counter.textContent = (index + 1) + ' / ' + entries.length;
    prev.disabled = entries.length < 2;
    next.disabled = entries.length < 2;

    // Avoid old image-load events changing a newer slide's state.
    const requestId = ++imageRequest;
    heroImage.hidden = true;
    heroImage.removeAttribute('src');
    error.hidden = true;
    const loader = new Image();
    loader.onload = () => {
      if (requestId !== imageRequest || !dialog.open) return;
      heroImage.src = item.src;
      heroImage.hidden = false;
      error.hidden = true;
    };
    loader.onerror = () => {
      if (requestId !== imageRequest || !dialog.open) return;
      heroImage.hidden = true;
      error.hidden = false;
    };
    loader.src = item.src;

    // Render at most 5 nearby thumbnails, keeping large albums lightweight.
    thumbs.replaceChildren();
    const first = Math.max(0, Math.min(index - 2, entries.length - 5));
    const last = Math.min(entries.length, first + 5);
    for (let n = first; n < last; n++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tcce-viewer-thumb' + (n === index ? ' is-current' : '');
      button.setAttribute('aria-label', 'View photo ' + (n + 1));
      button.setAttribute('aria-pressed', n === index ? 'true' : 'false');
      const img = document.createElement('img');
      img.src = entries[n].src;
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = () => { img.style.visibility = 'hidden'; };
      button.appendChild(img);
      button.addEventListener('click', () => go(n));
      thumbs.appendChild(button);
    }
  }

  function go(nextIndex) {
    if (!entries.length) return;
    index = (nextIndex + entries.length) % entries.length;
    render();
  }

  function openViewer(images, albumTitle, firstIndex, isAlbum) {
    if (!images.length) return;
    entries = images;
    currentTitle = albumTitle;
    index = firstIndex || 0;
    kicker.textContent = isAlbum ? 'TCCE Photo Album' : 'TCCE Image Viewer';
    focusReturn = document.activeElement;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('tcce-gallery-is-open');
    render();
    close.focus();
  }

  document.querySelectorAll('[data-album]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.getAttribute('data-album');
      const album = albums[key];
      if (!album) return;
      openViewer(album.files.map((file, n) => ({
        src: albumImage(key, file), alt: album.title + ' photograph ' + (n + 1)
      })), album.title, 0, true);
    });
  });

  // One native dialog handles ALL existing data-lightbox links on the homepage,
  // including programme flyers and the original TCCE Moments cards.
  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[data-lightbox]');
    if (!anchor) return;
    const group = anchor.getAttribute('data-lightbox');
    if (!group) return;
    event.preventDefault();
    const anchors = Array.from(document.querySelectorAll('a[data-lightbox]'))
      .filter(link => link.getAttribute('data-lightbox') === group);
    const photos = anchors.map(link => ({
      src: link.getAttribute('href'),
      alt: link.getAttribute('data-title') || link.querySelector('img')?.alt || 'TCCE photograph'
    }));
    const start = Math.max(0, anchors.indexOf(anchor));
    openViewer(photos, anchor.getAttribute('data-title') || 'TCCE Photo Collection', start, false);
  });

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('tcce-gallery-is-open');
    imageRequest++;
    heroImage.removeAttribute('src');
    thumbs.replaceChildren();
    if (focusReturn?.focus) focusReturn.focus();
  });
  document.addEventListener('keydown', (event) => {
    if (!dialog.open) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1); }
  });
  const stage = dialog.querySelector('.tcce-viewer-stage');
  stage.addEventListener('touchstart', (event) => {
    swipeStartX = event.changedTouches[0]?.screenX ?? null;
  }, { passive: true });
  stage.addEventListener('touchend', (event) => {
    if (swipeStartX === null) return;
    const distance = (event.changedTouches[0]?.screenX ?? swipeStartX) - swipeStartX;
    swipeStartX = null;
    if (Math.abs(distance) > 55) go(index + (distance < 0 ? 1 : -1));
  }, { passive: true });

  // Only show the missing-image treatment when an actual image fails to load.
  document.querySelectorAll('.tcce-album-mosaic img').forEach(img => {
    img.addEventListener('error', () => img.closest('.tcce-album-tile')?.classList.add('is-missing'));
    img.addEventListener('load', () => img.closest('.tcce-album-tile')?.classList.remove('is-missing'));
    if (img.complete) {
      if (img.naturalWidth === 0) img.closest('.tcce-album-tile')?.classList.add('is-missing');
    }
  });
})();
