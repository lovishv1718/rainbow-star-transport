/* Rainbow Star Transport — site interactions */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.remove('no-js');

  /* ---------- Sticky header ---------- */
  var header = document.querySelector('.header');
  var toTop = document.querySelector('.to-top');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 160);
    if (toTop) toTop.classList.toggle('is-visible', y > 900);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Mobile drawer ---------- */
  var drawer = document.querySelector('.drawer');
  var openBtn = document.querySelector('.menu-toggle');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var c = drawer.querySelector('.drawer__close'); if (c) c.focus(); }
    else if (openBtn) openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setDrawer(true); });
  if (drawer) {
    drawer.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', function () { setDrawer(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('is-open')) setDrawer(false); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dur = 1800, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Services sub-nav highlighting ---------- */
  var subLinks = document.querySelectorAll('.subnav a');
  if (subLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    subLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          subLinks.forEach(function (a) { a.classList.remove('is-active'); });
          var a = map[en.target.id];
          if (a) {
            a.classList.add('is-active');
            // Scroll ONLY the sub-nav bar sideways — never the page itself.
            var bar = a.parentElement;
            if (bar.scrollWidth > bar.clientWidth) {
              bar.scrollTo({ left: a.offsetLeft - (bar.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
            }
          }
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) sio.observe(s); });
  }

  /* ---------- Preselect service from URL (?service=ltl) ---------- */
  var params = new URLSearchParams(window.location.search);
  var pre = params.get('service');
  if (pre) {
    var box = document.querySelector('input[name="service"][value="' + pre + '"]');
    if (box) box.checked = true;
  }

  /* ---------- Quote form (static: opens the visitor's email app) ---------- */
  var form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        var wrap = f.closest('.field');
        var bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
        if (wrap) wrap.classList.toggle('has-error', bad);
        if (bad && ok) { f.focus(); ok = false; }
      });
      if (!ok) return;

      var data = new FormData(form);
      var services = data.getAll('service').join(', ') || 'Not specified';
      var lines = [
        'QUOTE REQUEST — Rainbow Star Transport Ltd.',
        '',
        'Name: ' + (data.get('name') || ''),
        'Company: ' + (data.get('company') || ''),
        'Email: ' + (data.get('email') || ''),
        'Phone: ' + (data.get('phone') || ''),
        '',
        'Service(s): ' + services,
        'Equipment: ' + (data.get('equipment') || ''),
        'Pickup (origin): ' + (data.get('origin') || ''),
        'Delivery (destination): ' + (data.get('destination') || ''),
        'Ready date: ' + (data.get('date') || ''),
        'Approx. weight / pallets: ' + (data.get('weight') || ''),
        '',
        'Details:',
        (data.get('message') || '')
      ];
      var to = form.getAttribute('data-to');
      var subject = 'Quote Request — ' + services + ' — ' + (data.get('name') || '');
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));

      var success = document.querySelector('.form-success');
      if (success) { form.hidden = true; success.classList.add('is-visible'); success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
    form.querySelectorAll('input, select, textarea').forEach(function (f) {
      f.addEventListener('input', function () { var w = f.closest('.field'); if (w) w.classList.remove('has-error'); });
    });
  }

  /* ---------- Re-align #anchor links once images & animations settle ---------- */
  if (window.location.hash.length > 1) {
    window.addEventListener('load', function () {
      var t = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (t) {
        if (t.classList.contains('reveal')) t.classList.add('is-in');
        setTimeout(function () { t.scrollIntoView({ behavior: 'auto', block: 'start' }); }, 120);
      }
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
