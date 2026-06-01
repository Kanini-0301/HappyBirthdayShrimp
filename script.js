/* ================================================================
   SUHANI'S BIRTHDAY SITE — script.js
   Handles: Password gate, Tab navigation, Floating hearts, Letter modal
   ================================================================ */

/* ── ══════════════════════════════════════════════════════════
   0. PASSWORD GATE
   ══════════════════════════════════════════════════════════ ── */

const CORRECT_PASSWORD = 'iloveyoukawni'; // spaces stripped — comparison ignores spacing & case

/**
 * Checks the entered password and either unlocks the site or
 * shakes the input and reveals a hint.
 * @param {SubmitEvent} event
 */
function checkPassword(event) {
  event.preventDefault();

  const input   = document.getElementById('gate-input');
  const hint    = document.getElementById('gate-hint');
  const wrap    = input.closest('.gate-input-wrap');
  const gate    = document.getElementById('password-gate');

  // Strip all whitespace so spacing doesn't matter (e.g. "iloveyoukawni" == "i love you kawni")
  const entered = input.value.toLowerCase().replace(/\s+/g, '');

  if (entered === CORRECT_PASSWORD) {
    // ✅ Correct — fade the gate out then remove it from DOM
    gate.classList.add('unlocked');
    // Re-enable body scroll in case it was locked
    document.body.style.overflow = '';
    setTimeout(() => gate.remove(), 850);
  } else {
    // ❌ Wrong — shake the input, show hint
    // Clear and re-trigger shake (in case already shaking)
    wrap.classList.remove('shake');
    // Force reflow so animation restarts
    void wrap.offsetWidth;
    wrap.classList.add('shake');

    hint.textContent = 'hint: the password is something i like hearing from you 🩷';
    hint.classList.add('visible');

    // Clear the input and re-focus
    input.value = '';
    input.focus();

    // Remove shake class after animation ends
    wrap.addEventListener('animationend', () => {
      wrap.classList.remove('shake');
    }, { once: true });
  }
}

/**
 * Initialises the password gate — locks body scroll and focuses input.
 */
function initPasswordGate() {
  const gate  = document.getElementById('password-gate');
  const input = document.getElementById('gate-input');
  if (!gate) return;

  // Prevent scrolling the page behind the gate
  document.body.style.overflow = 'hidden';
  // Auto-focus the password field
  setTimeout(() => input && input.focus(), 200);
}




/**
 * Shows a given section and highlights the matching nav tab.
 * @param {string} name - One of 'home' | 'gallery' | 'poem'
 */
function showSection(name) {
  // Hide all sections
  document.querySelectorAll('.page-section').forEach(sec => {
    sec.classList.remove('active');
  });

  // Deactivate all tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });

  // Activate target section
  const targetSection = document.getElementById('section-' + name);
  if (targetSection) {
    targetSection.classList.add('active');
    // Scroll to top of page on section switch (important for mobile)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Activate target tab
  const targetTab = document.getElementById('tab-' + name);
  if (targetTab) {
    targetTab.classList.add('active');
    targetTab.setAttribute('aria-selected', 'true');
  }
}


/* ── ══════════════════════════════════════════════════════════
   2. FLOATING HEARTS ANIMATION
   ══════════════════════════════════════════════════════════ ── */

const HEARTS = ['♡', '♥', '🤍', '🩷', '💕', '💗', '💖', '💓'];

/**
 * Creates a single floating heart element and appends it to the container.
 */
function spawnHeart() {
  const container = document.getElementById('hearts-container');
  if (!container) return;

  const heart = document.createElement('span');
  heart.classList.add('floating-heart');
  heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];

  // Random horizontal position
  const left = Math.random() * 100;
  heart.style.left = left + 'vw';

  // Random size (rem)
  const size = 0.9 + Math.random() * 1.2;
  heart.style.fontSize = size + 'rem';

  // Random duration (15–35s) and delay (0–10s)
  const duration = 15 + Math.random() * 20;
  const delay    = Math.random() * 10;
  heart.style.animationDuration = duration + 's';
  heart.style.animationDelay    = delay + 's';

  // Random opacity cap
  const opacity = 0.3 + Math.random() * 0.35;
  heart.style.setProperty('--max-opacity', opacity);

  container.appendChild(heart);

  // Remove from DOM after animation completes to avoid memory leaks
  setTimeout(() => {
    heart.remove();
  }, (duration + delay + 2) * 1000);
}

/**
 * Initialises the floating hearts system.
 * Spawns an initial batch, then continues at an interval.
 */
function initFloatingHearts() {
  // Initial burst
  const initialCount = window.innerWidth < 480 ? 6 : 12;
  for (let i = 0; i < initialCount; i++) {
    setTimeout(spawnHeart, i * 600);
  }

  // Continuous spawn
  const spawnRate = window.innerWidth < 480 ? 3500 : 2200;
  setInterval(spawnHeart, spawnRate);
}


/* ── ══════════════════════════════════════════════════════════
   3. LETTER MODAL
   ══════════════════════════════════════════════════════════ ── */

/**
 * Opens the letter modal with a smooth animation.
 */
function openLetter() {
  const modal = document.getElementById('letter-modal');
  if (!modal) return;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden'; // Prevent body scroll

  // Scroll letter to top every time it's opened
  const content = document.getElementById('letter-modal-content');
  if (content) content.scrollTop = 0;
}

/**
 * Closes the letter modal.
 * Accepts an optional event to allow clicking the backdrop to close.
 * @param {MouseEvent|undefined} event
 */
function closeLetter(event) {
  // If triggered by a click event on the backdrop itself (not its children), close.
  if (event && event.target !== document.getElementById('letter-modal')) return;

  const modal = document.getElementById('letter-modal');
  if (!modal) return;

  modal.classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * Close modal on Escape key press.
 */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const letterModal = document.getElementById('letter-modal');
    if (letterModal && letterModal.classList.contains('open')) {
      letterModal.classList.remove('open');
      document.body.style.overflow = '';
    }
    const memModal = document.getElementById('memory-modal');
    if (memModal && memModal.classList.contains('open')) {
      memModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});


/* ── ══════════════════════════════════════════════════════════
   3b. MEMORY LIGHTBOX
   ══════════════════════════════════════════════════════════ ── */

/**
 * Opens the memory lightbox for the clicked card.
 * Reads img src/alt, date text, and note text from the card DOM.
 * @param {HTMLElement} card - The .memory-card article element
 */
function openMemory(card) {
  const img     = card.querySelector('.memory-photo img');
  const date    = card.querySelector('.memory-date');
  const text    = card.querySelector('.memory-text');

  const modalImg  = document.getElementById('memory-modal-img');
  const modalDate = document.getElementById('memory-modal-date');
  const modalText = document.getElementById('memory-modal-text');
  const modal     = document.getElementById('memory-modal');

  if (!modal || !modalImg) return;

  // Populate modal content
  modalImg.src        = img  ? img.src  : '';
  modalImg.alt        = img  ? img.alt  : '';
  modalDate.textContent = date ? date.textContent : '';
  modalText.textContent = text ? text.textContent : '';

  // Scroll image wrap to top
  const imgWrap = document.getElementById('memory-modal-box')
                          .querySelector('.memory-modal-img-wrap');
  if (imgWrap) imgWrap.scrollTop = 0;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Closes the memory lightbox when clicking the backdrop (not the box itself).
 * @param {MouseEvent} event
 */
function closeMemory(event) {
  if (event && event.target !== document.getElementById('memory-modal')) return;
  _closeMemoryModal();
}

/**
 * Closes the memory lightbox directly (close button).
 */
function closeMemoryDirect() {
  _closeMemoryModal();
}

function _closeMemoryModal() {
  const modal = document.getElementById('memory-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}


/* ── ══════════════════════════════════════════════════════════
   4. NAVBAR SCROLL EFFECT
   ══════════════════════════════════════════════════════════ ── */

/**
 * Adds a slightly more opaque background to the navbar on scroll.
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.background = 'rgba(255, 240, 245, 0.82)';
    } else {
      navbar.style.background = '';
    }
  }, { passive: true });
}


/* ── ══════════════════════════════════════════════════════════
   5. SCROLL-TRIGGERED REVEAL (memory cards & poem)
   ══════════════════════════════════════════════════════════ ── */

/**
 * Uses IntersectionObserver to animate elements into view as they scroll in.
 */
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe memory cards
  document.querySelectorAll('.memory-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ${i * 0.12}s ease, transform 0.6s ${i * 0.12}s ease`;
    revealObserver.observe(card);
  });

  // Observe poem card
  const poemCard = document.getElementById('poem-card');
  if (poemCard) {
    poemCard.style.opacity = '0';
    poemCard.style.transform = 'translateY(30px)';
    poemCard.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    revealObserver.observe(poemCard);
  }

  // Observe featured photo cards
  document.querySelectorAll('.featured-photo-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity 0.5s ${0.2 + i * 0.1}s ease, transform 0.5s ${0.2 + i * 0.1}s ease`;
    revealObserver.observe(card);
  });
}


/* ── ══════════════════════════════════════════════════════════
   6. INITIALISE EVERYTHING ON DOM READY
   ══════════════════════════════════════════════════════════ ── */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordGate();
  initFloatingHearts();
  initNavbarScroll();
  initScrollReveal();

  // Set active section from URL hash (so links/bookmarks work)
  const hash = window.location.hash.replace('#', '');
  if (['home', 'gallery', 'poem'].includes(hash)) {
    showSection(hash);
  }
});
