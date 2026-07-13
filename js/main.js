// ============================================
// Shared behaviour across all pages
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  initNavToggle();
  initHeroTitleTyping();
  initHeroTyping();
  initScrollReveal();
  initParallax();
  initProjectPreviews();
});

// Mobile tab-bar toggle
function initNavToggle() {
  var toggle = document.querySelector('.nav-toggle');
  var tabs = document.querySelector('.nav-tabs');
  if (!toggle || !tabs) return;

  toggle.addEventListener('click', function () {
    var isOpen = tabs.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
}

// Types out the hero heading character by character, like it's being
// typed into an editor, with a blinking cursor at the caret.
// Falls back to the plain static heading when reduced motion is set.
function initHeroTitleTyping() {
  var el = document.getElementById('heroTitle');
  if (!el) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  var segments = [
    { text: "Hi, I'm Emmanuel Opeolu.", accent: false },
    { text: "", accent: false, isBreak: true },
    { text: "I build things ", accent: false },
    { text: "for the web.", accent: true }
  ];

  el.innerHTML = '';
  var cursor = document.createElement('span');
  cursor.className = 'type-cursor';
  el.appendChild(cursor);

  var segIndex = 0;
  var charIndex = 0;
  var currentSpan = null;

  function typeStep() {
    if (segIndex >= segments.length) return;

    var seg = segments[segIndex];

    if (seg.isBreak) {
      el.insertBefore(document.createElement('br'), cursor);
      segIndex++;
      charIndex = 0;
      setTimeout(typeStep, 150);
      return;
    }

    if (charIndex === 0) {
      currentSpan = document.createElement('span');
      if (seg.accent) currentSpan.className = 'accent-fill';
      el.insertBefore(currentSpan, cursor);
    }

    currentSpan.textContent += seg.text[charIndex];
    charIndex++;

    if (charIndex >= seg.text.length) {
      segIndex++;
      charIndex = 0;
    }

    var delay = 26 + Math.random() * 40;
    setTimeout(typeStep, delay);
  }

  setTimeout(typeStep, 300);
}

// Hero terminal: reveal lines with a brief typing style delay.
// Purely decorative and respects reduced motion preference.
function initHeroTyping() {
  var lines = document.querySelectorAll('.terminal-body .reveal');
  if (!lines.length) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    lines.forEach(function (line) { line.style.opacity = 1; });
    return;
  }

  lines.forEach(function (line, index) {
    line.style.opacity = 0;
    setTimeout(function () {
      line.style.transition = 'opacity 0.25s ease';
      line.style.opacity = 1;
    }, 220 * index);
  });
}

// Fade and slide elements up into view as the person scrolls.
// Applies to any element carrying the .reveal-up class.
function initScrollReveal() {
  var targets = document.querySelectorAll('.reveal-up');
  if (!targets.length) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    targets.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) { observer.observe(el); });

  // Safety net: in case a viewer's IntersectionObserver never fires
  // (some sandboxed/embedded contexts behave unpredictably), make sure
  // content is never left permanently invisible.
  setTimeout(function () {
    targets.forEach(function (el) { el.classList.add('in-view'); });
  }, 2500);
}

// Subtle parallax drift on the hero background layer as the page scrolls.
function initParallax() {
  var layer = document.querySelector('.parallax-bg');
  if (!layer) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  var ticking = false;

  function update() {
    var offset = window.scrollY || window.pageYOffset || 0;
    layer.style.transform = 'translateY(' + (offset * 0.18) + 'px)';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

// Project cards autoplay a short muted preview clip automatically once
// they scroll into view (and pause when scrolled out, to save resources),
// so the card itself feels like a live demo instead of a static screenshot.
// A visible play button is always available too, since some embedded or
// sandboxed viewers block programmatic autoplay outright — clicking it is
// a direct user gesture, so it always works regardless of that policy.
// Falls back to the poster frame (with the play button showing) when
// reduced motion is set.
function initProjectPreviews() {
  var wraps = document.querySelectorAll('.media-wrap');
  if (!wraps.length) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  wraps.forEach(function (wrap) {
    var video = wrap.querySelector('video.project-media');
    var playBtn = wrap.querySelector('.preview-play-btn');
    if (!video) return;

    video.addEventListener('play', function () { wrap.classList.add('is-playing'); });
    video.addEventListener('pause', function () { wrap.classList.remove('is-playing'); });

    if (playBtn) {
      playBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (video.paused) {
          video.play().catch(function () {});
        } else {
          video.pause();
        }
      });
    }

    if (prefersReduced) {
      video.removeAttribute('autoplay');
      return;
    }
  });

  if (prefersReduced) return;

  var visibleVideos = new Set();

  function tryPlay(video) {
    var playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        // Autoplay was blocked by the browser or an embedding iframe's
        // policy. The visible play button remains as a guaranteed
        // one-click fallback, and we also retry on the next interaction.
        armInteractionFallback();
      });
    }
  }

  var fallbackArmed = false;
  function armInteractionFallback() {
    if (fallbackArmed) return;
    fallbackArmed = true;
    var retry = function () {
      visibleVideos.forEach(function (video) {
        if (video.paused) tryPlay(video);
      });
      fallbackArmed = false;
    };
    ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel'].forEach(function (evt) {
      document.addEventListener(evt, retry, { once: true, passive: true });
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target.querySelector('video.project-media');
        if (!video) return;
        if (entry.isIntersecting) {
          visibleVideos.add(video);
          tryPlay(video);
        } else {
          visibleVideos.delete(video);
          video.pause();
        }
      });
    }, { threshold: 0.15 });

    wraps.forEach(function (wrap) { observer.observe(wrap); });

    // Also retry on every scroll tick (throttled) while anything is
    // visible but still paused, to close the gap between "element enters
    // the viewport" and "browser is willing to grant playback".
    var scrollTicking = false;
    window.addEventListener('scroll', function () {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(function () {
        visibleVideos.forEach(function (video) {
          if (video.paused) tryPlay(video);
        });
        scrollTicking = false;
      });
    }, { passive: true });
  } else {
    wraps.forEach(function (wrap) {
      var video = wrap.querySelector('video.project-media');
      if (video) { visibleVideos.add(video); tryPlay(video); }
    });
  }
}
