'use client';
import {useEffect, useRef, useState} from 'react';
import {IMG} from './data';

/* Loads the local copy first, falls back to the L&T Realty site. */
export default function Pic({k, d, imgRef, ...p}) {
  const x = d || IMG[k];
  const [bad, setBad] = useState(null);
  const r = useRef(null);
  const src = x.local && bad !== x.local ? x.local : x.remote;
  const fail = () => { if (x.remote && src !== x.remote) setBad(x.local); };
  // an SSR'd <img> can fail before hydration attaches onError
  useEffect(() => { const el = r.current; if (el && el.complete && !el.naturalWidth) fail(); });
  return <img alt={x.c || ''} {...p} src={src} onError={fail}
    ref={el => { r.current = el; if (imgRef) imgRef.current = el; }} />;
}
