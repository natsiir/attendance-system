export interface Warga {
  no: string;
  id: string;
  nama: string;
  kelompok: string;
  gelombang: string;
  alamat: string;
}

export interface User {
  username: string;
  role: string;
}

export interface PresensiLog {
  id: string;
  nama: string;
  tanggal: string;
  status: 'Hadir' | 'Izin';
  keterangan: string;
  timestamp: string;
}
