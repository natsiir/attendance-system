import { useState, useEffect } from 'react';
import { Warga, PresensiLog } from '@/types';

export function useWarga() {
  const [warga, setWarga] = useState<Warga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/warga')
      .then((res) => res.json())
      .then((data) => {
        setWarga(data);
        setLoading(false);
      });
  }, []);

  return { warga, loading };
}

export function usePresensi() {
  const [logs, setLogs] = useState<PresensiLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    fetch('/api/presensi')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return { logs, loading, refresh: fetchLogs };
}
