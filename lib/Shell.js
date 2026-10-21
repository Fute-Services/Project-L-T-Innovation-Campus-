'use client';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {NAV_L, NAV_R, ORDER} from './data';
import {svgHtml} from './ui';

const Tab = ({n, page}) => (
  <Link className="tab" href={'/' + n[0]} aria-current={n[0] === page ? 'true' : undefined}>
    <i><svg viewBox="0 0 20 20" dangerouslySetInnerHTML={svgHtml(n[2])} /></i><span>{n[1]}</span>
  </Link>
);

export default function Shell({children}) {
  const page = usePathname().slice(1) || 'index';
  const router = useRouter();

  useEffect(() => {
    const onKey = e => {
      if (e.target.matches('input,select,textarea')) return;
      if (e.key === 'Escape') {
        if (document.querySelector('.lb:not([hidden])')) return; // gallery closes its own lightbox
        if (page !== 'home' && page !== 'index') router.push('/home');
        return;
      }
      const i = ORDER.indexOf(page); if (i < 0) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') router.push('/' + ORDER[(i + 1) % 12]);
      if (e.key === 'ArrowUp' || e.key === 'PageUp') router.push('/' + ORDER[(i + 11) % 12]);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [page, router]);

  const fs = () => { try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); } catch (e) {} };

  return (
    <>
      <header className="top">
        <div className="brand">
          <Link className="logo" href="/" aria-label="L&T Realty, back to start"><img src="/assets/img/logo-lt-realty.webp" alt="L&T Realty" width="184" height="64" /></Link>
          <div><b>L&amp;T Innovation Campus</b><small className="cap">Powai (W) · Mumbai</small></div>
        </div>
        <div className="utils">
          <button className="u" id="fsBtn" type="button" aria-label="Full screen" title="Full screen" onClick={fs}><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" /></svg></button>
          <Link className="u" href="/home" aria-label="Master plan" title="Master plan"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 8l6-5 6 5M4 7v6h8V7" /></svg></Link>
        </div>
      </header>
      {page !== 'index' && (
        <div className="rails-wrap">
          <nav className="rail l" aria-label="Project">{NAV_L.map(n => <Tab key={n[0]} n={n} page={page} />)}</nav>
          <nav className="rail r" aria-label="Experience">{NAV_R.map(n => <Tab key={n[0]} n={n} page={page} />)}</nav>
        </div>
      )}
      {children}
    </>
  );
}
