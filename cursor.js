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

  window.addEventListener('mousemove', function (e) {
    label.style.opacity = '1';
    label.style.transform =
      'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0) translate(-50%, -50%)';
    var overLink = !!(e.target && e.target.closest && e.target.closest('a'));
    label.classList.toggle('cursor-label--link', overLink);
  });

  // Hide when the pointer leaves the window entirely, so the flag doesn't
  // linger at the edge waiting for the cursor to return.
  window.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget) label.style.opacity = '0';
  });
})();
