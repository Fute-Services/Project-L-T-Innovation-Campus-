'use client';
/* Location page, ported as-is from the designer's assets/js/location.js (CIGNUS-style).
   Views: Site Location (building render) · Neighbourhood · Connectivity · Airport Connectivity.
   All aerial coordinates are pixels on the 2752 × 1536 Powai aerial. */
import {useEffect, useRef} from 'react';
import {IMG} from './data';

const AERIAL = {local: '/assets/img/photos/powai-aerial.png', remote: 'https://cignus.futeservices.in/assets/img%20location-CAZ29LL2.png', w: 2752, h: 1536};
const LT = [845, 600]; // L&T Innovation Campus, from Google Maps 19.12670 N, 72.89369 E

const TAGS = {
  hood: [{x: 670, y: 382, t: 'JVLR Metro Station', i: 'metro', l: 1}, {x: 1313, y: 1090, t: 'Rambaug Metro Station', i: 'metro'}, {x: 2089, y: 414, t: 'IIT Bombay', i: 'school'}, {x: 2078, y: 1058, t: 'Hiranandani Hospital', i: 'hospital'}, {x: 1893, y: 1288, t: 'Hiranandani Gardens', i: 'park', r: 1}],
};
/* Apple Maps-style POI glyphs: [colour, 20×20 svg] */
/* travel modes shown on the route line: [label, 20×20 svg] */
const MODE = {
  walk: ['Walk', '<circle cx="11" cy="3.5" r="1.8" fill="currentColor"/><path d="M8 18l2-5.5 2.5 2V18M10 12.5l.8-4.5-3 1.5L7 12M10.8 8l2 3 2.2 1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'],
  drive: ['Drive', '<path d="M3.5 12l1.8-4.6A2 2 0 017.2 6h5.6a2 2 0 011.9 1.4L16.5 12v4h-13z" fill="currentColor"/><circle cx="6.5" cy="12.6" r="1.2" fill="#0A84FF"/><circle cx="13.5" cy="12.6" r="1.2" fill="#0A84FF"/><path d="M5 16v1.5M15 16v1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>']
};
const TRAVELLER = {
  walk: MODE.walk[1],
  car: MODE.drive[1],
  bus: '<rect x="4" y="2.5" width="12" height="13" rx="2.5" fill="currentColor"/><rect x="5.5" y="4.5" width="9" height="5" rx="1" fill="#fff"/><circle cx="7" cy="12.5" r="1.1" fill="#fff"/><circle cx="13" cy="12.5" r="1.1" fill="#fff"/><path d="M6 15.5v2M14 15.5v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
};
/* point halfway along a polyline, by length */
const midpoint = pts => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let half = seg.reduce((a, b) => a + b, 0) / 2;
  for (let i = 0; i < seg.length; i++) {
    if (half <= seg[i]) { const t = half / seg[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]; }
    half -= seg[i];
  }
  return pts[pts.length - 1];
};
const GLYPH = {
  metro: ['#0A84FF', '<rect x="5" y="3" width="10" height="11" rx="3" fill="currentColor"/><path d="M7 17l1.5-3M13 17l-1.5-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><rect x="7" y="5.5" width="6" height="3.5" rx="1" fill="#0A84FF"/>'],
  school: ['#BF5AF2', '<path d="M10 4l8 4-8 4-8-4z" fill="currentColor"/><path d="M5.5 10v3.5c1.2 1.2 2.7 1.8 4.5 1.8s3.3-.6 4.5-1.8V10" fill="none" stroke="currentColor" stroke-width="1.6"/>'],
  hospital: ['#FF453A', '<path d="M8 3h4v5h5v4h-5v5H8v-5H3V8h5z" fill="currentColor"/>'],
  park: ['#30D158', '<path d="M10 2c3.5 3 5 6 5 8.5A5 5 0 015 10.5C5 8 6.5 5 10 2z" fill="currentColor"/><path d="M10 9v9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'],
  road: ['#8E8E93', '<path d="M7 2L4 18M13 2l3 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10 3v3M10 9v3M10 15v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'],
  plane: ['#FF9F0A', '<path d="M2 11l6-1 4-7h2l-2 7 5-1 2-2h1l-1 4 1 4h-1l-2-2-5-1 2 7h-2l-4-7-6-1z" fill="currentColor"/>']
};
/* Routes from the campus; each ends at its destination marker. solid = traced on roads in the aerial; dashed = direction only */
const R = {
  ramabaug: {mode: 'walk', name: 'Rambaug Metro', sub: 'Line 6 (upcoming) · 400 m away', km: '0.5 km', tag: {t: 'Rambaug Metro', s: '0.5 km', i: 'metro'}, pts: [[845, 600], [850, 690], [888, 794], [978, 871], [1003, 935], [1032, 1032], [1135, 1101], [1313, 1090]]},
  weh: {mode: 'drive', name: 'Western Express Highway', sub: 'Via JVLR', km: '6 km', tag: {t: 'Western Express Hwy', s: 'Via JVLR · 6 km', i: 'road'}, pts: [[845, 600], [820, 700], [798, 756], [696, 743], [568, 692], [440, 602], [344, 482]]},
  eeh: {mode: 'drive', name: 'Eastern Express Highway', sub: 'Via JVLR', km: '6 km', tag: {t: 'Eastern Express Hwy', s: 'Via JVLR · 6 km', i: 'road'}, pts: [[845, 600], [850, 690], [888, 794], [978, 871], [1003, 935], [1032, 1032], [1135, 1101], [1313, 1090], [1651, 1032]]},
  sakinaka: {mode: 'drive', name: 'Saki Naka Metro', sub: 'Metro Line 1 · via Saki Vihar Road', km: '', dash: 1, tag: {t: 'Saki Naka Metro', s: 'Metro Line 1 · this way', i: 'metro'}, pts: [[845, 600], [798, 756], [696, 743], [520, 860]]},
  bkc: {mode: 'drive', name: 'Bandra-Kurla Complex', sub: 'Via Kurla', km: '11 km', dash: 1, tag: {t: 'Bandra-Kurla Complex', s: 'Via Kurla · 11 km', i: 'road'}, pts: [[845, 600], [798, 756], [696, 743], [520, 860], [400, 999]]},
  airoli: {mode: 'drive', name: 'Airoli', sub: 'Navi Mumbai · via JVLR', km: '15 km', dash: 1, tag: {t: 'Airoli', s: 'Navi Mumbai · 15 km', i: 'road'}, pts: [[845, 600], [850, 690], [888, 794], [978, 871], [1003, 935], [1032, 1032], [1135, 1101], [1313, 1090], [1651, 1032], [1900, 923]]},
  t2: {mode: 'drive', name: 'International Airport', sub: 'Terminal 2 · Sahar', km: '6 km', dash: 1, tag: {t: 'International Airport', s: 'Terminal 2 · 6 km', i: 'plane'}, pts: [[845, 600], [798, 756], [696, 743], [520, 860], [430, 1000], [480, 1150], [520, 1300]]},
  t1: {mode: 'drive', name: 'Domestic Airport', sub: 'Terminal 1 · Santacruz', km: '11 km', dash: 1, tag: {t: 'Domestic Airport', s: 'Terminal 1 · 11 km', i: 'plane'}, pts: [[845, 600], [798, 756], [696, 743], [520, 860], [430, 1000], [330, 1130]]}
};
const VIEWS = {
  site: {},
  hood: {f: [1376, 768], z: 1, tags: 'hood', spot: 340},
  conn: {f: [1376, 768], z: 1, list: ['ramabaug', 'weh', 'eeh', 'sakinaka', 'bkc', 'airoli'], spot: 300},
  air: {f: [760, 900], z: 1.3, list: ['t2', 't1'], title: 'Airport Connectivity', spot: 260}
};
const LTCARD = '<div class="in"><img src="/assets/img/logo-lt-realty.webp" alt="L&amp;T Realty"><b>Innovation Campus</b></div><i></i>';

const load = (img, d) => { img.onerror = () => { if (img.dataset.fb !== '1') { img.dataset.fb = '1'; img.src = d.remote; } }; img.src = d.local; };
const path = p => 'M' + p.map(q => q.join(' ')).join('L');

export default function Location() {
  const root = useRef(null);

  useEffect(() => {
    const $ = s => root.current.querySelector(s), $$ = s => [...root.current.querySelectorAll(s)];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stage = $('#aerial'), svg = $('#aerialSvg'), tagLayer = $('#aerialTags');
    load($('#aerialImg'), AERIAL); load($('#siteImg'), IMG.overview);

    const NS = 'http://www.w3.org/2000/svg';
    const mk = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
    svg.innerHTML = ''; // strict-mode double effect
    svg.setAttribute('viewBox', `0 0 ${AERIAL.w} ${AERIAL.h}`);
    mk('defs', {}).innerHTML = `<radialGradient id="spot" gradientUnits="userSpaceOnUse" cx="${LT[0]}" cy="${LT[1]}" r="340"><stop offset="0" stop-color="#021A30" stop-opacity="0"/><stop offset=".55" stop-color="#021A30" stop-opacity="0"/><stop offset="1" stop-color="#021A30" stop-opacity=".62"/></radialGradient>
      <filter id="rglow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    mk('rect', {x: -2000, y: -2000, width: AERIAL.w + 4000, height: AERIAL.h + 4000, fill: 'url(#spot)'});
    const ring = mk('circle', {cx: LT[0], cy: LT[1], r: 80, fill: 'rgba(10,132,255,.25)', stroke: 'none'});
    if (!reduce) ring.innerHTML = '<animate attributeName="r" values="30;140" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="2.4s" repeatCount="indefinite"/>';
    mk('circle', {cx: LT[0], cy: LT[1], r: 20, fill: '#0A84FF', stroke: '#fff', 'stroke-width': 8, style: 'filter:drop-shadow(0 4px 8px rgba(0,0,0,.4))'});
    const routeLayer = mk('g', {filter: 'url(#rglow)'});

    const conn = $('#conn'), list = $('#connList');
    const base = () => Math.max(innerWidth / AERIAL.w, innerHeight / AERIAL.h);
    // put image point (cx,cy) at screen point (sx,sy), never showing past the image edge
    const setCam = (S, cx, cy, sx, sy, instant) => {
      const x = Math.min(0, Math.max(innerWidth - AERIAL.w * S, sx - cx * S));
      const y = Math.min(0, Math.max(innerHeight - AERIAL.h * S, sy - cy * S));
      stage.style.transition = instant || reduce ? 'none' : 'transform 1.3s cubic-bezier(.65,0,.35,1)';
      stage.style.transform = `translate(${x}px,${y}px) scale(${S})`;
      stage.style.setProperty('--inv', 1 / S);
    };
    const camera = (f, z, instant) => setCam(base() * z, f[0], f[1], innerWidth / 2, innerHeight / 2, instant);
    /* Frame points inside the area left free by the side rails, the list panel and the bottom switcher.
       Padding leaves room for labels (below a marker) and the L&T card (above the campus). */
    const fit = (pts, instant) => {
      const W = innerWidth, H = innerHeight, mob = W <= 1100, panel = !conn.hidden;
      const l = (mob ? 16 : 150) + 90, r = W - (mob ? 16 : panel ? 370 : 40) - 90;
      const t = (mob ? (panel ? H * .26 + 90 : 80) : 100) + 110, b = H - (mob ? 190 : 120) - 70;
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const S = Math.min(Math.max(base(), 1), base() * 2.4, Math.max(base(), Math.min((r - l) / Math.max(x1 - x0, 1), (b - t) / Math.max(y1 - y0, 1))));
      setCam(S, (x0 + x1) / 2, (y0 + y1) / 2, (l + r) / 2, (t + b) / 2, instant);
    };
    let reframe = null;

    const showTags = tags => {
      tagLayer.innerHTML = `<div class="ltcard" style="left:${LT[0]}px;top:${LT[1]}px">${LTCARD}</div>`;
      (tags || []).forEach((d, i) => {
        const n = document.createElement('div');
        const [c, g] = GLYPH[d.i];
        n.className = 'poi' + (d.l ? ' l' : d.r ? ' r' : '');
        n.style.left = d.x + 'px'; n.style.top = d.y + 'px'; n.style.setProperty('--d', (.45 + i * .1) + 's');
        n.innerHTML = `<span class="gl" style="--c:${c}"><svg viewBox="0 0 20 20">${g}</svg></span><span class="tx"><b>${d.t}</b>${d.s ? `<small>${d.s}</small>` : ''}</span>`;
        tagLayer.appendChild(n);
      });
    };

    const drawRoutes = (keys, focus) => {
      routeLayer.innerHTML = '';
      (keys || []).forEach((k, i) => {
        const r = R[k], on = !focus || focus === k;
        // Apple Maps-style route: white casing under a system-blue line
        mk('path', {d: path(r.pts), fill: 'none', stroke: '#fff', 'stroke-width': on ? 22 : 12, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: on ? .95 : .25}, routeLayer);
        const p = mk('path', {d: path(r.pts), fill: 'none', stroke: '#0A84FF', 'stroke-width': on ? 13 : 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: on ? 1 : .35,
          pathLength: 1000, 'stroke-dasharray': r.dash ? '2 26' : '1000', 'stroke-dashoffset': reduce || r.dash ? 0 : 1000}, routeLayer);
        if (!reduce && !r.dash) p.animate([{strokeDashoffset: 1000}, {strokeDashoffset: 0}], {duration: 1600, delay: 500 + i * 140, easing: 'cubic-bezier(.3,.7,.2,1)', fill: 'forwards'});
        if (!reduce && r.dash) p.animate([{opacity: 0}, {opacity: on ? 1 : .3}], {duration: 900, delay: 500 + i * 140, fill: 'backwards'});
      });
    };

    const fillList = keys => {
      list.innerHTML = keys.map(k => `<li><button type="button" data-k="${k}" aria-pressed="false"><span><b>${R[k].name}</b><small>${R[k].sub || ''}</small></span><em>${R[k].km}</em></button></li>`).join('');
      $$('#connList button').forEach(b => b.addEventListener('click', () => pick(b.dataset.k)));
      pick(keys[0]);
    };
    // only the chosen destination's route and marker are shown
    const pick = k => {
      $$('#connList button').forEach(x => x.setAttribute('aria-pressed', x.dataset.k === k));
      const r = R[k], end = r.pts[r.pts.length - 1];
      drawRoutes([k]); showTags([{...r.tag, x: end[0], y: end[1]}]);
      // travel-mode badge on the middle of the line (Apple Maps style)
      const [mx, my] = midpoint(r.pts), [label, icon] = MODE[r.mode];
      const m = document.createElement('div');
      m.className = 'mode'; m.style.left = mx + 'px'; m.style.top = my + 'px';
      m.innerHTML = `<svg viewBox="0 0 20 20">${icon}</svg><b>${label}</b>${r.km ? `<small>${r.km}</small>` : ''}`;
      tagLayer.appendChild(m);
      // little travellers moving along the line: a walker, or a car and a bus
      if (!reduce) {
        const len = r.pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - r.pts[i][0], p[1] - r.pts[i][1]), 0);
        const dur = Math.max(4, len / 160);
        (r.mode === 'walk' ? ['walk'] : ['car', 'bus']).forEach((v, i) => {
          const t = document.createElement('div');
          t.className = 'trav ' + v;
          t.style.offsetPath = `path('${path(r.pts)}')`;
          t.style.animationDuration = dur + 's';
          t.style.animationDelay = (1.6 + i * dur / 2) + 's';
          t.innerHTML = `<span><svg viewBox="0 0 20 20">${TRAVELLER[v]}</svg></span>`;
          tagLayer.appendChild(t);
        });
      }
      reframe = instant => fit(r.pts, instant); reframe();
    };

    let cur = null;
    const go = k => {
      cur = k;
      const V = VIEWS[k];
      $$('#views button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === k));
      document.body.dataset.view = k;
      if (k === 'site') { conn.hidden = true; return; }
      $('#spot').setAttribute('r', V.spot);
      if (V.list) { conn.hidden = false; conn.querySelector('h3').textContent = V.title || 'Connectivity'; fillList(V.list); }
      else {
        conn.hidden = true; showTags(TAGS[V.tags]); drawRoutes(V.routes);
        const pts = [LT, ...TAGS[V.tags].map(d => [d.x, d.y])];
        reframe = instant => fit(pts, instant); reframe();
      }
      try { localStorage.setItem('ltic-loc', k); } catch (e) {}
    };
    const btns = $$('#views button'), onClick = e => go(e.currentTarget.dataset.v);
    btns.forEach(b => b.addEventListener('click', onClick));
    const onResize = () => { if (cur && cur !== 'site' && reframe) reframe(true); };
    addEventListener('resize', onResize);

    document.body.dataset.page = 'location';
    camera([1376, 768], 1, true); showTags(TAGS.hood);
    let start = 'site';
    try { const s = localStorage.getItem('ltic-loc'); if (VIEWS[s]) start = s; } catch (e) {}
    go(start);
    return () => {
      btns.forEach(b => b.removeEventListener('click', onClick));
      removeEventListener('resize', onResize);
      delete document.body.dataset.view; delete document.body.dataset.page;
    };
  }, []);

  return (
    <div ref={root}>
      <div id="siteLayer">
        <img className="stage" id="siteImg" alt="L&T Innovation Campus, digital rendering" />
        <div className="shade" />
        <div className="ltcard" dangerouslySetInnerHTML={{__html: LTCARD}} />
        <div className="siteinfo"><span className="cap">Site location</span><b>L&amp;T Innovation Campus</b><p>Gate No. 2, L&amp;T Powai Campus, Saki Vihar Road, Powai (W), Mumbai</p></div>
      </div>
      <div id="aerialWrap">
        <div id="aerial"><img id="aerialImg" alt="Aerial view of Powai with L&T Innovation Campus highlighted" /><svg id="aerialSvg" aria-hidden="true" /><div id="aerialTags" /></div>
      </div>
      <aside className="conn" id="conn" hidden><h3>Connectivity</h3><ul id="connList" /><p className="note">Distances as published by L&amp;T Realty · Dashed lines show direction</p></aside>
      <nav className="views" id="views" aria-label="Location views">
        {[['site', 'Site Location'], ['hood', 'Neighbourhood'], ['conn', 'Connectivity'], ['air', 'Airport Connectivity']].map(([v, t]) =>
          <button key={v} type="button" data-v={v} aria-pressed={v === 'site'}>{t}</button>)}
      </nav>
    </div>
  );
}
