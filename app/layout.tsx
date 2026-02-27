import type { Metadata } from "next";
import { Poppins, Libre_Baskerville } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-baskerville",
});

export const metadata: Metadata = {
  title: "Yayasan Nurul Hikmah",
  description: "Profil resmi Yayasan Keagamaan Nurul Hikmah dan akses operator presensi pengajian.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} ${libreBaskerville.variable} font-sans antialiased bg-[#F5F5DC] text-[#333333]`}>
        {children}
      </body>
    </html>
  );
}
