/* Server-safe building blocks shared by every page. */
import Link from 'next/link';
import Pic from './Pic';

export const svgHtml = s => ({__html: s});

export function Bg({cls, k}) {
  return <div className={'bg ' + cls}><Pic k={k} alt="" /></div>;
}

const X = <svg viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.4"><path d="M1 1l10 10M11 1L1 11" /></svg>;
export const CloseIcon = X;

export function Sheet({label, cap, title, actions, children}) {
  return (
    <section className="sheet" aria-label={label || title}>
      <div className="sh-head">
        <div><div className="cap">{cap}</div><h2>{title}</h2></div>
        <div className="actions">{actions}<Link className="close" href="/home" aria-label="Close">{X}</Link></div>
      </div>
      <div className="sh-body">{children}</div>
    </section>
  );
}

export function Foot({meta, tag}) {
  return (
    <div className="foot">
      <div className="tag">{tag && <>Work · Live · <em>Play · Learn</em></>}</div>
      <div className="meta cap" id="meta">{meta}</div>
    </div>
  );
}
