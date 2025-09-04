import { useEffect, useRef, useState } from 'react';

export function useArduinoStream(url: string = 'http://localhost:4000/api/arduino/stream') {
  const [latest, setLatest] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(url);
    esRef.current = es;
    es.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data);
        if (payload?.line) setLatest(payload.line as string);
      } catch (_) {}
    };
    es.onerror = () => {
      es.close();
      esRef.current = null;
    };
    return () => {
      es.close();
      esRef.current = null;
    };
  }, [url]);

  return { latest };
}


