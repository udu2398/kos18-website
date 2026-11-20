/* =========================================================
   KOS 18 RESIK NYAMAN — interaksi & animasi
   ========================================================= */
(() => {
  'use strict';

  /* refresh / buka ulang → selalu mulai dari halaman utama (atas), bukan posisi scroll terakhir */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  window.scrollTo(0, 0);
  window.addEventListener('pageshow', e => { if (e.persisted) window.scrollTo(0, 0); });   // kembali via tombol back (bfcache)
  // sebelum refresh/tutup: kembalikan ke atas → posisi yang diingat browser = 0
  window.addEventListener('beforeunload', () => { window.scrollTo(0, 0); });
  const K = window.KOS;
  const G = window.gsap;
  const ST = window.ScrollTrigger;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const img = f => `assets/img/${f}.webp?v=7`;
  const rp = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');

  if (G && ST) {
    G.registerPlugin(ST);
    ST.clearScrollMemory('manual');   // ScrollTrigger jangan mengembalikan posisi scroll lama
    // HP: address bar muncul/hilang saat scroll mengubah tinggi layar → jangan hitung ulang semua trigger
    ST.config({ ignoreMobileResize: true });
  }

  /* ---------------- Language ---------------- */
  let lang = 'id';
  try { const s = localStorage.getItem('kos18-lang'); if (s === 'en' || s === 'id') lang = s; } catch (e) { /* storage blocked */ }
  const t = k => (K.t[lang] && K.t[lang][k]) ?? K.t.id[k] ?? k;
  const L = v => (v && typeof v === 'object' && !Array.isArray(v)) ? (v[lang] ?? v.id) : v;
  const waUrl = msg => `https://wa.me/${K.wa}?text=${encodeURIComponent(msg)}`;
  const fill = (s, o) => s.replace(/\{(\w)\}/g, (_, k) => o[k] ?? '');

  /* ---------------- Icons ---------------- */
  const ICONS = {
    wifi: '<path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1.3" fill="currentColor"/>',
    ac: '<rect x="2.5" y="5" width="19" height="8" rx="2"/><path d="M6 10h12M8 16.5c0 1.5-1 2-1 3.5M12 16.5c0 1.5-1 2-1 3.5M16 16.5c0 1.5-1 2-1 3.5"/>',
    bath: '<path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-2zM6 12V5.5A2.5 2.5 0 0 1 8.5 3c1.2 0 2 .8 2.3 1.8M7 19l-1 2M17 19l1 2"/>',
    clean: '<path d="M14 3l-2 8M8.5 11h7l2.5 10H6l2.5-10zM9 16v5M13 16v5"/><path d="M19 4l.6 1.4L21 6l-1.4.6L19 8l-.6-1.4L17 6l1.4-.6z" fill="currentColor"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    park: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9.5 17V7h3.5a3 3 0 0 1 0 6H9.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    bed: '<path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M3 18v2M21 18v2M6 9V6.5A1.5 1.5 0 0 1 7.5 5h9A1.5 1.5 0 0 1 18 6.5V9"/>'
  };
  const icon = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>`;
  const check = '<svg viewBox="0 0 24 24"><use href="#i-check"/></svg>';

  /* ---------------- Split words (hero title) ---------------- */
  function splitWords(el) {
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const i = document.createElement('span'); i.textContent = part;
            w.appendChild(i); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    return $$('.w > span', el);
  }

  /* ---------------- Rooms ---------------- */
  const roomState = { type: 'A' };
  let slider = null;

  function renderRoom(animate) {
    const R = K.rooms[roomState.type];
    const box = $('#room');
    const tLabel = `${t('room.type')} ${roomState.type}`;
    const hasOld = R.old && R.old > R.price;          // harga coret hanya bila lebih mahal
    const save = hasOld ? Math.round((1 - R.price / R.old) * 100) : 0;
    const msgBook = fill(t('wa.room'), { t: roomState.type, p: rp(R.price) });
    const msgSurvey = fill(t('wa.survey'), { t: roomState.type });

    box.innerHTML = `
      <div class="room__media">
        <div class="slider" id="slider">
          <div class="slider__tag">${tLabel} · ${R.size}</div>
          <div class="slider__count"><span class="cur">1</span> / ${R.photos.length}</div>
          <div class="slider__track">${R.photos.map((p, i) => `<div class="slider__slide${i === 0 ? ' is-current' : ''}"><img src="${img(p.f)}" alt="${tLabel} — ${p[lang]}" ${i ? 'loading="lazy"' : ''} draggable="false"></div>`).join('')}</div>
          <button class="slider__btn slider__prev" aria-label="Prev">‹</button>
          <button class="slider__btn slider__next" aria-label="Next">›</button>
          <div class="slider__cap">${R.photos[0][lang]}</div>
          <div class="slider__dots">${R.photos.map((_, i) => `<button aria-label="${i + 1}"${i === 0 ? ' class="is-active"' : ''}></button>`).join('')}</div>
        </div>
        <div class="thumbs">${R.photos.map((p, i) => `<button${i === 0 ? ' class="is-active"' : ''} title="${p[lang]}"><img src="${img(p.f)}" alt="${p[lang]}" loading="lazy"></button>`).join('')}</div>
      </div>
      <div class="room__info">
        <div class="room__badges">
          <span class="chip chip--teak">${t('room.monthly')}</span>
          <span class="chip">${t('room.nego')} ✓</span>
          <span class="chip chip--ok">● ${t('room.avail')}</span>
        </div>
        <h3 class="room__name">${tLabel}<small>${R.size}</small></h3>
        <p class="room__desc">${t('room.desc' + roomState.type)}</p>
        <div class="price">
          ${hasOld ? `<div class="price__old"><s>${rp(R.old)}</s><span class="price__save">${t('room.save')} ${rp(R.old - R.price)}${t('room.perMonth')} · ${save}%</span></div>` : ''}
          <span class="price__now" data-price="${R.price}">${rp(R.price)}</span><span class="price__per">${t('room.month')}</span>
        </div>
        <p class="feat__title">${t('room.feat')}</p>
        <ul class="feat">${R.feat[lang].map(f => `<li>${check}<span>${f}</span></li>`).join('')}</ul>
        <p class="feat__excl">⚡ ${t('room.excl')}</p>
        <div class="room__ctas">
          <a class="btn btn--teak magnetic" href="${waUrl(msgBook)}" target="_blank" rel="noopener"><svg class="ico" viewBox="0 0 24 24"><use href="#i-wa"/></svg>${t('room.book')}</a>
          <a class="btn btn--ghost magnetic" href="${waUrl(msgSurvey)}" target="_blank" rel="noopener">${t('room.survey')}</a>
        </div>
      </div>`;

    slider = makeSlider($('#slider'), $('.thumbs', box), R.photos.map(p => ({ src: img(p.f), cap: `${tLabel} · ${p[lang]}` })));
    bindMagnetic(box);

    if (animate && G && !reduce) {
      if (animate === 'type') {
        G.from('.room__media', { x: -40, opacity: 0, duration: .8, ease: 'expo.out' });
        G.from('.room__info > *', { y: 26, opacity: 0, duration: .7, stagger: .05, ease: 'expo.out' });
      } else {
        G.from('#slider', { opacity: 0, scale: .97, duration: .6, ease: 'expo.out' });
      }
      const el = $('.price__now', box); const o = { v: hasOld ? R.old : R.price * 0.9 };
      G.to(o, { v: R.price, duration: 1.2, ease: 'power3.out', onUpdate: () => { el.textContent = rp(o.v); } });
    }
  }

  function makeSlider(root, thumbs, list) {
    const track = $('.slider__track', root);
    const slides = $$('.slider__slide', root);
    const dots = $$('.slider__dots button', root);
    const tbs = $$('button', thumbs);
    const cur = $('.cur', root);
    const cap = $('.slider__cap', root);
    let i = 0, timer = null, visible = false;
    const go = n => {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(${-i * 100}%)`;
      slides.forEach((s, k) => s.classList.toggle('is-current', k === i));
      dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
      tbs.forEach((d, k) => d.classList.toggle('is-active', k === i));
      cur.textContent = i + 1;
      if (cap) { cap.classList.remove('is-in'); void cap.offsetWidth; cap.textContent = list[i].cap.split(' · ').pop(); cap.classList.add('is-in'); }
      const tb = tbs[i]; if (tb) thumbs.scrollTo({ left: tb.offsetLeft - thumbs.clientWidth / 2 + tb.clientWidth / 2, behavior: 'smooth' });
    };
    const play = () => { stop(); if (!reduce && visible) timer = setInterval(() => go(i + 1), 4500); };
    const stop = () => { clearInterval(timer); timer = null; };
    $('.slider__prev', root).addEventListener('click', () => { go(i - 1); play(); });
    $('.slider__next', root).addEventListener('click', () => { go(i + 1); play(); });
    dots.forEach((d, k) => d.addEventListener('click', () => { go(k); play(); }));
    tbs.forEach((d, k) => d.addEventListener('click', () => { go(k); play(); }));
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', play);

    // swipe
    let x0 = null, y0 = null, moved = false;
    root.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; x0 = e.clientX; y0 = e.clientY; moved = false; });
    root.addEventListener('pointerup', e => {
      if (x0 === null) return;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { moved = true; go(i + (dx < 0 ? 1 : -1)); play(); }
      x0 = null;
    });
    slides.forEach((s, k) => s.addEventListener('click', () => { if (!moved) openLightbox(list, k); }));

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? play() : stop(); }, { threshold: .4 });
    io.observe(root);
    return { destroy() { stop(); io.disconnect(); } };
  }

  function bindRoomTabs() {
    const wrap = $('.room-tabs');
    $$('.room-tab').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.type === roomState.type) return;
      $$('.room-tab').forEach(x => x.classList.toggle('is-active', x === b));
      wrap.dataset.active = b.dataset.type;
      roomState.type = b.dataset.type;
      if (slider) slider.destroy();
      renderRoom('type');
    }));
  }

  function renderCompare() {
    const v = x => x === true ? `<span class="yes">${check.replace('<svg', '<svg width="20" height="20"')}</span>` : x === false ? '<span class="no">—</span>' : L(x);
    $('#compareTable').innerHTML =
      `<div class="crow"><div></div><div>${t('room.type')} A</div><div>${t('room.type')} B</div></div>` +
      K.compare.map(r => `<div class="crow${r.strong ? ' crow--strong' : ''}"><div>${L(r.k)}</div><div>${v(r.A)}</div><div>${v(r.B)}</div></div>`).join('');
  }

  /* ---------------- Facilities / FAQ / Gallery ---------------- */
  function renderFacilities() {
    $('#facGrid').innerHTML = K.facilities.map((f, i) => `
      <article class="fac reveal-fac">
        <div class="fac__ic">${icon(f.ic)}</div>
        <h3>${f[lang][0]}</h3><p>${f[lang][1]}</p>
      </article>`).join('');
  }

  function renderFaq() {
    const open = $$('.qa').map(q => q.classList.contains('is-open'));
    $('#faqList').innerHTML = K.faq.map((f, i) => `
      <div class="qa${(open.length ? open[i] : i === 0) ? ' is-open' : ''}">
        <button class="qa__q" aria-expanded="false"><span>${f[lang][0]}</span><i class="qa__ic"></i></button>
        <div class="qa__a"><div><p>${f[lang][1]}</p></div></div>
      </div>`).join('');
    $$('.qa').forEach(q => {
      const b = $('.qa__q', q);
      b.setAttribute('aria-expanded', q.classList.contains('is-open'));
      b.addEventListener('click', () => { q.classList.toggle('is-open'); b.setAttribute('aria-expanded', q.classList.contains('is-open')); });
    });
  }

  const routeUrl = (ll, walk) => `https://www.google.com/maps/dir/?api=1&origin=${K.kosLL}&destination=${ll}&travelmode=${walk ? 'walking' : 'driving'}`;
  function renderNearby() {
    const g = $('#nearGrid'); if (!g || !K.nearby) return;
    const unit = lang === 'en' ? 'min' : 'mnt';
    g.innerHTML = K.nearby.map(grp => `
      <div class="ncard">
        <div class="ncard__head"><span class="near__ic">${grp.ic}</span><b>${grp[lang]}</b></div>
        <ul>${grp.items.map((it, j) => `
          <li><a class="nitem" data-g="${K.nearby.indexOf(grp)}" data-j="${j}" href="${routeUrl(encodeURIComponent(it.q || it.ll), it.m === 'walk')}" target="_blank" rel="noopener" title="${lang === 'en' ? 'Open route in Google Maps' : 'Buka rute di Google Maps'}">
            <span class="nitem__e">${it.e}</span>
            <span class="nitem__txt"><b>${it.n}</b><small>${L(it.s)}</small></span>
            <span class="nitem__d"><b>${it.d}</b><small>${it.t} ${unit} ${t(it.m === 'walk' ? 'near.walk' : 'near.ride')}</small></span>
            <i class="nitem__go" aria-hidden="true">↗</i>
          </a></li>`).join('')}</ul>
      </div>`).join('');
    $('#nearOffices').innerHTML = K.offices.map(([n, d, q, ex], k) => `<a class="chip-o" data-o="${k}" href="${routeUrl(encodeURIComponent(q), false)}" target="_blank" rel="noopener"><b>${n}</b>${d}</a>`).join('');
  }

  const galList = () => K.gallery.map(g => ({ src: img(g.f), cap: g[lang] }));
  function renderGallery() {
    const stage = $('#ringStage');
    if (!stage) return;
    if (!$('.rcard', stage)) {
      stage.insertAdjacentHTML('beforeend', K.gallery.map((g, i) => `
        <figure class="rcard" data-i="${i}">
          <img src="${img(g.f)}" alt="" loading="${i < 6 ? 'eager' : 'lazy'}" draggable="false">
        </figure>`).join(''));
    }
    $$('.rcard', stage).forEach((c, i) => { $('img', c).alt = K.gallery[i][lang]; });
    if (window.__ring) window.__ring.caption();
  }

  /* ---------------- Lightbox ---------------- */
  const lb = $('#lightbox'), lbImg = $('img', lb), lbCount = $('.lightbox__count', lb);
  let lbList = [], lbI = 0;
  function showLb(n) {
    lbI = (n + lbList.length) % lbList.length;
    zoomReset();
    lbImg.style.opacity = 0;
    const it = lbList[lbI];
    const pre = new Image(); pre.onload = pre.onerror = () => { lbImg.src = it.src; lbImg.alt = it.cap; lbImg.style.opacity = 1; }; pre.src = it.src;
    lbCount.textContent = `${it.cap} · ${lbI + 1} / ${lbList.length}`;
  }
  /* Catatan: JANGAN pakai body overflow:hidden untuk mengunci scroll — scrollbar hilang → lebar layar
     berubah → ScrollTrigger menghitung ulang pin galeri dengan salah (galeri jadi kosong).
     Scroll halaman dicegah lewat wheel/touchmove di overlay saja. */
  function openLightbox(list, n) { lbList = list; showLb(n); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); }
  function closeLb() { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); zoomReset(); }

  /* ---- Zoom & geser foto ---- */
  const ZMAX = 5;
  let zs = 1, ztx = 0, zty = 0;
  const bar = document.createElement('div');
  bar.className = 'lightbox__zoom';
  bar.innerHTML = '<button data-z="out" aria-label="Zoom out">−</button><button data-z="reset" class="lightbox__pct" aria-label="Reset zoom">100%</button><button data-z="in" aria-label="Zoom in">+</button>';
  lb.appendChild(bar);
  const pct = $('.lightbox__pct', bar);
  lbImg.draggable = false;
  function zoomApply(anim) {
    lbImg.classList.toggle('is-anim', !!anim);
    lbImg.style.transform = `translate(${ztx}px, ${zty}px) scale(${zs})`;
    pct.textContent = Math.round(zs * 100) + '%';
    lb.classList.toggle('is-zoomed', zs > 1.01);
  }
  function zoomClamp() {
    const w = lbImg.offsetWidth * zs, h = lbImg.offsetHeight * zs;
    const mx = Math.max(0, (w - innerWidth) / 2 + 40), my = Math.max(0, (h - innerHeight) / 2 + 40);
    ztx = Math.min(mx, Math.max(-mx, ztx)); zty = Math.min(my, Math.max(-my, zty));
  }
  // zoom dengan titik (px,py) di layar tetap di bawah jari/kursor
  function zoomTo(ns, px = innerWidth / 2, py = innerHeight / 2, anim) {
    ns = Math.min(ZMAX, Math.max(1, ns));
    const cx = innerWidth / 2, cy = innerHeight / 2;
    const lx = (px - cx - ztx) / zs, ly = (py - cy - zty) / zs;
    ztx = px - cx - ns * lx; zty = py - cy - ns * ly; zs = ns;
    if (zs === 1) { ztx = 0; zty = 0; }
    zoomClamp(); zoomApply(anim);
  }
  function zoomReset() { zs = 1; ztx = 0; zty = 0; zoomApply(true); }
  bar.addEventListener('click', e => {
    e.stopPropagation();
    const z = e.target.closest('button'); if (!z) return;
    if (z.dataset.z === 'in') zoomTo(zs * 1.6, undefined, undefined, true);
    if (z.dataset.z === 'out') zoomTo(zs / 1.6, undefined, undefined, true);
    if (z.dataset.z === 'reset') zoomReset();
  });
  // roda mouse = zoom (dan halaman di belakang tidak ikut scroll)
  lb.addEventListener('wheel', e => {
    e.preventDefault();
    if (e.target.closest('.lightbox__zoom, .lightbox__nav, .lightbox__close')) return;
    zoomTo(zs * Math.exp(-e.deltaY * 0.0018), e.clientX, e.clientY);
  }, { passive: false });
  lb.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
  // klik ganda / ketuk ganda = zoom 2.5x ↔ normal
  lb.addEventListener('dblclick', e => { if (e.target !== lbImg) return; zs > 1.01 ? zoomReset() : zoomTo(2.5, e.clientX, e.clientY, true); });

  // geser (1 jari / mouse), cubit (2 jari), swipe ganti foto saat tidak di-zoom
  const pts = new Map();
  let start = null, pinch = null, dragged = false, lastTap = 0;
  lb.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    dragged = false;
    if (pts.size === 1) start = { x: e.clientX, y: e.clientY, tx: ztx, ty: zty };
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: zs };
    }
  });
  lb.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2 && pinch) {
      const [a, b] = [...pts.values()];
      zoomTo(pinch.s * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d, (a.x + b.x) / 2, (a.y + b.y) / 2);
      dragged = true; return;
    }
    if (pts.size === 1 && start) {
      const dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) dragged = true;
      if (zs > 1.01) { ztx = start.tx + dx; zty = start.ty + dy; zoomClamp(); zoomApply(false); }
    }
  });
  const endPtr = e => {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if (pts.size < 2) pinch = null;
    if (pts.size === 0 && start) {
      const dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (zs <= 1.01 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) showLb(lbI + (dx < 0 ? 1 : -1));
      // ketuk ganda di HP
      if (!dragged && e.pointerType === 'touch' && e.target === lbImg) {
        const now = Date.now();
        if (now - lastTap < 300) { zs > 1.01 ? zoomReset() : zoomTo(2.5, e.clientX, e.clientY, true); lastTap = 0; } else lastTap = now;
      }
      start = null;
    }
  };
  lb.addEventListener('pointerup', endPtr);
  lb.addEventListener('pointercancel', endPtr);

  $('.lightbox__close', lb).addEventListener('click', closeLb);
  $('.lightbox__prev', lb).addEventListener('click', e => { e.stopPropagation(); showLb(lbI - 1); });
  $('.lightbox__next', lb).addEventListener('click', e => { e.stopPropagation(); showLb(lbI + 1); });
  // klik di area gelap menutup — tapi tidak setelah menggeser/cubit
  lb.addEventListener('click', e => { if (e.target === lb && !dragged) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showLb(lbI - 1);
    if (e.key === 'ArrowRight') showLb(lbI + 1);
    if (e.key === '+' || e.key === '=') zoomTo(zs * 1.6, undefined, undefined, true);
    if (e.key === '-') zoomTo(zs / 1.6, undefined, undefined, true);
    if (e.key === '0') zoomReset();
  });


  /* ---------------- Pratinjau tempat terdekat ---------------- */
  const ps = $('#psheet'), psFrame = $('#psFrame');
  let psCur = null, psView = 'sv';
  // sv = 'lat,lng,arah' posisi kamera Street View yang sudah diverifikasi menghadap tampak depan
  const svUrl = sv => { const [la, ln, h] = sv.split(','); return `https://www.google.com/maps?layer=c&cbll=${la},${ln}&cbp=12,${h},0,0,0&output=svembed`; };
  const mapUrl = (q, ll) => `https://www.google.com/maps?q=${encodeURIComponent(q || ll)}${/^-?\d/.test(ll) ? `&ll=${ll}` : ''}&z=17&output=embed`;
  function psLoad() {
    if (!psCur) return;
    psFrame.innerHTML = `<iframe title="${psCur.n}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen src="${psView === 'sv' ? svUrl(psCur.sv) : mapUrl(psCur.q, psCur.ll)}"></iframe>`;
    $$('.psheet__tabs button').forEach(b => b.classList.toggle('is-on', b.dataset.v === psView));
  }
  function openPlace(it) {
    psCur = it; psView = it.sv ? 'sv' : 'map';
    $('.psheet__tabs').style.display = it.sv ? '' : 'none';      // tanpa foto terverifikasi → peta saja
    $('#psE').textContent = it.e || '🏢';
    $('#psName').textContent = it.n;
    $('#psSub').textContent = it.s ? L(it.s) : '';
    $('#psDist').textContent = it.d;
    $('#psTime').textContent = it.t ? `${it.t} ${lang === 'en' ? 'min' : 'mnt'} ${t(it.m === 'walk' ? 'near.walk' : 'near.ride')}` : t('near.officeSub');
    $('#psRoute').href = routeUrl(encodeURIComponent(it.q || it.ll), it.m === 'walk');
    $('#psOpen').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(it.q || it.ll)}`;
    psLoad();
    ps.classList.add('is-open'); ps.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
  }
  function closePlace() {
    ps.classList.remove('is-open'); ps.setAttribute('aria-hidden', 'true');
    setTimeout(() => { if (!ps.classList.contains('is-open')) psFrame.innerHTML = ''; }, 350);   // hentikan Street View
    if (lenis) lenis.start();
  }
  $$('.psheet__tabs button').forEach(b => b.addEventListener('click', () => { psView = b.dataset.v; psLoad(); }));
  $('.psheet__x').addEventListener('click', closePlace);
  ps.addEventListener('click', e => { if (e.target === ps) closePlace(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && ps.classList.contains('is-open')) closePlace(); });
  // klik tempat / kawasan kantor → buka panel (link asli tetap jadi cadangan bila JS gagal)
  document.addEventListener('click', e => {
    const a = e.target.closest('.nitem, .chip-o');
    if (!a) return;
    e.preventDefault();
    if (a.classList.contains('nitem')) openPlace(K.nearby[+a.dataset.g].items[+a.dataset.j]);
    else {
      const [n, d, q, ex] = K.offices[+a.dataset.o];
      openPlace({ e: '🏢', n, d, q, ll: q, m: 'ride', s: { id: `${t('place.example')}: ${ex}`, en: `${t('place.example')}: ${ex}` } });
    }
  });

  /* ---------------- Apply language ---------------- */
  let heroWords = [];
  function applyLang(first) {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    heroWords = splitWords($('.intro__line'));
    // paragraf statement: pecah per kata agar bisa menyala satu-satu
    const st = $('.statement__text');
    if (st) st.innerHTML = st.textContent.split(/\s+/).map(w => `<span class="sw">${w}</span>`).join(' ');
    $$('[data-wa="general"]').forEach(a => { a.href = waUrl(t('wa.general')); });
    $$('.lang button').forEach(b => b.classList.toggle('is-active', b.dataset.lang === lang));
    if (slider) slider.destroy();
    renderRoom(false); renderCompare(); renderFacilities(); renderFaq(); renderGallery(); renderNearby();
    if (!first) {
      bindFacHover();
      if (G && !reduce) G.from(heroWords, { yPercent: 110, duration: .9, stagger: .05, ease: 'expo.out' });
      if (ST) ST.refresh();
    }
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang;
    try { localStorage.setItem('kos18-lang', lang); } catch (e) { /* ignore */ }
    applyLang(false);
  }));

  /* ---------------- Nav ---------------- */
  const nav = $('#nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', window.innerWidth > 1080 && y > lastY && y > 500); // HP: menu selalu tampil
    lastY = y;
  }, { passive: true });
  $('#burger').addEventListener('click', () => { document.body.classList.toggle('menu-open'); nav.classList.remove('is-hidden'); });
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
  const secs = $$('main section[id]');
  const navIO = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const box = $('#navLinks');
    $$('a', box).forEach(a => {
      const on = a.getAttribute('href') === '#' + en.target.id;
      a.classList.toggle('is-active', on);
      // HP: geser pill agar menu aktif terlihat (tanpa menggeser halaman)
      if (on && box.scrollWidth > box.clientWidth) box.scrollTo({ left: a.offsetLeft - box.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
    });
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => navIO.observe(s));

  /* ---------------- Magnetic buttons ---------------- */
  function bindMagnetic(scope = document) {
    if (!fine || reduce || !G) return;
    $$('.magnetic', scope).forEach(b => {
      if (b._mag) return; b._mag = 1;
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        G.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4, ease: 'power3.out' });
      });
      b.addEventListener('mouseleave', () => G.to(b, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1, .4)' }));
    });
  }

  /* facility tilt */
  function bindFacHover() {
    if (!fine || reduce || !G) return;
    $$('.fac').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        G.to(c, { rotateY: ((e.clientX - r.left) / r.width - .5) * 8, rotateX: -((e.clientY - r.top) / r.height - .5) * 8, transformPerspective: 800, duration: .5 });
      });
      c.addEventListener('mouseleave', () => G.to(c, { rotateX: 0, rotateY: 0, duration: .7 }));
    });
  }

  /* ---------------- Scroll halus (Lenis, hanya mouse/trackpad) ---------------- */
  let lenis = null;
  if (window.Lenis && G && ST && !reduce && fine) {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ST.update);
    G.ticker.add(time => lenis.raf(time * 1000));
    G.ticker.lagSmoothing(0);
  }
  // semua link #anchor: pakai scroll halus Lenis bila aktif
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---------------- Adegan scroll (sticky + progres) ---------------- */
  const clamp01 = v => Math.min(1, Math.max(0, v));
  const seg = (p, a, b) => clamp01((p - a) / (b - a));
  const easeOut = v => 1 - Math.pow(1 - v, 3);
  const easeInOut = v => v < .5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
  // progres dihitung langsung dari posisi elemen di layar setiap frame scroll
  // (tidak bergantung posisi trigger yang tersimpan → tidak macet bila layout berubah)
  const scenes = [];
  let sceneQueued = false;
  function runScenes() {
    sceneQueued = false;
    const vh = window.innerHeight;
    scenes.forEach(sc => {
      const r = sc.el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;           // jauh dari layar: lewati
      sc.fn(clamp01(-r.top / Math.max(1, sc.el.offsetHeight - sc.vh())));
    });
  }
  const queueScenes = () => { if (!sceneQueued) { sceneQueued = true; requestAnimationFrame(runScenes); } };
  window.addEventListener('scroll', queueScenes, { passive: true });
  window.addEventListener('resize', queueScenes);
  if (lenis) lenis.on('scroll', queueScenes);
  function scene(sel, fn) {
    const el = $(sel);
    if (!el) return;
    // tinggi acuan = tinggi area sticky (100svh) → tetap walau address bar HP muncul/hilang
    const sticky = el.querySelector('[class$="__sticky"]');
    const vh = () => (sticky ? sticky.offsetHeight : window.innerHeight);
    scenes.push({ el, fn, vh });
    const r = el.getBoundingClientRect();
    fn(clamp01(-r.top / Math.max(1, el.offsetHeight - vh())));
  }

  // 1) INTRO: foto layar penuh mengecil jadi kartu → KOS 18 raksasa di belakang → kolase foto
  function introScene() {
    const st = $('.intro__sticky'), card = $('.intro__card'), cimg = $('.intro__card img');
    const [sl, sr] = $$('.intro__side');
    const solid = $$('.intro__title--solid span'), line = $$('.intro__title--line span');
    const shade = $('.intro__shade'), open = $('.intro__open'), copy = $('.intro__copy'), bar = $('.intro__bar span');
    let m = {};
    const measure = () => {
      const vw = st.clientWidth, vh = st.clientHeight;   // ukuran area sticky (stabil di HP)
      const cw = card.offsetWidth, ch = card.offsetHeight;
      const cy = parseFloat(getComputedStyle(st).getPropertyValue('--cy')) / 100 * vh;
      m = { vw, vh, cw, ch, mobile: vw < 700, S0: Math.max(vw / cw, vh / ch) * 1.12, dy: vh / 2 - cy,
            fs: parseFloat(getComputedStyle(solid[0]).fontSize) };
    };
    measure();
    let lastW = window.innerWidth;
    window.addEventListener('resize', () => {
      // di HP, resize karena address bar (lebar sama) diabaikan → kartu tidak melompat
      if (window.innerWidth === lastW && !fine) return;
      lastW = window.innerWidth; measure(); queueScenes();
    });
    const lerp = (a, b, t) => a + (b - a) * t;
    const introEl = $('.intro');
    scene('.intro', p => {
      bar.style.transform = `scaleX(${p})`;
      document.body.classList.toggle('in-intro', introEl.getBoundingClientRect().bottom > window.innerHeight * .35);
      // kartu: layar penuh → kartu
      const k = easeInOut(seg(p, .06, .58));
      card.style.transform = `translate3d(0, ${m.dy * (1 - k)}px, 0) scale(${lerp(m.S0, 1, k)})`;
      cimg.style.transform = `scale(${1.16 - .16 * k})`;
      shade.style.opacity = 1 - seg(p, .06, .4) * .8;
      // sapaan pergi
      const o = seg(p, 0, .14);
      open.style.opacity = 1 - o;
      open.style.transform = `translate3d(0, ${-o * 70}px, 0)`;
      open.style.visibility = o >= 1 ? 'hidden' : 'visible';
      // KOS 18: huruf merapat dari posisi menyebar
      const t = easeOut(seg(p, .28, .72)), n = solid.length, c = (n - 1) / 2;
      for (let i = 0; i < n; i++) {
        const tf = `translate3d(${(i - c) * m.fs * .32 * (1 - t)}px, ${m.fs * .22 * (1 - t)}px, 0)`;
        solid[i].style.transform = tf; solid[i].style.opacity = t;
        line[i].style.transform = tf; line[i].style.opacity = t * .9;
      }
      // dua foto samping meluncur masuk & miring
      const s2 = easeOut(seg(p, .4, .82));
      const fx = m.cw * (m.mobile ? .66 : 1.02), fy = m.ch * (m.mobile ? .06 : .14);
      sl.style.transform = `translate3d(${lerp(-m.vw * .8, -fx, s2)}px, ${lerp(m.ch * .5, fy, s2)}px, 0) rotate(${lerp(-26, -8, s2)}deg)`;
      sr.style.transform = `translate3d(${lerp(m.vw * .8, fx, s2)}px, ${lerp(m.ch * .5, fy, s2)}px, 0) rotate(${lerp(26, 8, s2)}deg)`;
      sl.style.opacity = sr.style.opacity = s2 > 0 ? 1 : 0;
      // info muncul
      const cp = easeOut(seg(p, .7, .9));
      copy.style.opacity = cp;
      copy.style.transform = `translate3d(0, ${(1 - cp) * 30}px, 0)`;
      copy.style.visibility = cp > .02 ? 'visible' : 'hidden';
    });
  }

  // 2) STATEMENT: kata raksasa melintas & terisi, paragraf menyala per kata
  function statementScene() {
    const word = $('.statement__word'), photo = $('.statement__photo'), span = $('.statement__word span');
    scene('.statement', p => {
      const vw = window.innerWidth, ww = word.offsetWidth;
      const x = vw * .55 - (ww + vw * .1) * p;
      word.style.transform = `translate3d(${x}px, -50%, 0)`;
      span.style.setProperty('--fill', (seg(p, .15, .8) * 100) + '%');
      const r = (p - .5) * 14;
      photo.style.transform = `translateY(${(.5 - p) * 120}px) rotate(${r}deg) scale(${.86 + seg(p, 0, .5) * .18})`;
      const words = $$('.statement__text .sw');
      const n = Math.round(seg(p, .2, .85) * words.length);
      words.forEach((s, i) => s.classList.toggle('on', i < n));
    });
  }


  /* ---------------- Galeri cincin 360° (3D semu: tanpa preserve-3d → aman di iPhone) ---------------- */
  function ringGallery() {
    const stage = $('#ringStage'); if (!stage) return;
    const cards = $$('.rcard', stage), n = cards.length, step = 360 / n, cap = $('#ringCap');
    let rot = 0, vel = 0, target = null, dragging = false, hover = false, idleUntil = 0, visible = false, last = 0;
    let R = 400, raf = 0;
    const AUTO = reduce ? 0 : 7;               // derajat per detik (putar pelan ke kanan)
    const size = () => { R = Math.min(stage.clientWidth * (window.innerWidth < 700 ? .36 : .4), 560); };
    size(); window.addEventListener('resize', size);
    const norm = a => ((a % 360) + 540) % 360 - 180;   // -180..180
    const frontIndex = () => { let best = 0, bd = 999; cards.forEach((_, i) => { const d = Math.abs(norm(i * step + rot)); if (d < bd) { bd = d; best = i; } }); return best; };
    let lastFront = -1;
    const caption = () => { const f = frontIndex(); cap.textContent = K.gallery[f][lang]; lastFront = f; };
    function layout() {
      cards.forEach((c, i) => {
        const th = norm(i * step + rot), rad = th * Math.PI / 180;
        const depth = Math.cos(rad), k = (depth + 1) / 2;              // 1 = depan, 0 = belakang
        const x = Math.sin(rad) * R, s = .5 + .5 * k, y = (1 - k) * -26;
        c.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s}) perspective(900px) rotateY(${(-th * .55).toFixed(2)}deg)`;
        c.style.zIndex = Math.round(k * 100);
        c.style.opacity = (.18 + .82 * Math.pow(k, 1.4)).toFixed(3);
        c.style.setProperty('--shade', (1 - k) * .6);
        c.classList.toggle('is-front', Math.abs(th) < step / 2);
      });
      const f = frontIndex(); if (f !== lastFront) caption();
    }
    function tick(t) {
      raf = 0;
      const dt = Math.min(.05, (t - (last || t)) / 1000); last = t;
      if (!dragging) {
        if (target !== null) {
          const d = target - rot; rot += d * Math.min(1, dt * 7);
          if (Math.abs(d) < .05) { rot = target; target = null; vel = 0; }
        } else if (Math.abs(vel) > .5) {                       // luncuran setelah digeser
          rot += vel * dt; vel *= Math.pow(.05, dt);
        } else if (!hover && performance.now() > idleUntil) {   // putar otomatis pelan
          rot += AUTO * dt;
        }
      }
      layout();
      if (visible) raf = requestAnimationFrame(tick);
    }
    const start = () => { if (!raf && visible) { last = 0; raf = requestAnimationFrame(tick); } };
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); }, { threshold: .05 }).observe(stage);
    // geser manual (mouse & sentuh)
    let px = 0, py = 0, moved = 0, lastX = 0, lastT = 0, axis = null;
    stage.addEventListener('pointerdown', e => {
      dragging = true; target = null; vel = 0; moved = 0; axis = null;
      px = lastX = e.clientX; py = e.clientY; lastT = performance.now();
    });
    window.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - px, dy = e.clientY - py;
      if (!axis && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (axis === 'y') { dragging = false; return; }        // gerak vertikal = scroll halaman
      const now = performance.now(), ddx = e.clientX - lastX;
      rot += ddx * (180 / (Math.PI * R)) * 1.1;               // ikuti jari
      vel = ddx / Math.max(1, now - lastT) * 1000 * (180 / (Math.PI * R)) * 1.1;
      lastX = e.clientX; lastT = now; moved += Math.abs(ddx);
      layout();
    }, { passive: true });
    const end = () => { if (!dragging) return; dragging = false; idleUntil = performance.now() + 2500; start(); };
    window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
    stage.addEventListener('mouseenter', () => { hover = true; });
    stage.addEventListener('mouseleave', () => { hover = false; });
    // ketuk: kartu depan → lightbox; kartu lain → putar ke depan
    cards.forEach((c, i) => c.addEventListener('click', () => {
      if (moved > 8) return;
      const th = norm(i * step + rot);
      if (Math.abs(th) < step / 2) openLightbox(galList(), i);
      else { vel = 0; target = rot - th; idleUntil = performance.now() + 4000; start(); }
    }));
    $$('.ring__btn').forEach(b => b.addEventListener('click', () => {
      vel = 0;                                               // hentikan sisa luncuran
      const base = target !== null ? target : rot;
      target = Math.round((base - (+b.dataset.dir) * step) / step) * step;
      idleUntil = performance.now() + 4000; start();
    }));
    stage.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') $(`.ring__btn[data-dir="${e.key === 'ArrowLeft' ? -1 : 1}"]`).click(); });
    layout(); caption();
    window.__ring = { caption };
  }

  function scrollAnims() {
    if (!G || !ST || reduce) {
      $$('.count').forEach(c => { c.textContent = c.dataset.to; });
      $$('.statement__text .sw').forEach(s => s.classList.add('on'));
      return;
    }
    introScene();
    statementScene();
    $$('.reveal').forEach(el => G.from(el, { y: 46, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
    G.from('.ncard', { y: 50, opacity: 0, duration: 1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '#nearGrid', start: 'top 85%' } });
    G.from('.fac', { y: 60, opacity: 0, duration: .9, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: '#facGrid', start: 'top 82%' } });
    $$('.count').forEach(c => {
      const o = { v: 0 };
      G.to(o, { v: +c.dataset.to, duration: 1.8, ease: 'power2.out', onUpdate: () => { c.textContent = Math.round(o.v); }, scrollTrigger: { trigger: c, start: 'top 90%' } });
    });
    // transisi mask antar section (kartu membesar jadi layar penuh)
    ['.rooms', '.cta'].forEach(sel => G.fromTo(sel, { clipPath: 'inset(7% 5% 0% 5% round 48px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: sel, start: 'top bottom', end: 'top 15%', scrub: true } }));
    // parallax: hanya desktop
    const mmPar = G.matchMedia();
    mmPar.add('(min-width: 1081px) and (pointer: fine)', () => {
      $$('.parallax').forEach(el => G.to(el, { yPercent: +el.dataset.speed * 100, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } }));
      G.to('.cta__bg', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
      $$('.scard__img img').forEach(im => G.fromTo(im, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: im, start: 'top bottom', end: 'bottom top', scrub: true } }));
    });
    G.fromTo('.about__img', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.out', stagger: .2, scrollTrigger: { trigger: '.about__media', start: 'top 80%' } });
    G.from('.loc__map', { clipPath: 'circle(0% at 50% 50%)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.loc__map', start: 'top 80%' } });
  }

  // kartu showcase: animasi masuk via CSS (class .is-in) — bukan GSAP, agar tidak bentrok dengan transition hover
  const scards = $$('.scard');
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-scard');
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { threshold: .15 });
    scards.forEach(c => io.observe(c));
  }
  // kartu showcase → pilih tipe kamar lalu scroll ke detail
  $$('.scard').forEach(c => c.addEventListener('click', () => {
    const tab = $(`.room-tab[data-type="${c.dataset.pick}"]`);
    if (tab && !tab.classList.contains('is-active')) tab.click();
  }));

  /* ---------------- Intro setelah loader ---------------- */
  function intro() {
    const waF = $('.wa-float');
    setTimeout(() => waF.classList.add('is-in'), 1600);
    setTimeout(() => { waF.classList.add('show-tip'); setTimeout(() => waF.classList.remove('show-tip'), 4200); }, 6000);
    if (!G || reduce) return;
    G.timeline({ defaults: { ease: 'expo.out' } })
      .from('.intro__card', { opacity: 0, duration: 1.4, ease: 'power2.out' }, 0)
      .from('.nav > *', { y: -30, opacity: 0, duration: 1, stagger: .08 }, .9)
      .from('.intro__kicker', { y: 20, opacity: 0, duration: .9 }, 1)
      .from(heroWords, { yPercent: 115, duration: 1.2, stagger: .06 }, 1.05)
      .from('.intro__scroll', { opacity: 0, y: 20, duration: .8 }, 1.7);
  }

  function hideLoader() {
    const loader = $('#loader');
    $('.loader__bar span').style.width = '100%';
    const done = () => { loader.remove(); document.body.classList.remove('is-loading'); if (lenis) lenis.start(); };
    if (G && !reduce) {
      G.timeline({ delay: .35 })
        .to('.loader__inner', { y: -30, opacity: 0, duration: .5, ease: 'power2.in' })
        .to(loader, { yPercent: -100, duration: 1, ease: 'expo.inOut', onComplete: done }, '-=.1')
        .add(intro, '-=.75');
    } else { done(); intro(); }
  }

  /* ---------------- Boot ---------------- */
  document.body.classList.add('is-loading');
  if (lenis) lenis.stop();
  $('#year').textContent = new Date().getFullYear();
  applyLang(true);
  bindRoomTabs();
  bindMagnetic();
  bindFacHover();
  scrollAnims();
  ringGallery();

  const heroImg = $('.intro__card img');
  const t0 = performance.now();
  let fired = false;
  const go = () => { if (fired) return; fired = true; setTimeout(hideLoader, Math.max(0, 1300 - (performance.now() - t0))); };
  if (heroImg.complete) go(); else { heroImg.addEventListener('load', go); heroImg.addEventListener('error', go); }
  setTimeout(go, 4000); // jaringan lambat: jangan tahan lama
  $('.loader__bar span').style.width = '60%';
  // hitung ulang posisi trigger setelah font & gambar selesai dimuat
  const refresh = () => { if (ST) ST.refresh(); queueScenes(); };
  window.addEventListener('load', () => { window.scrollTo(0, 0); if (lenis) lenis.scrollTo(0, { immediate: true }); refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
})();
