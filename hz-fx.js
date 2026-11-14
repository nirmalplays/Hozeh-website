// Shared scroll/pointer effects for Hozeh inner pages. Call initFx() in componentDidMount; returns a cleanup fn.
export function initFx() {
  const doc = document, W = window;
  const q = (s, r) => Array.from((r || doc).querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = W.HZ_HONOR_REDUCED_MOTION === true && W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = W.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const offs = [];
  const on = (t, e, f, o) => { t.addEventListener(e, f, o); offs.push(() => t.removeEventListener(e, f, o)); };
  const fx = []; let ticking = false;
  const run = () => { ticking = false; fx.forEach(f => f()); };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
  on(W, 'scroll', req, { passive: true }); on(W, 'resize', req);

  if (!reduce && 'IntersectionObserver' in W) {
    const vh0 = innerHeight, below = e => e.getBoundingClientRect().top > vh0 * 0.9;
    const ins = q('[data-in]').filter(below), splits = q('[data-split]').filter(below);
    ins.forEach(e => { e.dataset.op = e.style.opacity || '1'; e.style.opacity = '0'; e.style.transform = e.dataset.inx ? `translateX(${e.dataset.inx}px)` : 'translateY(24px)'; });
    splits.forEach(h => q('[data-lni]', h).forEach(l => { l.style.transform = 'translateY(105%)'; }));
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; const t = en.target; io.unobserve(t);
      if (t.hasAttribute('data-split')) q('[data-lni]', t).forEach((l, i) => { l.style.transition = `transform .9s cubic-bezier(.16,1,.3,1) ${0.1 + i * 0.08}s`; l.style.transform = 'none'; });
      else { const d = parseFloat(t.dataset.in) || 0; t.style.transition = `opacity .7s ease-out ${d}s, transform .9s cubic-bezier(.16,1,.3,1) ${d}s`; t.style.opacity = t.dataset.op; t.style.transform = 'none'; }
    }), { rootMargin: '0px 0px -60px 0px' });
    ins.forEach(e => io.observe(e)); splits.forEach(e => io.observe(e)); offs.push(() => io.disconnect());
  }

  q('[data-words]').forEach(p => {
    const ws = q('[data-w]', p);
    if (!fine) ws.forEach(w => { w.style.filter = 'none'; });
    const set = n => ws.forEach((w, i) => {
      const k = Math.round(clamp(n - i, 0, 1) * 20) / 20; if (w._k === k) return; w._k = k;
      w.style.opacity = String(0.12 + 0.88 * k); if (fine) w.style.filter = k >= 1 ? 'none' : `blur(${(1 - k) * 6}px)`;
    });
    if (reduce) { set(ws.length); return; }
    fx.push(() => { const r = p.getBoundingClientRect(), vh = innerHeight; set(clamp((vh * 0.88 - r.top) / (r.height + vh * 0.3), 0, 1) * ws.length); });
  });

  if (fine && !reduce) {
    q('[data-tilt]').forEach(el => {
      const k = parseFloat(el.dataset.tilt) || 6, inner = el.querySelector('[data-tilt-inner]');
      on(el, 'mousemove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1200px) rotateX(${-y * k}deg) rotateY(${x * k}deg)`;
        el.style.setProperty('--hx', ((x + 0.5) * 100) + '%'); el.style.setProperty('--hy', ((y + 0.5) * 100) + '%');
        if (inner) inner.style.transform = `translate3d(${-x * 24}px,${-y * 24}px,0) scale(1.05)`;
      });
      on(el, 'mouseleave', () => { el.style.transform = ''; if (inner) inner.style.transform = ''; });
    });
    const ds = q('[data-depth]'); let mx = 0, my = 0, raf = 0;
    if (ds.length) on(W, 'mousemove', e => {
      mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; ds.forEach(d => { const k = parseFloat(d.dataset.depth) || 10; d.style.transform = `translate3d(${-mx * k}px,${-my * k}px,0)`; }); });
    }, { passive: true });
    const rays = doc.querySelector('[data-rays]');
    if (rays) on(W, 'mousemove', e => { rays.style.transform = `translateX(${(e.clientX / innerWidth - 0.5) * 5}%)`; }, { passive: true });
    const ms = q('[data-magnet]');
    if (ms.length) on(W, 'mousemove', e => ms.forEach(el => {
      const r = el.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.abs(dx) < r.width / 2 + 150 && Math.abs(dy) < r.height / 2 + 150) { el.style.transition = 'transform .3s ease-out'; el.style.transform = `translate3d(${dx / 6}px,${dy / 6}px,0)`; }
      else { el.style.transition = 'transform .6s ease-in-out'; el.style.transform = ''; }
    }), { passive: true });
  }
  if (fine) q('[data-spot]').forEach(c => on(c, 'mousemove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); }));

  q('[data-hovercard]').forEach(c => {
    const p = c.querySelector('[data-hoverpanel]'); if (!p) return;
    const show = () => { p.style.transform = 'none'; p.style.opacity = '1'; }, hide = () => { p.style.transform = 'translateY(110%)'; p.style.opacity = '0'; };
    on(c, 'mouseenter', show); on(c, 'mouseleave', hide); on(c, 'focusin', show); on(c, 'focusout', hide);
    if (!fine) on(c, 'click', e => { if (e.target.closest('a')) return; p.style.opacity === '1' ? hide() : show(); });
  });

  q('[data-stack]').forEach(w => {
    const cards = q('[data-card]', w); if (reduce || cards.length < 2) return; let tops = null, flat = false;
    on(W, 'resize', () => { tops = null; });
    fx.push(() => {
      if (innerWidth < 900) { if (!flat) { flat = true; cards.forEach(c => { c.style.transform = ''; c.style.filter = ''; }); } return; }
      flat = false;
      if (!tops) tops = cards.map(c => parseFloat(getComputedStyle(c).top) || 100);
      const vh = innerHeight, rects = cards.map(c => c.getBoundingClientRect().top);
      cards.forEach((c, i) => {
        let depth = 0;
        for (let j = i + 1; j < cards.length; j++) depth += clamp((vh - rects[j]) / (vh - tops[j]), 0, 1);
        const inc = clamp((rects[i] - tops[i]) / (vh * 0.8), 0, 1);
        c.style.transform = `perspective(1600px) rotateX(${inc * 12}deg) scale(${(1 - depth * 0.05).toFixed(4)})`;
        c.style.filter = depth > 0.05 ? `brightness(${(1 - depth * 0.3).toFixed(3)})` : '';
      });
    });
  });

  q('[data-zoom]').forEach(sec => {
    const m = sec.querySelector('[data-zoom-media]'); if (!m || reduce) return;
    fx.push(() => { const r = sec.getBoundingClientRect(), p = clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1); m.style.transform = `scale(${(1 + p * 0.08).toFixed(4)})`; });
  });

  // Hero screen recede (PageHero)
  q('[data-recede]').forEach(sec => {
    const s = sec.querySelector('[data-recede-screen]'), c = sec.querySelector('[data-recede-content]'); if (!s || reduce) return;
    fx.push(() => {
      const r = sec.getBoundingClientRect(), p = clamp(-r.top / r.height, 0, 1);
      s.style.transform = `perspective(1400px) rotateX(${p * 14}deg) scale(${1 - p * 0.12})`; s.style.borderRadius = `${p * 40}px`;
      if (c) { c.style.transform = `translateY(${-p * 60}px)`; c.style.opacity = String(clamp(1 - p * 1.4, 0, 1)); }
    });
  });

  if (!reduce && 'IntersectionObserver' in W) {
    const cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const io2 = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; io2.unobserve(en.target);
      const el = en.target, fin = el.textContent; let n = 0;
      const t = setInterval(() => {
        n++; el.textContent = fin.split('').map((c, i) => (i < n || c === ' ' || c === '·') ? c : cs[Math.floor(Math.random() * cs.length)]).join('');
        if (n >= fin.length) { clearInterval(t); el.textContent = fin; }
      }, 45);
      offs.push(() => clearInterval(t));
    }));
    q('[data-decrypt]').forEach(e => io2.observe(e)); offs.push(() => io2.disconnect());
  }

  q('[data-type]').forEach(el => {
    const list = el.dataset.type.split('|');
    if (reduce) { el.textContent = list[0]; return; }
    let li = 0, ci = 0, del = false, tid;
    const sch = ms => { tid = setTimeout(step, ms); };
    const step = () => {
      const w = list[li];
      if (!del) { ci++; el.textContent = w.slice(0, ci); if (ci >= w.length) { del = true; return sch(1900); } return sch(55); }
      ci--; el.textContent = w.slice(0, ci); if (ci <= 0) { del = false; li = (li + 1) % list.length; return sch(400); } sch(24);
    };
    sch(700); offs.push(() => clearTimeout(tid));
  });

  if ('IntersectionObserver' in W) {
    const io3 = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) en.target.removeAttribute('data-off'); else en.target.setAttribute('data-off', ''); }), { rootMargin: '200px 0px' });
    q('section, [data-offpause]').forEach(e => io3.observe(e)); offs.push(() => io3.disconnect());
  }

  run(); on(W, 'load', req);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(req);
  return { cleanup: () => offs.forEach(f => f()), addFx: f => { fx.push(f); req(); }, on, reduce, fine, clamp, q };
}
