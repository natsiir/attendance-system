import Link from 'next/link';

const kegiatan = [
  {
    title: 'Majelis Taklim Rutin',
    desc: 'Kajian kitab klasik dan tafsir tematik setiap pekan untuk pembinaan akhlak dan wawasan keislaman masyarakat.',
  },
  {
    title: 'Program Beasiswa Santri',
    desc: 'Dukungan pendidikan untuk generasi muda berprestasi melalui pembinaan spiritual dan akademik berkelanjutan.',
  },
  {
    title: 'Santunan Sosial',
    desc: 'Gerakan kepedulian untuk dhuafa, yatim, dan lansia dengan distribusi bantuan terstruktur dan tepat sasaran.',
  },
  {
    title: 'Pelatihan Imam & Khatib',
    desc: 'Penguatan kapasitas dai muda agar siap memimpin ibadah dan dakwah dengan wawasan moderat dan beradab.',
  },
];

const organisasi = [
  { jabatan: 'Pembina', nama: 'Drs. H. Ahmad Fadhlan' },
  { jabatan: 'Ketua Yayasan', nama: 'KH. M. Rifqi Al-Hakim' },
  { jabatan: 'Sekretaris', nama: 'Ust. Deni Maulana, S.Pd.I' },
  { jabatan: 'Bendahara', nama: 'Hj. Nuraini, S.E.' },
  { jabatan: 'Koordinator Pendidikan', nama: 'Ustzh. Siti Rahmah, M.Pd' },
  { jabatan: 'Koordinator Sosial', nama: 'H. Lukman Hakim' },
];

export default function HomePage() {
  return (
    <main className="bg-[#F5F5DC] text-[#333333]">
      <header className="sticky top-0 z-30 border-b border-[#333333]/10 bg-[#F5F5DC]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-serif text-xl font-bold tracking-wide">Yayasan Nurul Hikmah</p>
            <p className="text-xs uppercase tracking-[0.24em] text-[#333333]/70">Sejak 1978</p>
          </div>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a href="#home" className="hover:text-[#FF6900]">Home</a>
            <a href="#profile" className="hover:text-[#FF6900]">Profile</a>
            <a href="#kegiatan" className="hover:text-[#FF6900]">Kegiatan</a>
          </nav>
          <Link
            href="/operator"
            className="rounded-md bg-[#FF6900] px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(255,105,0,0.25)] transition hover:bg-[#e55f00]"
          >
            Login Operator
          </Link>
        </div>
      </header>

      <section id="home" className="relative overflow-hidden border-b border-[#333333]/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(51,51,51,0.75), rgba(51,51,51,0.72)), url('https://images.unsplash.com/photo-1519817914152-22f90e4b6f2f?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-6 py-24 md:grid-cols-2 md:py-32">
          <div className="space-y-6 text-[#F5F5DC]">
            <p className="inline-block border border-[#FF6900]/60 px-4 py-1 text-xs uppercase tracking-[0.2em] text-[#FFB680]">
              Modern Classical Institution
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
              Menjaga Warisan Nilai, Menyalakan Semangat Zaman
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-[#F5F5DC]/85 md:text-base">
              Yayasan Keagamaan Nurul Hikmah adalah lembaga pendidikan dan sosial berbasis nilai-nilai Islam,
              mengedepankan disiplin, adab, dan pelayanan umat dengan tata kelola profesional.
            </p>
            <div className="flex gap-3">
              <a href="#profile" className="rounded-md bg-[#FF6900] px-6 py-3 text-sm font-semibold text-white">
                Lihat Profil
              </a>
              <a href="#kegiatan" className="rounded-md border border-[#F5F5DC]/50 px-6 py-3 text-sm font-semibold text-[#F5F5DC]">
                Program Kegiatan
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['46 Tahun Mengabdi', '1200+ Jamaah Binaan', '38 Program Aktif', '7 Unit Pendidikan'].map((item) => (
              <div key={item} className="border border-[#F5F5DC]/25 bg-black/20 p-6 text-center text-[#F5F5DC]">
                <p className="font-serif text-xl font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="profile" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <article>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#FF6900]">Profile</p>
            <h2 className="mb-6 font-serif text-3xl font-bold">Sejarah Yayasan</h2>
            <div className="space-y-4 text-sm leading-relaxed text-[#333333]/85">
              <p>
                Didirikan pada tahun 1978, Yayasan Nurul Hikmah berawal dari majelis kecil di serambi masjid yang
                dipimpin para ulama setempat. Semangat awalnya sederhana: menghadirkan ruang belajar agama yang tertib,
                bermartabat, dan terbuka bagi seluruh lapisan masyarakat.
              </p>
              <p>
                Dalam perjalanannya, yayasan berkembang menjadi institusi yang menaungi pendidikan diniyah, program
                pemberdayaan keluarga, serta aksi sosial kemanusiaan. Nilai pokok yang dijaga hingga kini adalah
                keilmuan, keteladanan, dan kebermanfaatan.
              </p>
            </div>
          </article>

          <article>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#FF6900]">Profile</p>
            <h2 className="mb-6 font-serif text-3xl font-bold">Struktur Organisasi</h2>
            <div className="border border-[#333333]/15 bg-white/70">
              {organisasi.map((row, index) => (
                <div key={row.jabatan} className={`grid grid-cols-5 ${index !== organisasi.length - 1 ? 'border-b border-[#333333]/10' : ''}`}>
                  <p className="col-span-2 bg-[#333333]/5 px-4 py-3 text-sm font-semibold">{row.jabatan}</p>
                  <p className="col-span-3 px-4 py-3 text-sm">{row.nama}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section id="kegiatan" className="border-y border-[#333333]/10 bg-[#333333] py-20 text-[#F5F5DC]">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#FFB680]">Kegiatan</p>
          <h2 className="mb-10 font-serif text-3xl font-bold md:text-4xl">Program Pengajian & Sosial</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {kegiatan.map((item) => (
              <article key={item.title} className="border border-[#F5F5DC]/20 bg-[#F5F5DC]/5 p-6">
                <h3 className="mb-3 font-serif text-2xl text-[#FFB680]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#F5F5DC]/85">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-sm md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Yayasan Nurul Hikmah. Seluruh hak cipta dilindungi.</p>
        <p className="text-[#333333]/70">Jl. Pesantren No. 17, Kota Santri • (021) 555-0199</p>
      </footer>
    </main>
  );
}
