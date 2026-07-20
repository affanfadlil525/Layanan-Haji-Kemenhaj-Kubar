/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Home,
  UserPlus, 
  UserMinus, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Info,
  MessageSquare,
  Sparkles,
  FileText,
  Download,
  Printer,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type Screen = 'home' | 'forms' | 'contact' | 'details';
type ServiceType = 'registration' | 'cancellation' | 'transfer';

interface Requirement {
  title: string;
  items: string[];
}

// --- Constants ---
const CONTACT_INFO = {
  phone: "+6281248797139",
  email: "kutaibaratkab@haji.go.id",
  address: "Melak Ulu, Melak, Kabupaten Kutai Barat, Kalimantan Timur 75775",
  hours: {
    mon_thu: "07.30 - 16.00 (Istirahat 12.00 - 13.00)",
    fri: "07.30 - 16.30 (Istirahat 11.30 - 13.30)"
  }
};

const REQUIREMENTS: Record<ServiceType, Requirement[]> = {
  registration: [
    {
      title: "Dokumen Utama",
      items: [
        "Foto Copy KTP (1 Lembar)",
        "Foto Copy KK (1 Lembar)",
        "Foto Copy Akta Kelahiran (1 Lembar)",
        "Foto Copy Buku Tabungan Haji"
      ]
    },
    {
      title: "Format Foto Haji (5 Lembar)",
      items: [
        "Ukuran 3x4",
        "Tanpa Pakaian Dinas, Penutup Wajah, Kacamata, Kopiah",
        "Latar belakang putih, ukuran wajah 80%",
        "Warna tajam dan jelas"
      ]
    },
    {
      title: "Ketentuan Lain",
      items: [
        "Usia pendaftar minimal 12 tahun",
        "Sesuai Aturan Kepdirjen Haji & Umrah No. D/28 Tahun 2016"
      ]
    }
  ],
  cancellation: [
    {
      title: "Batal Haji Meninggal Dunia",
      items: [
        "Permohonan Pembatalan Tujuan Kantor Kemenhaj Kab. Kubar",
        "Surat Pendaftaran Haji (SPPH)",
        "Bukti Setoran BPIH / Setoran Awal",
        "Foto Copy KTP & KK Ahli Waris",
        "Foto Copy Buku Tabungan Ahli Waris",
        "Foto Copy Akta Kematian",
        "Surat Keterangan Ahli Waris / Surat Koasa Waris"
      ]
    },
    {
      title: "Batal Haji Pendaftaran Pribadi",
      items: [
        "Permohonan Pembatalan Tujuan Kantor Kemenhaj Kab. Kubar",
        "Surat Pendaftaran Haji (SPPH)",
        "Bukti Setoran BPIH / Setoran Awal",
        "Foto Copy KTP & KK",
        "Foto Copy Buku Tabungan Haji",
        "Surat Kuasa (jika berhalangan tetap/sakit permanen)"
      ]
    }
  ],
  transfer: [
    {
      title: "Pelimpahan Porsi (Wafat/Sakit Permanen)",
      items: [
        "Surat Permohonan tertulis pengajuan pelimpahan",
        "Salinan Akta Kematian (dari Dukcapil setempat)",
        "Surat Pendaftaran Haji / Bukti setoran awal/pelunasan BPIH",
        "Surat Kuasa (Asli) penunjukan pelimpahan (diketahui Kades/Lurah)",
        "Foto Copy Akta Kelahiran/Nikah/Kenal Lahir Penerima",
        "Foto Copy KTP atau KK Penerima Pelimpahan",
        "Surat Pernyataan Tanggung Jawab Mutlak (Bermaterai)",
        "Foto Copy Buku Rekening di Bank yang sama dengan almarhum",
        "Pas Foto 3x4 (5 lembar) latar belakang putih"
      ]
    }
  ]
};

const INFO_GUIDES = [
  {
    id: "estimasi",
    title: "Cek Estimasi Keberangkatan & Nomor Porsi Haji",
    description: "Setelah melakukan daftar haji reguler di Kantor Kementerian Haji dan Umrah (Kemenhaj) Kutai Barat, jemaah akan menerima 10 digit Nomor Porsi Haji. Nomor porsi ini merupakan bukti resmi pendaftaran yang dapat digunakan untuk mengecek perkiraan tahun keberangkatan haji Anda melalui sistem online resmi atau langsung berkonsultasi dengan petugas layanan terpadu kami di Melak Ulu, Kutai Barat.",
    tags: ["Nomor Porsi", "Estimasi Haji"]
  },
  {
    id: "kuota",
    title: "Kuota Haji Kabupaten Kutai Barat",
    description: "Kuota haji untuk Kabupaten Kutai Barat dialokasikan setiap tahunnya berdasarkan keputusan resmi Kementerian Haji dan Umrah RI bersama Pemerintah Provinsi Kalimantan Timur. Informasi kuota terbaru dan daftar tunggu (waiting list) jemaah haji Kutai Barat dapat dipantau langsung melalui sistem informasi haji terpadu kami.",
    tags: ["Kuota Haji", "Kutai Barat"]
  },
  {
    id: "daftar",
    title: "Syarat & Alur Pendaftaran Haji Reguler",
    description: "Untuk mendaftar haji reguler di Kemenhaj Kubar, langkah pertama adalah membuka rekening tabungan haji di Bank Penerima Setoran (BPS) BPIH sebesar Rp25.000.000 untuk mendapatkan nomor validasi. Setelah itu, bawa seluruh dokumen persyaratan (KTP, KK, Akta Lahir, Buku Rekening) ke kantor kami untuk proses input data dan penerbitan Surat Pendaftaran Haji (SPPH).",
    tags: ["Daftar Haji", "Kemenhaj Kubar"]
  },
  {
    id: "umrah",
    title: "Panduan Ibadah Umrah Mandiri & Travel Resmi",
    description: "Bagi masyarakat Kutai Barat yang ingin melaksanakan ibadah Umrah, kami mengimbau agar selalu memilih Penyelenggara Perjalanan Ibadah Umrah (PPIU) resmi yang terdaftar di Kementerian Haji dan Umrah RI. Pastikan prinsip '5 Pasti Umrah': Pasti Travelnya, Pasti Jadwalnya, Pasti Terbangnya, Pasti Hotelnya, dan Pasti Visanya agar terhindar dari penipuan.",
    tags: ["Umrah", "Travel Resmi"]
  }
];

// --- Components ---

const BottomNav = ({ activeScreen, setScreen }: { activeScreen: Screen, setScreen: (s: Screen) => void }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-6 py-3 flex justify-around items-center z-50 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
    <button 
      onClick={() => setScreen('home')}
      className={`flex flex-col items-center gap-1 transition-colors ${activeScreen === 'home' || activeScreen === 'details' ? 'text-emerald-600' : 'text-zinc-400'}`}
    >
      <Home size={22} strokeWidth={activeScreen === 'home' || activeScreen === 'details' ? 2.5 : 2} />
      <span className="text-[10px] font-bold uppercase tracking-wider">Layanan</span>
    </button>
    <button 
      onClick={() => setScreen('forms')}
      className={`flex flex-col items-center gap-1 transition-colors ${activeScreen === 'forms' ? 'text-emerald-600' : 'text-zinc-400'}`}
    >
      <FileText size={22} strokeWidth={activeScreen === 'forms' ? 2.5 : 2} />
      <span className="text-[10px] font-bold uppercase tracking-wider">Formulir</span>
    </button>
    <button 
      onClick={() => setScreen('contact')}
      className={`flex flex-col items-center gap-1 transition-colors ${activeScreen === 'contact' ? 'text-emerald-600' : 'text-zinc-400'}`}
    >
      <MessageSquare size={22} strokeWidth={activeScreen === 'contact' ? 2.5 : 2} />
      <span className="text-[10px] font-bold uppercase tracking-wider">Kontak</span>
    </button>
  </nav>
);

const Header = ({ title, onBack }: { title: string, onBack?: () => void }) => (
  <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 h-16 flex items-center gap-4 border-b border-zinc-100">
    {onBack && (
      <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-50 text-zinc-600 active:bg-zinc-100 transition-colors">
        <ChevronLeft size={24} />
      </button>
    )}
    <div className="flex-1">
      <h1 className="font-bold text-lg text-zinc-900 leading-tight truncate">{title}</h1>
      {!onBack && <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Kementerian Haji dan Umrah RI</p>}
    </div>
  </header>
);

const ServiceItem = ({ title, icon: Icon, onClick, color = "emerald" }: { title: string, icon: any, onClick: () => void, color?: string }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white p-5 rounded-3xl border border-zinc-100 flex items-center gap-4 active:scale-[0.98] transition-all shadow-sm"
  >
    <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center shrink-0`}>
      <Icon size={24} />
    </div>
    <div className="flex-1 text-left">
      <h3 className="font-bold text-zinc-900">{title}</h3>
      <p className="text-xs text-zinc-400 font-medium">Lihat persyaratan lengkap</p>
    </div>
    <ChevronLeft size={20} className="text-zinc-300 rotate-180" />
  </button>
);

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeService, setActiveService] = useState<ServiceType>('registration');
  
  // Dynamic document states
  const [namaJamaah, setNamaJamaah] = useState('');
  const [nomorPorsi, setNomorPorsi] = useState('');
  const [namaAhliWaris, setNamaAhliWaris] = useState('');
  const [nikAhliWaris, setNikAhliWaris] = useState('');
  const [alamat, setAlamat] = useState('');
  const [hubunganKeluarga, setHubunganKeluarga] = useState('Anak Kandung');
  const [tanggalWafat, setTanggalWafat] = useState('');
  
  const [selectedTemplate, setSelectedTemplate] = useState('pelimpahan_permohonan');
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  const handleServiceClick = (type: ServiceType) => {
    setActiveService(type);
    setScreen('details');
  };

  // Scroll to top on screen change and update document title dynamically for SEO
  useEffect(() => {
    window.scrollTo(0, 0);
    
    let pageTitle = "Layanan Haji Terpadu Kemenhaj Kutai Barat";
    if (screen === 'details') {
      const serviceNames: Record<ServiceType, string> = {
        registration: "Pendaftaran Haji",
        transfer: "Pelimpahan Porsi Haji (Wafat/Sakit)",
        cancellation: "Pembatalan Haji & Refund Dana"
      };
      pageTitle = `${serviceNames[activeService]} - Kemenhaj Kutai Barat`;
    } else if (screen === 'forms') {
      pageTitle = "Unduh Formulir & Template Berkas Haji - Kemenhaj Kutai Barat";
    } else if (screen === 'contact') {
      pageTitle = "Kontak & Alamat Kantor Kemenhaj Kutai Barat";
    }
    
    document.title = `${pageTitle} | kemenhajkubar.web.id`;
  }, [screen, activeService]);

  // Document templates lists
  const documentTemplates = [
    {
      id: 'pelimpahan_permohonan',
      title: 'Surat Permohonan Pelimpahan Nomor Porsi Haji (Wafat)',
      category: 'Pelimpahan',
      staticPath: '/templates/surat_permohonan_pelimpahan.docx'
    },
    {
      id: 'pelimpahan_sptjm',
      title: 'Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) Pelimpahan',
      category: 'Pelimpahan',
      staticPath: '/templates/sptjm_pelimpahan.docx'
    },
    {
      id: 'pelimpahan_kuasa',
      title: 'Surat Kuasa Pelimpahan Nomor Porsi Haji',
      category: 'Pelimpahan',
      staticPath: '/templates/surat_kuasa_pelimpahan.docx'
    },
    {
      id: 'pembatalan_permohonan',
      title: 'Surat Permohonan Pembatalan Pendaftaran Haji',
      category: 'Pembatalan',
      staticPath: '/templates/surat_permohonan_pembatalan.docx'
    },
    {
      id: 'pembatalan_sptjm',
      title: 'Surat Pernyataan Pembatalan Haji Mandiri',
      category: 'Pembatalan',
      staticPath: '/templates/sptjm_pembatalan.docx'
    }
  ];

  // Helper to get raw dynamic HTML structure for printing/docx
  const getHtmlContent = (id: string) => {
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedNamaJamaah = namaJamaah || '................................';
    const formattedNomorPorsi = nomorPorsi || '................................';
    const formattedNamaAhliWaris = namaAhliWaris || '................................';
    const formattedNikAhliWaris = nikAhliWaris || '................................';
    const formattedAlamat = alamat || '................................';
    const formattedHubungan = hubunganKeluarga || '................................';
    const formattedTanggalWafat = tanggalWafat || '................................';

    switch (id) {
      case 'pelimpahan_permohonan':
        return `
          <div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.6; color: #000; padding: 10px;">
            <div style="text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px;">
              <h3 style="margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase;">KEMENTERIAN HAJI DAN UMRAH REPUBLIK INDONESIA</h3>
              <h4 style="margin: 5px 0 0 0; font-size: 12pt; font-weight: bold; text-transform: uppercase;">KANTOR KABUPATEN KUTAI BARAT</h4>
              <p style="margin: 5px 0 0 0; font-size: 10pt; font-style: italic;">Alamat: Melak Ulu, Melak, Kabupaten Kutai Barat, Kalimantan Timur 75775</p>
            </div>
            
            <div style="text-align: right; margin-bottom: 20px;">
              <p>Kutai Barat, ${today}</p>
            </div>
            
            <table style="width: 100%; margin-bottom: 20px;">
              <tr>
                <td style="width: 15%; vertical-align: top;">Hal</td>
                <td style="width: 2%; vertical-align: top;">:</td>
                <td style="font-weight: bold; vertical-align: top;">Permohonan Pelimpahan Nomor Porsi Haji (Wafat)</td>
              </tr>
            </table>
            
            <p>Kepada Yth.<br><strong>Kepala Kantor Kementerian Haji dan Umrah</strong><br>Kabupaten Kutai Barat<br>di Tempat</p>
            
            <p style="text-indent: 40px; text-align: justify;">Yang bertanda tangan di bawah ini selaku ahli waris dari jemaah haji yang wafat:</p>
            
            <table style="width: 90%; margin-left: 40px; margin-bottom: 15px; border-collapse: collapse;">
              <tr><td style="width: 35%; padding: 4px 0;">Nama Ahli Waris (Pemohon)</td><td style="width: 3%;">:</td><td style="font-weight: bold;">${formattedNamaAhliWaris}</td></tr>
              <tr><td style="padding: 4px 0;">No. KTP / NIK</td><td>:</td><td>${formattedNikAhliWaris}</td></tr>
              <tr><td style="padding: 4px 0;">Alamat Lengkap</td><td>:</td><td>${formattedAlamat}</td></tr>
              <tr><td style="padding: 4px 0;">Hubungan Keluarga</td><td>:</td><td>${formattedHubungan}</td></tr>
            </table>
            
            <p style="text-indent: 40px; text-align: justify;">Dengan ini mengajukan permohonan pelimpahan nomor porsi haji atas nama jemaah haji yang wafat berikut:</p>
            
            <table style="width: 90%; margin-left: 40px; margin-bottom: 20px; border-collapse: collapse;">
              <tr><td style="width: 35%; padding: 4px 0;">Nama Jemaah Wafat</td><td style="width: 3%;">:</td><td style="font-weight: bold;">${formattedNamaJamaah}</td></tr>
              <tr><td style="padding: 4px 0;">Nomor Porsi Haji</td><td>:</td><td style="font-weight: bold;">${formattedNomorPorsi}</td></tr>
              <tr><td style="padding: 4px 0;">Tanggal Wafat</td><td>:</td><td>${formattedTanggalWafat}</td></tr>
            </table>
            
            <p style="text-indent: 40px; text-align: justify;">Sebagai bahan pertimbangan Bapak, bersama ini kami lampirkan dokumen persyaratan lengkap sesuai aturan yang berlaku.</p>
            
            <p style="text-indent: 40px; text-align: justify;">Demikian permohonan ini kami sampaikan, atas perhatian dan kebijaksanaan Bapak kami ucapkan terima kasih.</p>
            
            <table style="width: 100%; margin-top: 50px;">
              <tr>
                <td style="width: 50%; text-align: center;">Mengetahui,<br>Kepala Desa / Lurah<br><br><br><br><br>( ____________________ )</td>
                <td style="width: 50%; text-align: center;">Hormat Kami,<br>Pemohon (Ahli Waris)<br><br><br><br><br><strong>( ${formattedNamaAhliWaris} )</strong></td>
              </tr>
            </table>
          </div>
        `;
      case 'pelimpahan_sptjm':
        return `
          <div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.6; color: #000; padding: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h3 style="margin: 0; font-size: 14pt; font-weight: bold; text-decoration: underline; text-transform: uppercase;">SURAT PERNYATAAN TANGGUNG JAWAB MUTLAK</h3>
              <p style="margin: 5px 0 0 0; font-size: 11pt;">NOMOR: ___________________________</p>
            </div>
            
            <p>Yang bertanda tangan di bawah ini:</p>
            
            <table style="width: 90%; margin-left: 40px; margin-bottom: 20px; border-collapse: collapse;">
              <tr><td style="width: 35%; padding: 4px 0;">Nama Ahli Waris</td><td style="width: 3%;">:</td><td style="font-weight: bold;">${formattedNamaAhliWaris}</td></tr>
              <tr><td style="padding: 4px 0;">No. KTP / NIK</td><td>:</td><td>${formattedNikAhliWaris}</td></tr>
              <tr><td style="padding: 4px 0;">Alamat Lengkap</td><td>:</td><td>${formattedAlamat}</td></tr>
              <tr><td style="padding: 4px 0;">Hubungan Keluarga</td><td>:</td><td>Ahli Waris dari Almarhum/Almarhumah ${formattedNamaJamaah}</td></tr>
            </table>
            
            <p style="text-align: justify; text-indent: 40px;">Menyatakan dengan sesungguhnya dan penuh tanggung jawab bahwa:</p>
            
            <ol style="margin-left: 40px; text-align: justify; padding-left: 15px;">
              <li style="margin-bottom: 10px;">Dokumen dan data yang kami sampaikan untuk kelengkapan berkas pelimpahan nomor porsi haji almarhum/almarhumah <strong>${formattedNamaJamaah}</strong> dengan Nomor Porsi <strong>${formattedNomorPorsi}</strong> adalah benar dan sah sesuai hukum yang berlaku.</li>
              <li style="margin-bottom: 10px;">Apabila di kemudian hari terdapat gugatan atau tuntutan hukum dari pihak ahli waris lainnya atau pihak mana pun, sepenuhnya menjadi tanggung jawab mutlak saya secara hukum dan bersedia dituntut sesuai undang-undang yang berlaku tanpa melibatkan Kementerian Haji dan Umrah RI.</li>
            </ol>
            
            <p style="text-indent: 40px; text-align: justify;">Demikian surat pernyataan tanggung jawab mutlak ini saya buat dengan sadar dan tanpa paksaan dari pihak mana pun.</p>
            
            <table style="width: 100%; margin-top: 60px;">
              <tr>
                <td style="width: 50%;"></td>
                <td style="width: 50%; text-align: center;">
                  Kutai Barat, ${today}<br>
                  Yang membuat pernyataan,<br>
                  <em style="display: block; font-size: 9pt; color: #555; margin-top: 5px; margin-bottom: 25px;">Meterai Rp 10.000</em>
                  <br><br>
                  <strong>( ${formattedNamaAhliWaris} )</strong>
                </td>
              </tr>
            </table>
          </div>
        `;
      case 'pelimpahan_kuasa':
        return `
          <div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.6; color: #000; padding: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h3 style="margin: 0; font-size: 14pt; font-weight: bold; text-decoration: underline; text-transform: uppercase;">SURAT KUASA WARIS / PELIMPAHAN PORSI</h3>
            </div>
            
            <p>Yang bertanda tangan di bawah ini selaku para ahli waris dari Almarhum/Almarhumah <strong>${formattedNamaJamaah}</strong>:</p>
            
            <p style="text-indent: 40px;">Dengan ini memberikan KUASA penuh kepada:</p>
            
            <table style="width: 90%; margin-left: 40px; margin-bottom: 20px; border-collapse: collapse;">
              <tr><td style="width: 35%; padding: 4px 0;">Nama Ahli Waris (Penerima Kuasa)</td><td style="width: 3%;">:</td><td style="font-weight: bold;">${formattedNamaAhliWaris}</td></tr>
              <tr><td style="padding: 4px 0;">No. KTP / NIK</td><td>:</td><td>${formattedNikAhliWaris}</td></tr>
              <tr><td style="padding: 4px 0;">Alamat Lengkap</td><td>:</td><td>${formattedAlamat}</td></tr>
              <tr><td style="padding: 4px 0;">Hubungan Keluarga</td><td>:</td><td>${formattedHubungan}</td></tr>
            </table>
            
            <p style="text-align: justify; text-indent: 40px;">Untuk melakukan pengurusan proses pelimpahan nomor porsi haji <strong>${formattedNomorPorsi}</strong> milik Almarhum/Almarhumah <strong>${formattedNamaJamaah}</strong> di Kantor Kementerian Haji dan Umrah Kabupaten Kutai Barat hingga selesai.</p>
            
            <p style="text-indent: 40px; text-align: justify;">Demikian surat kuasa ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
            
            <table style="width: 100%; margin-top: 60px;">
              <tr>
                <td style="width: 50%; text-align: center;">
                  Para Pemberi Kuasa (Ahli Waris)<br><br>
                  1. __________________ ( ____________ )<br><br>
                  2. __________________ ( ____________ )<br><br>
                  3. __________________ ( ____________ )
                </td>
                <td style="width: 50%; text-align: center; vertical-align: top;">
                  Kutai Barat, ${today}<br>
                  Penerima Kuasa,<br>
                  <em style="display: block; font-size: 9pt; color: #555; margin-top: 5px; margin-bottom: 20px;">Meterai Rp 10.000</em>
                  <br><br>
                  <strong>( ${formattedNamaAhliWaris} )</strong>
                </td>
              </tr>
            </table>
          </div>
        `;
      case 'pembatalan_permohonan':
        return `
          <div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.6; color: #000; padding: 10px;">
            <div style="text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px;">
              <h3 style="margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase;">KEMENTERIAN HAJI DAN UMRAH REPUBLIK INDONESIA</h3>
              <h4 style="margin: 5px 0 0 0; font-size: 12pt; font-weight: bold; text-transform: uppercase;">KANTOR KABUPATEN KUTAI BARAT</h4>
              <p style="margin: 5px 0 0 0; font-size: 10pt; font-style: italic;">Alamat: Melak Ulu, Melak, Kabupaten Kutai Barat, Kalimantan Timur 75775</p>
            </div>
            
            <div style="text-align: right; margin-bottom: 20px;">
              <p>Kutai Barat, ${today}</p>
            </div>
            
            <table style="width: 100%; margin-bottom: 20px;">
              <tr>
                <td style="width: 15%; vertical-align: top;">Hal</td>
                <td style="width: 2%; vertical-align: top;">:</td>
                <td style="font-weight: bold; vertical-align: top;">Permohonan Pembatalan Pendaftaran Haji & Pengembalian Dana BPIH</td>
              </tr>
            </table>
            
            <p>Kepada Yth.<br><strong>Kepala Kantor Kementerian Haji dan Umrah</strong><br>Kabupaten Kutai Barat<br>di Tempat</p>
            
            <p style="text-indent: 40px; text-align: justify;">Yang bertanda tangan di bawah ini:</p>
            
            <table style="width: 90%; margin-left: 40px; margin-bottom: 20px; border-collapse: collapse;">
              <tr><td style="width: 35%; padding: 4px 0;">Nama Lengkap</td><td style="width: 3%;">:</td><td style="font-weight: bold;">${formattedNamaJamaah}</td></tr>
              <tr><td style="padding: 4px 0;">No. KTP / NIK</td><td>:</td><td>${formattedNikAhliWaris}</td></tr>
              <tr><td style="padding: 4px 0;">Nomor Porsi Haji</td><td style="font-weight: bold;">:</td><td>${formattedNomorPorsi}</td></tr>
              <tr><td style="padding: 4px 0;">Alamat Lengkap</td><td>:</td><td>${formattedAlamat}</td></tr>
            </table>
            
            <p style="text-indent: 40px; text-align: justify;">Dengan ini mengajukan permohonan pembatalan pendaftaran ibadah haji reguler atas nama diri saya pribadi dengan alasan ________________________________________________.</p>
            
            <p style="text-indent: 40px; text-align: justify;">Sehubungan dengan pembatalan ini, saya memohon agar dana setoran awal/pelunasan Biaya Perjalanan Ibadah Haji (BPIH) dapat ditransfer kembali ke rekening asal saya berikut:</p>
            
            <table style="width: 90%; margin-left: 40px; margin-bottom: 20px; border-collapse: collapse;">
              <tr><td style="width: 35%; padding: 4px 0;">Nama Bank Penerima</td><td style="width: 3%;">:</td><td>___________________________</td></tr>
              <tr><td style="padding: 4px 0;">Nomor Rekening</td><td>:</td><td>___________________________</td></tr>
              <tr><td style="padding: 4px 0;">Nama Pemilik Rekening</td><td>:</td><td>${formattedNamaJamaah}</td></tr>
            </table>
            
            <p style="text-indent: 40px; text-align: justify;">Demikian surat permohonan pembatalan ini saya buat untuk diproses lebih lanjut sesuai peraturan yang berlaku. Atas perhatian Bapak, saya ucapkan terima kasih.</p>
            
            <table style="width: 100%; margin-top: 60px;">
              <tr>
                <td style="width: 50%;"></td>
                <td style="width: 50%; text-align: center;">
                  Hormat Saya,<br>
                  Pemohon (Calon Jamaah),<br>
                  <em style="display: block; font-size: 9pt; color: #555; margin-top: 5px; margin-bottom: 25px;">Meterai Rp 10.000</em>
                  <br><br>
                  <strong>( ${formattedNamaJamaah} )</strong>
                </td>
              </tr>
            </table>
          </div>
        `;
      case 'pembatalan_sptjm':
        return `
          <div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.6; color: #000; padding: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h3 style="margin: 0; font-size: 14pt; font-weight: bold; text-decoration: underline; text-transform: uppercase;">SURAT PERNYATAAN PEMBATALAN HAJI MANDIRI</h3>
            </div>
            
            <p>Yang bertanda tangan di bawah ini:</p>
            
            <table style="width: 90%; margin-left: 40px; margin-bottom: 20px; border-collapse: collapse;">
              <tr><td style="width: 35%; padding: 4px 0;">Nama Calon Jamaah</td><td style="width: 3%;">:</td><td style="font-weight: bold;">${formattedNamaJamaah}</td></tr>
              <tr><td style="padding: 4px 0;">No. KTP / NIK</td><td>:</td><td>${formattedNikAhliWaris}</td></tr>
              <tr><td style="padding: 4px 0;">Nomor Porsi Haji</td><td style="font-weight: bold;">:</td><td>${formattedNomorPorsi}</td></tr>
              <tr><td style="padding: 4px 0;">Alamat Lengkap</td><td>:</td><td>${formattedAlamat}</td></tr>
            </table>
            
            <p style="text-align: justify; text-indent: 40px;">Menyatakan dengan sadar dan sungguh-sungguh bahwa:</p>
            
            <ol style="margin-left: 40px; text-align: justify; padding-left: 15px;">
              <li style="margin-bottom: 10px;">Keputusan pembatalan ibadah haji reguler dengan Nomor Porsi <strong>${formattedNomorPorsi}</strong> ini adalah murni keputusan pribadi tanpa ada paksaan dari pihak mana pun.</li>
              <li style="margin-bottom: 10px;">Saya menyadari sepenuhnya segala konsekuensi pembatalan ini termasuk kehilangan hak antrean keberangkatan haji yang telah saya miliki sebelumnya.</li>
              <li style="margin-bottom: 10px;">Saya tidak akan melakukan tuntutan hukum apa pun di kemudian hari kepada Kantor Kementerian Haji dan Umrah RI atas pembatalan ini.</li>
            </ol>
            
            <p style="text-indent: 40px; text-align: justify;">Demikian surat pernyataan ini dibuat sebagai kelengkapan berkas pembatalan haji reguler.</p>
            
            <table style="width: 100%; margin-top: 60px;">
              <tr>
                <td style="width: 50%;"></td>
                <td style="width: 50%; text-align: center;">
                  Kutai Barat, ${today}<br>
                  Yang membuat pernyataan,<br>
                  <em style="display: block; font-size: 9pt; color: #555; margin-top: 5px; margin-bottom: 25px;">Meterai Rp 10.000</em>
                  <br><br>
                  <strong>( ${formattedNamaJamaah} )</strong>
                </td>
              </tr>
            </table>
          </div>
        `;
      default:
        return '';
    }
  };

  // Generate editable Word doc (.doc is highly compatible with Word and opens beautifully)
  const handleDownloadDocx = (id: string, title: string) => {
    const rawHtml = getHtmlContent(id);
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset="utf-8"><title>${title}</title><style>body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; margin: 1in; }</style></head><body>`;
    const footer = "</body></html>";
    const sourceHTML = header + rawHtml + footer;
    const blob = new Blob(['\ufeff' + sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Open native printer dialogue to save as beautiful PDF
  const handlePrintPdf = (id: string, title: string) => {
    const rawHtml = getHtmlContent(id);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { 
                font-family: 'Times New Roman', Times, serif; 
                font-size: 12pt; 
                line-height: 1.6; 
                margin: 40px; 
                color: #000;
              }
              @media print {
                body { margin: 0; padding: 20px; }
              }
            </style>
          </head>
          <body>
            ${rawHtml}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-24">
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Header title="Kemenhaj Kutai Barat" />
            <main className="p-4 space-y-8">
              <section className="pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Sparkles size={12} />
                  Layanan Haji Terpadu
                </div>
                <h2 className="text-4xl font-bold tracking-tight mb-4 leading-[1.1]">
                  Kemudahan Ibadah <br />
                  <span className="text-emerald-600">Mulai dari Sini.</span>
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                  Pusat informasi persyaratan pendaftaran, pelimpahan, dan pembatalan porsi haji Kabupaten Kutai Barat.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Pilih Layanan</h3>
                <div className="space-y-3">
                  <ServiceItem 
                    title="Pendaftaran Haji" 
                    icon={UserPlus} 
                    onClick={() => handleServiceClick('registration')} 
                  />
                  <ServiceItem 
                    title="Pelimpahan Porsi" 
                    icon={Users} 
                    onClick={() => handleServiceClick('transfer')} 
                  />
                  <ServiceItem 
                    title="Pembatalan Haji" 
                    icon={UserMinus} 
                    onClick={() => handleServiceClick('cancellation')} 
                  />
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 ml-1">
                  <BookOpen size={16} className="text-emerald-600" />
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Panduan & Informasi Haji Terpadu</h3>
                </div>
                <div className="space-y-3">
                  {INFO_GUIDES.map((guide) => {
                    const isOpen = activeGuide === guide.id;
                    return (
                      <div 
                        key={guide.id}
                        className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden transition-all duration-200"
                      >
                        <button
                          onClick={() => setActiveGuide(isOpen ? null : guide.id)}
                          className="w-full p-5 flex items-center justify-between gap-4 text-left font-bold text-sm text-zinc-900 hover:bg-zinc-50/50 transition-colors"
                        >
                          <span className="flex-1 pr-2">{guide.title}</span>
                          <ChevronDown 
                            size={18} 
                            className={`text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} 
                          />
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-zinc-50"
                            >
                              <div className="p-5 pt-4 bg-emerald-50/20 space-y-3">
                                <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                                  {guide.description}
                                </p>
                                <div className="flex gap-1.5 flex-wrap pt-1">
                                  {guide.tags.map((tag, idx) => (
                                    <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-wider">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <h3 className="font-bold text-zinc-900">Jam Pelayanan</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Senin - Kamis</p>
                    <p className="text-sm font-bold text-zinc-700">{CONTACT_INFO.hours.mon_thu}</p>
                  </div>
                  <div className="h-px bg-zinc-50" />
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Jumat</p>
                    <p className="text-sm font-bold text-zinc-700">{CONTACT_INFO.hours.fri}</p>
                  </div>
                </div>
              </section>
            </main>
          </motion.div>
        )}

        {screen === 'details' && (
          <motion.div 
            key="details"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-zinc-50 z-50 overflow-y-auto pb-24"
          >
            <Header 
              title={activeService === 'registration' ? 'Pendaftaran' : activeService === 'transfer' ? 'Pelimpahan' : 'Pembatalan'} 
              onBack={() => setScreen('home')} 
            />
            <main className="p-4 space-y-6">
              {REQUIREMENTS[activeService].map((req, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm">
                  <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-emerald-500 rounded-full" />
                    {req.title}
                  </h4>
                  <ul className="space-y-4">
                    {req.items.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-zinc-500 leading-relaxed font-medium">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 flex gap-4">
                <Info size={24} className="text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm mb-1">Butuh Bantuan?</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                    Silakan hubungi petugas kami melalui menu Kontak jika ada persyaratan yang kurang jelas atau ingin mengunduh formulir di menu Formulir.
                  </p>
                </div>
              </div>
            </main>
          </motion.div>
        )}

        {screen === 'forms' && (
          <motion.div 
            key="forms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Header title="Unduh Formulir" />
            <main className="p-4 space-y-6">
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Pilih Dokumen Template</h3>
                
                <div className="space-y-4">
                  {documentTemplates.map((tpl) => (
                    <div 
                      key={tpl.id}
                      className={`p-5 rounded-3xl border transition-all ${
                        selectedTemplate === tpl.id 
                          ? 'bg-white border-emerald-500 ring-1 ring-emerald-500' 
                          : 'bg-white border-zinc-100 hover:border-zinc-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <button 
                          onClick={() => setSelectedTemplate(tpl.id)}
                          className="flex-1 text-left"
                        >
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2 ${
                            tpl.category === 'Pelimpahan' 
                              ? 'bg-amber-550/10 text-emerald-800' 
                              : 'bg-zinc-100 text-zinc-500'
                          }`}>
                            {tpl.category}
                          </span>
                          <h4 className="font-bold text-zinc-900 text-sm leading-snug">{tpl.title}</h4>
                        </button>
                      </div>

                      {selectedTemplate === tpl.id && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 pt-4 border-t border-zinc-100 space-y-2.5"
                        >
                          <div className="flex gap-3">
                            {tpl.staticPath && (
                              <a
                                href={tpl.staticPath}
                                download={tpl.staticPath.split('/').pop()}
                                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm text-center"
                                title="Unduh berkas Microsoft Word asli (.docx)"
                              >
                                <Download size={14} />
                                Unduh Otomatis (.docx)
                              </a>
                            )}
                            <button
                              onClick={() => handlePrintPdf(tpl.id, tpl.title)}
                              className="flex-1 py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all border border-emerald-100"
                              title="Cetak langsung atau simpan sebagai PDF"
                            >
                              <Printer size={14} />
                              Cetak / PDF
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </motion.div>
        )}

        {screen === 'contact' && (
          <motion.div 
            key="contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Header title="Kontak & Lokasi" />
            <main className="p-4 space-y-6">
              <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                  <h3 className="text-2xl font-bold">Hubungi Kami</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Telepon / WA</p>
                        <p className="text-lg font-bold">{CONTACT_INFO.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Email</p>
                        <p className="text-base font-bold opacity-90">{CONTACT_INFO.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Alamat</p>
                        <p className="text-sm font-medium opacity-80 leading-relaxed">{CONTACT_INFO.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-600/30 rounded-full blur-3xl" />
              </div>

              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-zinc-900">Lokasi Kantor</h4>
                  <p className="text-xs text-zinc-400 font-medium">Melak Ulu, Kutai Barat</p>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_INFO.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-600 uppercase tracking-widest"
                >
                  Buka Peta
                </a>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav activeScreen={screen} setScreen={setScreen} />
    </div>
  );
}
