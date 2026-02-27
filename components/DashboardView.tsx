"use client";

import { useMemo, useState } from 'react';
import { useWarga, usePresensi } from '@/hooks/useData';
import { StatCard, Button, Card } from '@/components/UI';
import { Users, CheckCircle, XCircle, Search, Calendar, FileText, LogOut, ClipboardList, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cn } from '@/lib/utils';

export const DashboardView = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const { warga, loading: loadingWarga, refresh: refreshWarga, setWarga } = useWarga();
  const { logs, loading: loadingLogs, refresh, setLogs } = usePresensi();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarga, setSelectedWarga] = useState<any>(null);
  const [status, setStatus] = useState<'Hadir' | 'Izin'>('Hadir');
  const [keterangan, setKeterangan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newId, setNewId] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newKelompok, setNewKelompok] = useState('');
  const [newGelombang, setNewGelombang] = useState('');
  const [newAlamat, setNewAlamat] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const normalizeKey = (value: string) => value.trim().toLowerCase();


  const todaysAttendanceMap = useMemo(() => {
    const attendanceById = new Map<string, typeof logs[number]>();
    const attendanceByName = new Map<string, typeof logs[number]>();

    logs
      .filter((l) => l.tanggal === selectedDate)
      .forEach((l) => {
        if (l.id) attendanceById.set(normalizeKey(l.id), l);
        if (l.nama) attendanceByName.set(normalizeKey(l.nama), l);
      });

    return { attendanceById, attendanceByName };
  }, [logs, selectedDate]);

  const filteredWarga = warga.filter((w) => {
    const query = searchTerm.toLowerCase();
    return (
      w.nama.toLowerCase().includes(query) ||
      w.kelompok.toLowerCase().includes(query) ||
      w.id.toLowerCase().includes(query)
    );
  });

  const stats = {
    total: warga.length,
    hadir: logs.filter((l) => l.tanggal === selectedDate && l.status === 'Hadir').length,
    izin: logs.filter((l) => l.tanggal === selectedDate && l.status === 'Izin').length,
  };

  const closeAttendanceModal = () => {
    setIsModalOpen(false);
    setSelectedWarga(null);
    setStatus('Hadir');
    setKeterangan('');
  };

  const handlePresensi = async () => {
    if (!selectedWarga) return;
    setSubmitting(true);

    const payload = {
      id: selectedWarga.id,
      nama: selectedWarga.nama,
      tanggal: selectedDate,
      status,
      keterangan: status === 'Izin' ? keterangan : '-',
    };

    try {
      const res = await fetch('/api/presensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Gagal menyimpan presensi');
      }

      setLogs((prev) => {
        const withoutCurrent = prev.filter(
          (l) =>
            !(
              l.tanggal === payload.tanggal &&
              (normalizeKey(l.id) === normalizeKey(payload.id) || normalizeKey(l.nama) === normalizeKey(payload.nama))
            ),
        );

        return [
          ...withoutCurrent,
          {
            ...payload,
            timestamp: new Date().toISOString(),
          },
        ];
      });

      closeAttendanceModal();
      refresh();
    } catch {
      alert('Gagal menyimpan presensi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPeserta = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);

    try {
      const res = await fetch('/api/warga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: newId,
          nama: newNama,
          kelompok: newKelompok,
          gelombang: newGelombang,
          alamat: newAlamat,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAddError(data?.message || 'Gagal menambah peserta');
        return;
      }

      setWarga((prev) => [...prev, data]);
      setIsAddModalOpen(false);
      setNewId('');
      setNewNama('');
      setNewKelompok('');
      setNewGelombang('');
      setNewAlamat('');
      refreshWarga();
    } catch {
      setAddError('Gagal menambah peserta');
    } finally {
      setAddLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const dateLogs = logs.filter((l) => l.tanggal === selectedDate);

    doc.text(`Laporan Presensi Pengajian - ${selectedDate}`, 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [['ID', 'Nama', 'Status', 'Keterangan', 'Waktu']],
      body: dateLogs.map((l) => [l.id, l.nama, l.status, l.keterangan, format(new Date(l.timestamp), 'HH:mm')]),
    });

    doc.save(`Presensi_${selectedDate}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 hidden sm:block">Presensi Pengajian</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user.username}</p>
                <p className="text-xs text-slate-500 uppercase">{user.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Warga" value={stats.total} icon={Users} color="bg-blue-500" />
          <StatCard title="Hadir Hari Ini" value={stats.hadir} icon={CheckCircle} color="bg-emerald-500" />
          <StatCard title="Izin Hari Ini" value={stats.izin} icon={XCircle} color="bg-amber-500" />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau kelompok..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setIsAddModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Tambah Peserta
            </Button>
            <Button variant="secondary" onClick={exportPDF} className="gap-2">
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Nama</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Kelompok</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loadingWarga || loadingLogs ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">Memuat data...</td></tr>
                ) : filteredWarga.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">Tidak ada data peserta yang cocok</td></tr>
                ) : (
                  filteredWarga.map((w) => (
                    (() => {
                      const attendance =
                        todaysAttendanceMap.attendanceById.get(normalizeKey(w.id)) ||
                        todaysAttendanceMap.attendanceByName.get(normalizeKey(w.nama));

                      return (
                        <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-900">{w.nama}</p>
                            <p className="text-xs text-slate-500">ID: {w.id}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{w.kelompok}</td>
                          <td className="px-6 py-4">
                            {attendance ? (
                              <span
                                className={cn(
                                  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                                  attendance.status === 'Hadir'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700',
                                )}
                              >
                                {attendance.status}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Belum Absen</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedWarga(w);
                                setStatus(attendance?.status === 'Izin' ? 'Izin' : 'Hadir');
                                setKeterangan(attendance?.status === 'Izin' ? attendance.keterangan : '');
                                setIsModalOpen(true);
                              }}
                            >
                              {attendance ? 'Ubah' : 'Absen'}
                            </Button>
                          </td>
                        </tr>
                      );
                    })()
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Presensi: {selectedWarga?.nama}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Status</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setStatus('Hadir')}
                    className={cn(
                      'flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all',
                      status === 'Hadir' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500'
                    )}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Hadir
                  </button>
                  <button
                    onClick={() => setStatus('Izin')}
                    className={cn(
                      'flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all',
                      status === 'Izin' ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-500'
                    )}
                  >
                    <XCircle className="w-5 h-5" />
                    Izin
                  </button>
                </div>
              </div>

              {status === 'Izin' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan Izin</label>
                  <textarea
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    rows={3}
                    placeholder="Contoh: Sakit, Luar Kota, dll"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={closeAttendanceModal}>Batal</Button>
                <Button className="flex-1" onClick={handlePresensi} isLoading={submitting}>Simpan</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Tambah Peserta Baru</h2>
            <form onSubmit={handleAddPeserta} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ID</label>
                  <input required className="w-full px-4 py-2 rounded-lg border border-slate-300" value={newId} onChange={(e) => setNewId(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
                  <input required className="w-full px-4 py-2 rounded-lg border border-slate-300" value={newNama} onChange={(e) => setNewNama(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kelompok</label>
                  <input required className="w-full px-4 py-2 rounded-lg border border-slate-300" value={newKelompok} onChange={(e) => setNewKelompok(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gelombang</label>
                  <input required className="w-full px-4 py-2 rounded-lg border border-slate-300" value={newGelombang} onChange={(e) => setNewGelombang(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
                <textarea required className="w-full px-4 py-2 rounded-lg border border-slate-300" rows={3} value={newAlamat} onChange={(e) => setNewAlamat(e.target.value)} />
              </div>
              {addError && <p className="text-sm text-red-500">{addError}</p>}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                <Button type="submit" className="flex-1" isLoading={addLoading}>Simpan Peserta</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
