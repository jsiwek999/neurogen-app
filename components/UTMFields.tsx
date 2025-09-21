'use client';
import { useEffect, useMemo, useState } from 'react';

function getParams() {
  try {
    const url = new URL(window.location.href);
    const q = url.searchParams;
    return {
      utm_source:  q.get('utm_source')  || '',
      utm_medium:  q.get('utm_medium')  || '',
      utm_campaign:q.get('utm_campaign')|| '',
      utm_term:    q.get('utm_term')    || '',
      utm_content: q.get('utm_content') || '',
      referer_url: document.referrer || '',
    };
  } catch { return { utm_source:'',utm_medium:'',utm_campaign:'',utm_term:'',utm_content:'',referer_url:'' }; }
}

export default function UTMFields() {
  const [vals, setVals] = useState(() => getParams());
  useEffect(() => setVals(getParams()), []);
  const entries = useMemo(() => Object.entries(vals), [vals]);

  return (
    <>
      {entries.map(([k,v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
    </>
  );
}
