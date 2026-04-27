import { useState, useEffect } from 'react';

export function useLiveStatus() {
  const [live, setLive] = useState(0);
  const [ok, setOk] = useState(true);

  useEffect(() => {
    async function fetchLive() {
      try {
        const res = await fetch('/admin/api/live');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setLive(data.sessions?.length || 0);
        setOk(true);
      } catch {
        setOk(false);
      }
    }
    fetchLive();
    const id = setInterval(fetchLive, 10000);
    return () => clearInterval(id);
  }, []);

  return { live, ok };
}
