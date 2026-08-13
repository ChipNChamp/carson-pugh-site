// Cursor replacement: a word (or emoji) pinned exactly to the pointer.
// Text is read from <body data-cursor="...">; falls back to "test".
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var text = (document.body && document.body.getAttribute('data-cursor')) || 'test';

  var label = document.createElement('div');
  label.className = 'cursor-label';
  label.setAttribute('aria-hidden', 'true');
  label.textContent = text;
  if (/[^\x00-\x7F]/.test(text)) label.classList.add('cursor-label--emoji');
  document.body.appendChild(label);

  window.addEventListener('mousemove', function (e) {
    label.style.opacity = '1';
    label.style.transform =
      'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0) translate(-50%, -50%)';
    var overLink = !!(e.target && e.target.closest && e.target.closest('a'));
    label.classList.toggle('cursor-label--link', overLink);
  });
})();
