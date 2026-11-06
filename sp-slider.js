/* Reviewkaarten (.sp): slepen met de muis, bullets en voortgangsbalk */
(function () {
  function init() {
    var track = document.querySelector('.sp .sp-cards');
    if (!track || track.dataset.slider) return;
    track.dataset.slider = '1';
    var sec = track.closest('.sp');
    var dots = sec.querySelector('.sp-dots');
    var bar = sec.querySelector('.sp-progress span');
    var cards = track.querySelectorAll('.sp-card');
    if (!cards.length) return;

    function step() {
      var gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      return cards[0].getBoundingClientRect().width + gap;
    }
    function perPage() { return Math.max(1, Math.round((track.clientWidth + 1) / step())); }
    function pages() { return Math.max(1, Math.ceil(cards.length / perPage())); }
    function maxLeft() { return track.scrollWidth - track.clientWidth; }
    function current() {
      if (track.scrollLeft >= maxLeft() - 4) return pages() - 1;
      return Math.round(track.scrollLeft / (perPage() * step()));
    }
    function goTo(i) {
      i = Math.max(0, Math.min(pages() - 1, i));
      track.scrollTo({ left: Math.min(maxLeft(), i * perPage() * step()), behavior: 'smooth' });
    }

    function buildDots() {
      if (!dots) return;
      var n = pages();
      if (dots.children.length === n) return;
      dots.innerHTML = '';
      for (var i = 0; i < n; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Reviews ' + (i + 1));
        b.addEventListener('click', goTo.bind(null, i));
        dots.appendChild(b);
      }
    }
    function update() {
      buildDots();
      var c = current();
      if (dots) for (var i = 0; i < dots.children.length; i++) dots.children[i].classList.toggle('is-active', i === c);
      if (bar) bar.style.width = Math.min(100, (track.scrollLeft + track.clientWidth) / track.scrollWidth * 100) + '%';
    }
    var raf = 0;
    function queue() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; update(); }); }
    track.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);

    // Slepen met de muis (touch scrollt al vanzelf)
    var down = false, moved = false, startX = 0, startLeft = 0, startPage = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft; startPage = current();
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add('is-drag'); }
      if (moved) { track.scrollLeft = startLeft - dx; e.preventDefault(); }
    });
    window.addEventListener('pointerup', function (e) {
      if (!down) return;
      down = false;
      if (!moved) return;
      var dx = e.clientX - startX;
      track.classList.remove('is-drag');
      track.scrollLeft = track.scrollLeft;
      goTo(Math.abs(dx) > 40 ? startPage + (dx < 0 ? 1 : -1) : startPage);
    });
    track.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });

    update();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('load', init);
})();
