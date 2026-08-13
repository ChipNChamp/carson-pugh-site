// Client-side navigation: swap page content without a full reload, so the
// custom cursor (and everything else) persists and never flashes between pages.
(function () {
  var main = document.querySelector('main');
  var titleEl = document.querySelector('title');
  var nav = document.querySelector('.site-nav');

  function apply(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');

    var newMain = doc.querySelector('main');
    if (main && newMain) main.innerHTML = newMain.innerHTML;

    var newTitle = doc.querySelector('title');
    if (titleEl && newTitle) titleEl.textContent = newTitle.textContent;

    if (nav) {
      var activeHref = null;
      var active = doc.querySelector('.site-nav a[aria-current="page"]');
      if (active) activeHref = active.getAttribute('href');
      Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
        if (activeHref && a.getAttribute('href') === activeHref) {
          a.setAttribute('aria-current', 'page');
        } else {
          a.removeAttribute('aria-current');
        }
      });
    }
  }

  function navigate(url, push) {
    fetch(url, { headers: { 'X-Requested-With': 'fetch' } })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then(function (html) {
        apply(html);
        if (push) history.pushState({}, '', url);
        window.scrollTo(0, 0);
      })
      .catch(function () {
        window.location.href = url;
      });
  }

  document.addEventListener('click', function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) !== '/') return;
    if (a.target && a.target !== '_self') return;
    e.preventDefault();
    navigate(href, true);
  });

  window.addEventListener('popstate', function () {
    navigate(window.location.pathname, false);
  });
})();
