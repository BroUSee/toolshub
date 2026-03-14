// ─── Custom Cursor (desktop only) ───────────────────────────────────────────
function initCursor() {
  const cursor = document.querySelector('.cursor');
  const ring   = document.querySelector('.cursor-ring');
  if (!cursor || !ring) return;

  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    ring.style.display   = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mx = -100, my = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateRing() {
    ring.style.left = mx + 'px';
    ring.style.top  = my + 'px';
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  document.querySelectorAll('a, button, .tool-card, input, textarea, select, label')
    .forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
        ring.style.opacity = '0';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.opacity = '0.5';
      });
    });
}

// ─── Scroll Reveal ───────────────────────────────────────────────────────────
function initScrollReveal() {
  const cards = document.querySelectorAll('.tool-card');
  if (!cards.length) return;

  if (!('IntersectionObserver' in window)) {
    cards.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = opacity 0.45s ease ${i * 0.06}s, transform 0.45s ease ${i * 0.06}s;
    observer.observe(el);
  });
}

// ─── Copy to Clipboard ───────────────────────────────────────────────────────
function copyToClipboard(text, btn) {
  if (!text || text.trim() === '') return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showCopied(btn)).catch(() => fallbackCopy(text, btn));
  } else {
    fallbackCopy(text, btn);
  }
}

function fallbackCopy(text, btn) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand('copy'); showCopied(btn); }
  catch(e) { btn.textContent = 'Failed'; }
  document.body.removeChild(ta);
}

function showCopied(btn) {
  const orig = btn.textContent;
  btn.textContent = '✓ Copied!';
  btn.style.color = '#2d6a4f';
  setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 2000);
}

// ─── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initScrollReveal();
});