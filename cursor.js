// Cursor replacement: a word (or emoji) that trails the pointer.
// Text is read from <body data-cursor="...">; falls back to "test".
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce || !fine) return;

  var text = (document.body && document.body.getAttribute('data-cursor')) || 'test';

  var label = document.createElement('div');
  label.className = 'cursor-label';
  label.setAttribute('aria-hidden', 'true');
  label.textContent = text;
  if (/[^\x00-\x7F]/.test(text)) label.classList.add('cursor-label--emoji');
  document.body.appendChild(label);

  var x = window.innerWidth / 2;
  var y = window.innerHeight / 2;
  var tx = x;
  var ty = y;
  var raf = null;

  function tick() {
    raf = null;
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    label.style.transform =
      'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) translate(-50%, -50%)';
    if (Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05) {
      raf = window.requestAnimationFrame(tick);
    }
  }

  window.addEventListener('mousemove', function (e) {
    tx = e.clientX;
    ty = e.clientY;
    var overLink = !!(e.target && e.target.closest && e.target.closest('a'));
    label.classList.toggle('cursor-label--link', overLink);
    if (!raf) raf = window.requestAnimationFrame(tick);
  });

  tick();
})();
