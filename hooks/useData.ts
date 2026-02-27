import { useState, useEffect } from 'react';
import { Warga, PresensiLog } from '@/types';

export function useWarga() {
  const [warga, setWarga] = useState<Warga[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWarga = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/warga', { credentials: 'include' });
      if (!res.ok) {
        setWarga([]);
        return;
      }

      const data = await res.json();
      setWarga(Array.isArray(data) ? data : []);
    } catch {
      setWarga([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarga();
  }, []);

  return { warga, loading, refresh: fetchWarga, setWarga };
}

export function usePresensi() {
  const [logs, setLogs] = useState<PresensiLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/presensi', { credentials: 'include' });
      if (!res.ok) {
        setLogs([]);
        return;
      }

      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return { logs, loading, refresh: fetchLogs, setLogs };
}
