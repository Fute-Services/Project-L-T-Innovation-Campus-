import Link from 'next/link';
import {Bg} from '../lib/ui';
import {Intro} from '../lib/widgets';

export const metadata = {title: 'Welcome'};

export default function Page() {
  return (
    <>
      <Bg cls="kb" k="facade" />
      <div className="credit">Digital rendering</div>
      <div className="hero">
        <div className="eyebrow">Work · Live · Play · Learn</div>
        <h1>L&amp;T Innovation Campus<small>Powai (W), Mumbai</small></h1>
        <Link className="enter" href="/home"><span className="dot"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8h10M9 4l4 4-4 4" /></svg></span><span>Explore</span></Link>
      </div>
      <Intro />
    </>
  );
}
