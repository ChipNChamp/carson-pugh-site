// Cursor replacement: a word (or flag) pinned exactly to the pointer.
// Text is read from <body data-cursor="...">; falls back to the US flag.
// A value of "flag:us" renders an inline SVG US flag.
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var FLAGS = {
    us: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 100" role="img" aria-label="Flag of the United States"><rect x="0" y="0.000" width="190.0" height="7.692" fill="#B22234"/><rect x="0" y="7.692" width="190.0" height="7.692" fill="#FFFFFF"/><rect x="0" y="15.385" width="190.0" height="7.692" fill="#B22234"/><rect x="0" y="23.077" width="190.0" height="7.692" fill="#FFFFFF"/><rect x="0" y="30.769" width="190.0" height="7.692" fill="#B22234"/><rect x="0" y="38.462" width="190.0" height="7.692" fill="#FFFFFF"/><rect x="0" y="46.154" width="190.0" height="7.692" fill="#B22234"/><rect x="0" y="53.846" width="190.0" height="7.692" fill="#FFFFFF"/><rect x="0" y="61.538" width="190.0" height="7.692" fill="#B22234"/><rect x="0" y="69.231" width="190.0" height="7.692" fill="#FFFFFF"/><rect x="0" y="76.923" width="190.0" height="7.692" fill="#B22234"/><rect x="0" y="84.615" width="190.0" height="7.692" fill="#FFFFFF"/><rect x="0" y="92.308" width="190.0" height="7.692" fill="#B22234"/><rect x="0" y="0" width="76.000" height="53.846" fill="#3C3B6E"/><path id="s" d="M 0.000,-2.400 L 0.539,-0.742 L 2.283,-0.742 L 0.872,0.283 L 1.411,1.942 L 0.000,0.917 L -1.411,1.942 L -0.872,0.283 L -2.283,-0.742 L -0.539,-0.742 Z" fill="#FFFFFF"/><use href="#s" x="6.333" y="2.991"/><use href="#s" x="19.000" y="2.991"/><use href="#s" x="31.667" y="2.991"/><use href="#s" x="44.333" y="2.991"/><use href="#s" x="57.000" y="2.991"/><use href="#s" x="69.667" y="2.991"/><use href="#s" x="12.667" y="8.974"/><use href="#s" x="25.333" y="8.974"/><use href="#s" x="38.000" y="8.974"/><use href="#s" x="50.667" y="8.974"/><use href="#s" x="63.333" y="8.974"/><use href="#s" x="6.333" y="14.957"/><use href="#s" x="19.000" y="14.957"/><use href="#s" x="31.667" y="14.957"/><use href="#s" x="44.333" y="14.957"/><use href="#s" x="57.000" y="14.957"/><use href="#s" x="69.667" y="14.957"/><use href="#s" x="12.667" y="20.940"/><use href="#s" x="25.333" y="20.940"/><use href="#s" x="38.000" y="20.940"/><use href="#s" x="50.667" y="20.940"/><use href="#s" x="63.333" y="20.940"/><use href="#s" x="6.333" y="26.923"/><use href="#s" x="19.000" y="26.923"/><use href="#s" x="31.667" y="26.923"/><use href="#s" x="44.333" y="26.923"/><use href="#s" x="57.000" y="26.923"/><use href="#s" x="69.667" y="26.923"/><use href="#s" x="12.667" y="32.906"/><use href="#s" x="25.333" y="32.906"/><use href="#s" x="38.000" y="32.906"/><use href="#s" x="50.667" y="32.906"/><use href="#s" x="63.333" y="32.906"/><use href="#s" x="6.333" y="38.889"/><use href="#s" x="19.000" y="38.889"/><use href="#s" x="31.667" y="38.889"/><use href="#s" x="44.333" y="38.889"/><use href="#s" x="57.000" y="38.889"/><use href="#s" x="69.667" y="38.889"/><use href="#s" x="12.667" y="44.872"/><use href="#s" x="25.333" y="44.872"/><use href="#s" x="38.000" y="44.872"/><use href="#s" x="50.667" y="44.872"/><use href="#s" x="63.333" y="44.872"/><use href="#s" x="6.333" y="50.855"/><use href="#s" x="19.000" y="50.855"/><use href="#s" x="31.667" y="50.855"/><use href="#s" x="44.333" y="50.855"/><use href="#s" x="57.000" y="50.855"/><use href="#s" x="69.667" y="50.855"/></svg>'
  };

  var raw = (document.body && document.body.getAttribute('data-cursor')) || 'flag:us';

  var label = document.createElement('div');
  label.className = 'cursor-label';
  label.setAttribute('aria-hidden', 'true');

  if (raw.indexOf('flag:') === 0) {
    var code = raw.slice(5);
    if (FLAGS[code]) {
      label.classList.add('cursor-label--flag');
      label.innerHTML = FLAGS[code];
    } else {
      label.textContent = raw;
    }
  } else {
    label.textContent = raw;
  }

  document.body.appendChild(label);

  // Start at viewport center so there's no invisible-cursor gap while the page
  // loads; it snaps to the pointer on the first mousemove.
  label.style.transform =
    'translate3d(' + (window.innerWidth / 2) + 'px,' + (window.innerHeight / 2) + 'px,0) translate(-50%, -50%)';

  // A rAF loop renders the flag every frame from the latest known pointer
  // position. This is inherently resilient: even if an individual move event is
  // dropped, the flag keeps rendering at the last tracked location and updates
  // the instant a new event arrives.
  var lastX = window.innerWidth / 2, lastY = window.innerHeight / 2;
  var lastMoveTime = 0;
  var hidden = false;

  function place(x, y, t) {
    lastX = x; lastY = y; lastMoveTime = t;
    if (hidden) { hidden = false; label.style.opacity = '1'; }
    label.style.transform =
      'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%, -50%)';
  }

  function leaveCheckedVis() {
    if (!hidden && typeof lastMoveTime === 'number' &&
        (Date.now() - lastMoveTime > 120)) {
      // The pointer has gone quiet for a quarter second — e.g. a highlight or
      // native menu has taken over and the page is no longer receiving move
      // events. Hide the flag rather than leave it frozen at its last spot.
      hidden = true;
      label.style.opacity = '0';
    } else if (hidden) {
      label.style.opacity = '0';
    }
  }

  var frame = function () {
    label.style.transform =
      'translate3d(' + lastX + 'px,' + lastY + 'px,0) translate(-50%, -50%)';
    leaveCheckedVis();
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  // Track on WINDOW, capture phase. Using window (not document) guarantees we
  // receive move events even when the browser retargets them during a native
  // text-selection drag — this is what keeps the flag engaged with the site.
  ['pointermove', 'mousemove'].forEach(function (type) {
    window.addEventListener(type, function (e) {
      place(e.clientX, e.clientY, Date.now());
      if (type === 'pointermove') {
        var overLink = !!(e.target && e.target.closest && e.target.closest('a'));
        label.classList.toggle('cursor-label--link', overLink);
      }
    }, true);
  });

  // Re-engage on ANY pointer activity, so a selection drag that captured the
  // pointer can never leave the flag disengaged.
  ['pointerdown', 'pointerup', 'mousemove', 'mouseover', 'click'].forEach(function (type) {
    window.addEventListener(type, function () {
      label.style.opacity = '1';
      hidden = false;
    }, true);
  });

  // Suppress the native selection context menu (Copy / Search with Bing).
  // When that menu opens, the browser routes pointer events to the menu window
  // and the page stops receiving them — which is what freezes the flag after a
  // text selection. Blocking it keeps the pointer engaged with the page.
  window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  }, true);
})();
