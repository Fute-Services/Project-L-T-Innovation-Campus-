'use client';
/* Interactive pieces, ported from the old assets/js/app.js. */
import {useCallback, useEffect, useRef, useState} from 'react';
import Pic from './Pic';
import {Foot, Sheet, svgHtml} from './ui';
import {AMENITIES, BROCHURE_PDF, CHAPTERS, HOT, ICON, IMG, PAGES, PICS, PROGRESS, WALKTHROUGH_VIDEO} from './data';

const Seg = ({opts, val, set}) => (
  <div className="seg">{opts.map(([k, l]) =>
    <button key={k} type="button" aria-pressed={k === val} onClick={() => set(k)}>{l}</button>)}</div>
);
const pad = n => String(n).padStart(2, '0');

/* ================= INDEX ================= */
/* Slot-machine number: each digit's reel spins two full turns, then stops on its digit. */
const REEL = '0123456789'.repeat(3).split('');
function Slot({value}) {
  return (
    <em aria-label={value}>{value.split('').map((d, i) =>
      <span key={i} className="slot" aria-hidden="true">
        <span className="reel" style={{'--n': 20 + +d, animationDelay: `${.3 + i * .1}s`}}>{REEL.map((r, j) => <span key={j}>{r}</span>)}</span>
      </span>)}</em>
  );
}

export function Intro() {
  const [gone, setGone] = useState(false);
  const [swipe, setSwipe] = useState(false);
  // slide the yellow circle to the far end of the pill, then dismiss the intro
  const begin = e => {
    if (swipe) return;
    const b = e.currentTarget, dot = b.querySelector('.dot');
    b.style.setProperty('--x', (b.clientWidth - dot.offsetWidth - 2 * dot.offsetLeft) + 'px');
    setSwipe(true);
    setTimeout(() => { setGone(true); document.body.classList.add('entered'); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450);
  };
  // hero animations replay each time the intro is shown again
  useEffect(() => () => document.body.classList.remove('entered'), []);
  return (
    <div className={'intro' + (gone ? ' gone' : '')} id="intro">
      <div className="intro-in">
        <div className="legacy-head">
          <div><img className="lg-logo" src="/assets/img/logo-lt-realty.webp" alt="L&T Realty" width="220" height="77" style={{display: 'block', width: 220, height: 'auto'}} /><h1><span className="ln"><span>Built on a legacy</span></span><span className="ln"><span>that began in <Slot value="1938" /></span></span></h1></div>
          <p className="lede" style={{maxWidth: '40ch', color: '#D6E2EE'}}>L&amp;T Realty brings Larsen &amp; Toubro&apos;s engineering and construction excellence to homes, offices and city-scale developments.</p>
        </div>
        <div className="pillars">
          <div className="pil" style={{animationDelay: '.55s'}}><b>80+</b><p>Years of engineering and construction leadership in India</p></div>
          <div className="pil" style={{animationDelay: '.65s'}}><b>Pan India</b><p>Projects across India&apos;s leading metros</p></div>
          <div className="pil" style={{animationDelay: '.75s'}}><b>LEED</b><p>Platinum-rated green building at Innovation Campus</p></div>
          <div className="pil" style={{animationDelay: '.85s'}}><b>Grade A</b><p>IT/ITeS campus for future-ready enterprises</p></div>
        </div>
        <div className="verticals"><span>Commercial</span><span>Residential</span><span>Retail</span><span>Mixed-use</span></div>
        <button className={'enter' + (swipe ? ' swipe' : '')} id="begin" type="button" onClick={begin}><span className="dot"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8h10M9 4l4 4-4 4" /></svg></span><span>Enter Innovation Campus</span></button>
      </div>
    </div>
  );
}

/* ================= HOME: hotspots on the overview render ================= */
export function MasterPlan() {
  const stage = useRef(null);
  const [pos, setPos] = useState([]);
  const [animReady, setAnimReady] = useState(false);
  const [sel, setSel] = useState(-1);

  const place = useCallback(() => {
    const el = stage.current;
    const cw = window.innerWidth, ch = window.innerHeight;
    const nw = el?.naturalWidth || 2064, nh = el?.naturalHeight || 1152;
    const imgRatio = nw / nh;
    const containerRatio = cw / ch;
    let rw, rh, rx, ry;
    if (containerRatio > imgRatio) {
      rw = cw; rh = cw / imgRatio; rx = 0; ry = (ch - rh) / 2;
    } else {
      rh = ch; rw = ch * imgRatio; rx = (cw - rw) / 2; ry = 0;
    }
    setPos(HOT.map(h => ({ left: rx + h.x * rw, top: ry + h.y * rh })));
  }, []);

  useEffect(() => {
    place();
    const t = setTimeout(() => { place(); setAnimReady(true); }, 80);
    addEventListener('resize', place);
    return () => { removeEventListener('resize', place); clearTimeout(t); };
  }, [place]);

  const h = HOT[sel];
  return (
    <>
      <Pic k="overview" className="stage" id="stage" alt="L&T Innovation Campus, digital rendering" imgRef={stage} onLoad={() => { place(); setAnimReady(true); }} />
      <div className="shade"></div>
      <div id="hots">{pos.length > 0 && HOT.map((h, i) =>
        <button key={i} type="button" className={'hot' + (animReady ? ' anim-play' : '') + (i === sel ? ' on' : '')} style={{...pos[i], '--delay': (i * 0.32) + 's'}} onClick={() => setSel(i)}>
          <span className="dot"></span>
          <span className="line"></span>
          <b>{h.t}</b>
        </button>)}</div>
      <aside className="card" id="card" aria-live="polite">
        {h ? <><div className="cap">{h.k}</div><h3>{h.t}</h3><p>{h.d}</p></>
           : <><div className="cap">Explore the campus</div><h3>Select a point</h3><p>Tap a marker on the building to see what each part of Innovation Campus offers.</p></>}
      </aside>
    </>
  );
}

const F = {fontFamily: 'Montserrat, Arial, sans-serif'};

/* ================= AMENITIES ================= */
export function Amenities() {
  const [f, setF] = useState('all');
  return (
    <Sheet cap="Campus life" title="Amenities"
      actions={<Seg opts={[['all', 'All'], ['work', 'Work'], ['well', 'Wellbeing'], ['green', 'Green']]} val={f} set={setF} />}>
      <div className="am-list" id="amList">{AMENITIES.filter(a => f === 'all' || a[0] === f).map(a =>
        <article key={a[2]} className="am"><span className="i"><svg viewBox="0 0 20 20" dangerouslySetInnerHTML={svgHtml(ICON[a[1]])} /></span><h3>{a[2]}</h3><p>{a[3]}</p></article>)}</div>
    </Sheet>
  );
}

/* ================= CONSTRUCTION (sample data) ================= */
export function Progress() {
  const [go, setGo] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => requestAnimationFrame(() => setGo(true))); return () => cancelAnimationFrame(id); }, []);
  return (
    <div id="prog">{PROGRESS.map(p =>
      <div key={p[0]} className="pr"><div><div className="nm">{p[0]}</div><div className="cap" style={{fontSize: 9}}>{p[2]}</div></div>
        <div className="bar"><i className={p[1] >= 100 ? 'done' : ''} style={{transform: `scaleX(${go ? p[1] / 100 : 0})`}} /></div>
        <div className="pc">{p[1]}%</div></div>)}</div>
  );
}

/* ================= GALLERY ================= */
const LAYOUT = ['w2 h2', 'w2 h2', '', '', '', '', 'w2', 'w2'];
export function Gallery() {
  const [open, setOpen] = useState(null);
  useEffect(() => {
    const k = e => { if (e.key === 'Escape') setOpen(null); };
    document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k);
  }, []);
  return (
    <>
      <div className="gal" id="gal">{PICS.map((d, i) =>
        <figure key={i} className={'g ' + (LAYOUT[i] || '')} tabIndex={0} onClick={() => setOpen(d)} onKeyDown={e => { if (e.key === 'Enter') setOpen(d); }}>
          <Pic d={d} alt="" /><figcaption>{d.c} · Digital rendering</figcaption></figure>)}</div>
      <div className="lb" id="lb" hidden={!open} onClick={e => { if (e.target === e.currentTarget) setOpen(null); }}>
        <button className="u x" id="lbX" type="button" aria-label="Close" onClick={() => setOpen(null)}><svg viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.4"><path d="M1 1l10 10M11 1L1 11" /></svg></button>
        {open && <div style={{width: '100%', textAlign: 'center'}}><Pic key={open.c} d={open} id="lbI" /><p className="cap" id="lbCap" style={{marginTop: 14, color: '#fff'}}>{open.c} · Digital rendering</p></div>}
      </div>
    </>
  );
}

/* ================= VR (drag to pan the façade render) ================= */
export function VR() {
  const vrRef = useRef(null), imRef = useRef(null), needle = useRef(null);
  useEffect(() => {
    const vr = vrRef.current, im = imRef.current;
    let x = 0, drag = null, auto = !matchMedia('(prefers-reduced-motion: reduce)').matches, dir = -1;
    const span = () => Math.max(0, im.clientWidth - vr.clientWidth);
    const set = v => { x = Math.max(-span(), Math.min(0, v)); im.style.transform = `translateX(${x}px)`; needle.current.style.transform = `rotate(${span() ? (-x / span()) * 180 - 90 : 0}deg)`; };
    const down = e => { drag = e.clientX; auto = false; vr.setPointerCapture(e.pointerId); };
    const move = e => { if (drag === null) return; set(x + (e.clientX - drag)); drag = e.clientX; };
    const up = () => { drag = null; };
    const load = () => set(-span() / 2), resize = () => set(x);
    vr.addEventListener('pointerdown', down); vr.addEventListener('pointermove', move); vr.addEventListener('pointerup', up);
    im.addEventListener('load', load); addEventListener('resize', resize);
    if (im.complete) load();
    const t = setInterval(() => { if (!auto) return; if (x <= -span()) dir = 1; if (x >= 0) dir = -1; set(x + dir * .6); }, 16);
    return () => { clearInterval(t); vr.removeEventListener('pointerdown', down); vr.removeEventListener('pointermove', move); vr.removeEventListener('pointerup', up); im.removeEventListener('load', load); removeEventListener('resize', resize); };
  }, []);
  return (
    <div className="vr" id="vr" ref={vrRef}><Pic k="facade" id="vrImg" alt="" draggable="false" imgRef={imRef} /><div className="compass"><i id="needle" ref={needle}></i></div><div className="hint cap" style={{color: '#fff'}}>Drag to look around</div></div>
  );
}

/* ================= BROCHURE ================= */
function BookPage({p, i}) {
  if (p.cover) return (
    <div className="pg cover"><div className="ph"><Pic k={p.img} alt="" /></div><div className="in"><img src="/assets/img/logo-lt-realty.webp" alt="L&T Realty" style={{width: '62%', display: 'block', margin: '0 auto 18px'}} /><h3>{p.t}</h3><p style={{color: 'var(--yellow)', letterSpacing: '.3em', textTransform: 'uppercase', fontSize: 10, marginTop: 8}}>{p.s}</p></div></div>
  );
  return (
    <div className="pg"><span className="pc">{p.n}</span><h3>{p.t}</h3>{p.img && <div className="ph"><Pic k={p.img} alt="" /></div>}<p>{p.p}</p><span className="pn">{pad(i + 1)}</span></div>
  );
}
export function Brochure() {
  const [s, setS] = useState(0);
  return (
    <>
      <div className="book" id="book"><BookPage key={s * 2} p={PAGES[s * 2]} i={s * 2} /><BookPage key={s * 2 + 1} p={PAGES[s * 2 + 1]} i={s * 2 + 1} /></div>
      <div className="bk-nav">
        <button className="close" id="bkPrev" type="button" aria-label="Previous spread" onClick={() => setS((s + 2) % 3)}><svg viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.4" fill="none"><path d="M8 1L3 6l5 5" /></svg></button>
        <span className="num cap" id="bkNum">{s + 1} / 3</span>
        <button className="close" id="bkNext" type="button" aria-label="Next spread" onClick={() => setS((s + 1) % 3)}><svg viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.4" fill="none"><path d="M4 1l5 5-5 5" /></svg></button>
        {BROCHURE_PDF && <a href={BROCHURE_PDF} target="_blank" rel="noopener" className="seg"><button type="button" aria-pressed="true">View PDF</button></a>}
      </div>
    </>
  );
}

/* ================= WALKTHROUGH ================= */
const secs = t => { const [m, s] = (t || '0:0').split(':'); return +m * 60 + +s; };
const PLAY = <svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2l10 6-10 6z" /></svg>;
const PAUSE = <svg viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3" width="2.4" height="10" /><rect x="9.6" y="3" width="2.4" height="10" /></svg>;
export function Walkthrough() {
  const [idx, setIdx] = useState(0);
  const [bar, setBar] = useState(WALKTHROUGH_VIDEO ? 0 : 100 / CHAPTERS.length);
  const [playing, setPlaying] = useState(false);
  const video = useRef(null);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setIdx(i => (i + 1) % CHAPTERS.length), 4000);
    return () => clearInterval(t);
  }, [playing]);
  useEffect(() => { if (!WALKTHROUGH_VIDEO) setBar((idx + 1) / CHAPTERS.length * 100); }, [idx]);

  const pick = i => {
    if (!WALKTHROUGH_VIDEO) return setIdx(i);
    const v = video.current; v.currentTime = secs(CHAPTERS[i][1]); v.play().catch(() => {});
  };
  const onTime = () => {
    const v = video.current; setBar(v.currentTime / (v.duration || 1) * 100);
    let k = 0; CHAPTERS.forEach((c, i) => { if (v.currentTime >= secs(c[1])) k = i; }); setIdx(k);
  };

  return (
    <div className="grid2" style={{gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)'}}>
      <div>
        <div className="frame" id="wkFrame">
          {WALKTHROUGH_VIDEO
            ? <video ref={video} src={WALKTHROUGH_VIDEO} controls playsInline preload="metadata" onTimeUpdate={onTime} />
            : <>
                {/* key remount restarts the Ken Burns animation */}
                <Pic key={idx} d={CHAPTERS[idx][2]} id="wkImg" alt="" className="kb" style={{objectPosition: idx % 2 ? '30% 50%' : '65% 45%'}} />
                <div className="over"><button className="play" id="wkPlay" type="button" aria-label={playing ? 'Pause walkthrough' : 'Play walkthrough'} onClick={() => setPlaying(!playing)}>{playing ? PAUSE : PLAY}</button></div>
              </>}
        </div>
        <div className="scrub"><i id="wkBar" style={{width: bar + '%'}}></i></div>
      </div>
      <ol className="chapters" id="chap">{CHAPTERS.map((c, i) =>
        <li key={i} className={i === idx ? 'on' : undefined} onClick={() => pick(i)}><span className="t">{c[1] || pad(i + 1)}</span><span className="n">{c[0]}</span><span className="t">{pad(i + 1)}</span></li>)}</ol>
    </div>
  );
}

/* ================= CIRCULATION ================= */
const CIR = [['all', 'All'], ['veh', 'Vehicular'], ['ped', 'Pedestrian'], ['svc', 'Service']];
export function Circulation() {
  const [f, setF] = useState('all');
  const R = ({c, d, s}) => <path className="route" data-f={c} stroke={s} d={d} style={{opacity: f === 'all' || f === c ? 1 : .08}} />;
  return (
    <>
      <Sheet cap="Site movement" title="Circulation" actions={<Seg opts={CIR} val={f} set={setF} />}>
        <div className="plan"><svg viewBox="0 0 800 450" aria-label="Schematic site circulation plan">
          <defs><pattern id="gp" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,.04)" /></pattern></defs>
          <rect width="800" height="450" fill="url(#gp)" />
          <rect x="0" y="392" width="800" height="36" fill="rgba(255,255,255,.07)" />
          <text x="20" y="417" fill="#A9B9CA" {...F} fontSize="10" fontWeight="600" letterSpacing="3">SAKI VIHAR ROAD</text>
          <rect x="60" y="40" width="680" height="330" fill="none" stroke="rgba(255,199,27,.45)" strokeDasharray="4 5" />
          <rect x="300" y="90" width="300" height="170" fill="rgba(7,81,140,.55)" stroke="#FFC71B" strokeWidth="1.5" />
          <text x="450" y="170" textAnchor="middle" fill="#FFFFFF" {...F} fontSize="13" fontWeight="500" letterSpacing="3">OFFICE TOWER</text>
          <text x="450" y="190" textAnchor="middle" fill="#A9B9CA" {...F} fontSize="9" letterSpacing="2">GRAND ENTRANCE · SOUTH</text>
          <rect x="380" y="260" width="140" height="26" fill="rgba(255,199,27,.18)" stroke="rgba(255,199,27,.6)" />
          <text x="450" y="277" textAnchor="middle" fill="#FFC71B" {...F} fontSize="9" fontWeight="600" letterSpacing="2">DROP-OFF</text>
          <rect x="90" y="290" width="150" height="56" fill="rgba(127,181,154,.16)" stroke="rgba(127,181,154,.5)" />
          <text x="165" y="322" textAnchor="middle" fill="#7FB59A" {...F} fontSize="9" fontWeight="600" letterSpacing="2">LANDSCAPE</text>
          <rect x="640" y="300" width="80" height="50" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.3)" />
          <text x="680" y="320" textAnchor="middle" fill="#A9B9CA" {...F} fontSize="8.5" fontWeight="600" letterSpacing="1.5">RAMP B1</text>
          <text x="150" y="446" textAnchor="middle" fill="#FFFFFF" {...F} fontSize="9" fontWeight="600" letterSpacing="2">GATE NO. 2</text>
          <R c="veh" s="#FFC71B" d="M150 410V330H330V300H570V300H680V350" />
          <R c="veh" s="#FFC71B" d="M680 350V380H720V410" />
          <R c="ped" s="#FFFFFF" d="M110 410L110 360L300 360L380 300L450 262" />
          <R c="ped" s="#FFFFFF" d="M240 318H300" />
          <R c="svc" s="#E08A6D" d="M760 410V60H600V90" />
          <circle cx="150" cy="392" r="6" fill="#FFC71B" /><circle cx="760" cy="392" r="6" fill="#E08A6D" />
          <text x="790" y="446" textAnchor="end" fill="#E08A6D" {...F} fontSize="9" fontWeight="600" letterSpacing="2">SERVICE ENTRY</text>
        </svg></div>
        <div className="legend"><span><i style={{background: '#FFC71B'}}></i>Vehicular</span><span><i style={{background: '#FFFFFF'}}></i>Pedestrian</span><span><i style={{background: '#E08A6D'}}></i>Service</span></div>
        <p className="note">Schematic for presentation · Confirm against the approved site plan</p>
      </Sheet>
      <Foot meta={'Circulation · ' + CIR.find(c => c[0] === f)[1]} />
    </>
  );
}

/* ================= DRONE VIEW HUD ================= */
const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
export function Hud() {
  const [s, setS] = useState(0);
  useEffect(() => { const t0 = Date.now(); const t = setInterval(() => setS((Date.now() - t0) / 1000), 400); return () => clearInterval(t); }, []);
  const deg = Math.round((42 + s * 1.2) % 360);
  return (
    <div className="hud" id="hud" aria-hidden="true">
      <i className="c tl"></i><i className="c tr"></i><i className="c bl"></i><i className="c br"></i>
      <div className="read">
        <div><span>Altitude</span><b className="num" id="alt">{s ? 118 + Math.round(Math.sin(s / 3) * 4) : 120} m</b></div>
        <div><span>Heading</span><b className="num" id="hdg">{String(deg).padStart(3, '0')}° {DIRS[Math.round(deg / 45) % 8]}</b></div>
        <div><span>Lens</span><b className="num">24 mm</b></div>
      </div>
      <div className="rec"><i></i>LIVE</div>
    </div>
  );
}
