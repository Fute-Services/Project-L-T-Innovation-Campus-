'use client';
/* Location page, ported as-is from the designer's assets/js/location.js (CIGNUS-style).
   Views: Site Location (building render) · Neighbourhood · Connectivity · Airport Connectivity.
   All aerial coordinates are pixels on the 2752 × 1536 Powai aerial. */
import {useEffect, useRef} from 'react';
import {IMG} from './data';

const AERIAL = {local: '/assets/img/photos/powai-aerial.png', remote: 'https://cignus.futeservices.in/assets/img%20location-CAZ29LL2.png', w: 2752, h: 1536};
const LT = [845, 600]; // L&T Innovation Campus, from Google Maps 19.12670 N, 72.89369 E

const TAGS = {
  hood: [{x: 670, y: 382, t: 'JVLR Metro Station', i: 'metro', l: 1}, {x: 1313, y: 1090, t: 'Rambaug Metro Station', i: 'metro'}, {x: 2089, y: 414, t: 'IIT Bombay', i: 'school'}, {x: 2078, y: 1058, t: 'Hiranandani Hospital', i: 'hospital'}, {x: 1893, y: 1288, t: 'Hiranandani Gardens', i: 'park'}],
};
/* Apple Maps-style POI glyphs: [colour, 20×20 svg] */
const GLYPH = {
  metro: ['#0A84FF', '<rect x="5" y="3" width="10" height="11" rx="3" fill="currentColor"/><path d="M7 17l1.5-3M13 17l-1.5-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><rect x="7" y="5.5" width="6" height="3.5" rx="1" fill="#0A84FF"/>'],
  school: ['#BF5AF2', '<path d="M10 4l8 4-8 4-8-4z" fill="currentColor"/><path d="M5.5 10v3.5c1.2 1.2 2.7 1.8 4.5 1.8s3.3-.6 4.5-1.8V10" fill="none" stroke="currentColor" stroke-width="1.6"/>'],
  hospital: ['#FF453A', '<path d="M8 3h4v5h5v4h-5v5H8v-5H3V8h5z" fill="currentColor"/>'],
  park: ['#30D158', '<path d="M10 2c3.5 3 5 6 5 8.5A5 5 0 015 10.5C5 8 6.5 5 10 2z" fill="currentColor"/><path d="M10 9v9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'],
  road: ['#8E8E93', '<path d="M7 2L4 18M13 2l3 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10 3v3M10 9v3M10 15v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'],
  plane: ['#FF9F0A', '<path d="M2 11l6-1 4-7h2l-2 7 5-1 2-2h1l-1 4 1 4h-1l-2-2-5-1 2 7h-2l-4-7-6-1z" fill="currentColor"/>']
};
/* Routes from the campus. solid = traced on roads in the aerial; dashed = direction only */
const R = {
  ramabaug: {name: 'Rambaug Metro', sub: 'Line 6 (upcoming) · 400 m away', km: '0.5 km', tag: {x: 1313, y: 1090, t: 'Rambaug Metro', s: '0.5 km', i: 'metro'}, pts: [[845, 600], [850, 690], [888, 794], [978, 871], [1003, 935], [1032, 1032], [1135, 1101], [1313, 1090]]},
  weh: {name: 'Western Express Highway', sub: 'Via JVLR', km: '6 km', tag: {x: 696, y: 743, t: 'Towards Western Express Hwy', s: '6 km', i: 'road'}, pts: [[845, 600], [820, 700], [798, 756], [696, 743], [568, 692], [440, 602], [344, 482], [90, 452]]},
  eeh: {name: 'Eastern Express Highway', sub: 'Via JVLR', km: '6 km', tag: {x: 1651, y: 1032, t: 'Towards Eastern Express Hwy', s: '6 km', i: 'road'}, pts: [[845, 600], [850, 690], [888, 794], [978, 871], [1003, 935], [1032, 1032], [1135, 1101], [1313, 1090], [1651, 1032], [2202, 791], [2477, 585], [2560, 560]]},
  sakinaka: {name: 'Saki Naka Metro', sub: 'Metro Line 1 · via Saki Vihar Road', km: '', dash: 1, tag: {x: 520, y: 860, t: 'Towards Saki Naka Metro', i: 'metro'}, pts: [[845, 600], [798, 756], [696, 743], [520, 860], [330, 1080], [180, 1320], [60, 1500]]},
  bkc: {name: 'Bandra-Kurla Complex', sub: 'Via Kurla', km: '11 km', dash: 1, tag: {x: 520, y: 860, t: 'Towards Bandra-Kurla Complex', s: '11 km', i: 'road'}, pts: [[845, 600], [798, 756], [696, 743], [520, 860], [330, 1080], [180, 1320], [60, 1500]]},
  airoli: {name: 'Airoli', sub: 'Navi Mumbai · via JVLR', km: '15 km', dash: 1, tag: {x: 1651, y: 1032, t: 'Towards Airoli', s: '15 km', i: 'road'}, pts: [[845, 600], [850, 690], [888, 794], [978, 871], [1003, 935], [1032, 1032], [1135, 1101], [1313, 1090], [1651, 1032], [2202, 791], [2477, 585], [2740, 430]]},
  t2: {name: 'International Airport', sub: 'Terminal 2 · Sahar', km: '6 km', dash: 1, tag: {x: 520, y: 1290, t: 'International Airport', s: 'Terminal 2 · 6 km', i: 'plane', l: 1}, pts: [[845, 600], [798, 756], [696, 743], [520, 860], [430, 1000], [480, 1150], [520, 1300]]},
  t1: {name: 'Domestic Airport', sub: 'Terminal 1 · Santacruz', km: '11 km', dash: 1, tag: {x: 330, y: 1130, t: 'Domestic Airport', s: 'Terminal 1 · 11 km', i: 'plane'}, pts: [[845, 600], [798, 756], [696, 743], [520, 860], [430, 1000], [330, 1130]]}
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

    const camera = (f, z, instant) => {
      const S = Math.max(innerWidth / AERIAL.w, innerHeight / AERIAL.h) * z;
      const x = Math.min(0, Math.max(innerWidth - AERIAL.w * S, innerWidth / 2 - f[0] * S));
      const y = Math.min(0, Math.max(innerHeight - AERIAL.h * S, innerHeight / 2 - f[1] * S));
      stage.style.transition = instant || reduce ? 'none' : 'transform 1.3s cubic-bezier(.65,0,.35,1)';
      stage.style.transform = `translate(${x}px,${y}px) scale(${S})`;
      stage.style.setProperty('--inv', 1 / S);
    };

    const showTags = tags => {
      tagLayer.innerHTML = `<div class="ltcard" style="left:${LT[0]}px;top:${LT[1]}px">${LTCARD}</div>`;
      (tags || []).forEach((d, i) => {
        const n = document.createElement('div');
        const [c, g] = GLYPH[d.i];
        n.className = 'poi' + (d.l ? ' l' : '');
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
        const e = r.pts[r.pts.length - 1];
        mk('circle', {cx: e[0], cy: e[1], r: on ? 15 : 9, fill: '#fff', stroke: '#0A84FF', 'stroke-width': 7, opacity: on ? 1 : .45}, routeLayer);
      });
    };

    const conn = $('#conn'), list = $('#connList');
    const fillList = keys => {
      list.innerHTML = keys.map(k => `<li><button type="button" data-k="${k}" aria-pressed="false"><span><b>${R[k].name}</b><small>${R[k].sub || ''}</small></span><em>${R[k].km}</em></button></li>`).join('');
      $$('#connList button').forEach(b => b.addEventListener('click', () => pick(b.dataset.k)));
      pick(keys[0]);
    };
    // only the chosen destination's route and marker are shown
    const pick = k => {
      $$('#connList button').forEach(x => x.setAttribute('aria-pressed', x.dataset.k === k));
      drawRoutes([k]); showTags([R[k].tag]);
    };

    let cur = null;
    const go = k => {
      cur = k;
      const V = VIEWS[k];
      $$('#views button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === k));
      document.body.dataset.view = k;
      if (k === 'site') { conn.hidden = true; return; }
      camera(V.f, V.z);
      $('#spot').setAttribute('r', V.spot);
      if (V.list) { conn.hidden = false; conn.querySelector('h3').textContent = V.title || 'Connectivity'; fillList(V.list); } else { conn.hidden = true; showTags(TAGS[V.tags]); drawRoutes(V.routes); }
      try { localStorage.setItem('ltic-loc', k); } catch (e) {}
    };
    const btns = $$('#views button'), onClick = e => go(e.currentTarget.dataset.v);
    btns.forEach(b => b.addEventListener('click', onClick));
    const onResize = () => { if (cur && cur !== 'site') camera(VIEWS[cur].f, VIEWS[cur].z, true); };
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
      <div className="loc-credit">Aerial for representation only</div>
    </div>
  );
}
