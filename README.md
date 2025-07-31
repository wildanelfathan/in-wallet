# Travas - Asisten AI Lokal Indonesia

Travas adalah asisten AI percakapan yang dirancang khusus untuk pengguna lokal Indonesia, menawarkan interaksi emosional, adaptif, dan mendukung bahasa serta budaya lokal seperti bahasa Indonesia, Jawa, Sunda, atau konteks budaya lainnya.

## 🌟 Fitur Utama

### 🤖 Obrolan Berbasis AI
- Menggunakan model bahasa besar (LLM) untuk percakapan yang alami dan kontekstual
- Respons yang disesuaikan dengan budaya dan konteks lokal Indonesia
- Dukungan untuk berbagai bahasa: Indonesia, Jawa, Sunda, Inggris

### 🎤 Dukungan Suara
- Speech-to-Text untuk input suara dalam bahasa Indonesia
- Text-to-Speech dengan suara lokal yang natural
- Rekaman suara real-time dengan indikator level audio

### 🌏 Integrasi Lokal
- Rekomendasi makanan lokal dan halal
- Informasi transportasi (Gojek, Grab, TransJakarta, KRL)
- Acara budaya dan lokal
- Informasi cuaca dan lalu lintas
- Berita lokal

### 🎨 Antarmuka Modern
- Desain responsif untuk web dan aplikasi seluler
- Tema terang/gelap
- Animasi dan transisi yang smooth
- Komponen yang dapat diakses

## 🚀 Teknologi yang Digunakan

### Backend
- **Node.js** dengan TypeScript
- **Express.js** untuk API server
- **Socket.IO** untuk komunikasi real-time
- **Multer** untuk handling file upload
- **Axios** untuk HTTP requests

### Frontend
- **React** dengan TypeScript
- **Tailwind CSS** untuk styling
- **Heroicons** untuk ikon
- **Socket.IO Client** untuk real-time communication

### AI & Voice
- **OpenAI API** (untuk integrasi AI)
- **Google Speech-to-Text** (untuk voice recognition)
- **Google Text-to-Speech** (untuk voice synthesis)

## 📁 Struktur Proyek

```
travas-app/
├── backend/                 # Backend server
│   ├── src/
│   │   ├── controllers/    # Business logic controllers
│   │   ├── routes/         # API routes
│   │   ├── services/       # External service integrations
│   │   ├── middleware/     # Custom middleware
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🛠️ Instalasi dan Setup

### Prerequisites
- Node.js (v16 atau lebih baru)
- npm atau yarn
- Git

### Backend Setup

1. **Clone repository**
```bash
git clone <repository-url>
cd travas-app/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env file dengan konfigurasi yang sesuai
```

4. **Start development server**
```bash
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### Frontend Setup

1. **Navigate ke direktori frontend**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

Frontend akan berjalan di `http://localhost:3000`

## 🔧 Konfigurasi Environment

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# AI Service Configuration
AI_API_KEY=your_openai_api_key_here
AI_BASE_URL=https://api.openai.com/v1

# Voice Service Configuration
VOICE_API_KEY=your_voice_api_key_here
VOICE_BASE_URL=https://api.openai.com/v1

# Local Services Configuration
LOCAL_API_KEY=your_local_api_key_here

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_here

# External APIs
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
WEATHER_API_KEY=your_weather_api_key_here
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📡 API Endpoints

### Chat Endpoints
- `POST /api/chat/send` - Kirim pesan ke AI
- `GET /api/chat/history/:userId` - Ambil riwayat chat
- `POST /api/chat/clear/:userId` - Hapus riwayat chat
- `POST /api/chat/feedback` - Kirim feedback

### Voice Endpoints
- `POST /api/voice/speech-to-text` - Konversi suara ke teks
- `POST /api/voice/text-to-speech` - Konversi teks ke suara
- `GET /api/voice/available-voices` - Daftar suara yang tersedia
- `POST /api/voice/stream` - Streaming text-to-speech

### Local Services Endpoints
- `GET /api/local/transportation` - Opsi transportasi
- `GET /api/local/food-recommendations` - Rekomendasi makanan
- `GET /api/local/cultural-events` - Acara budaya
- `GET /api/local/weather` - Informasi cuaca
- `GET /api/local/traffic` - Informasi lalu lintas
- `GET /api/local/local-news` - Berita lokal

## 🎯 Fitur yang Direncanakan

### Jangka Pendek
- [ ] Integrasi dengan model AI lokal (IndoBERT, dll.)
- [ ] Dukungan untuk lebih banyak bahasa daerah
- [ ] Integrasi dengan layanan lokal (Gojek, Tokopedia API)
- [ ] Sistem autentikasi pengguna
- [ ] Database untuk menyimpan riwayat chat

### Jangka Panjang
- [ ] Aplikasi mobile (React Native)
- [ ] Offline mode dengan model lokal
- [ ] Integrasi dengan smart home devices
- [ ] Multi-modal input (gambar, video)
- [ ] Personalisasi berdasarkan preferensi pengguna

## 🤝 Kontribusi

Kami menyambut kontribusi dari komunitas! Berikut adalah cara untuk berkontribusi:

1. **Fork** repository ini
2. **Buat branch** untuk fitur baru (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. **Buat Pull Request**

### Guidelines untuk Kontribusi
- Ikuti standar coding yang sudah ada
- Tambahkan test untuk fitur baru
- Update dokumentasi jika diperlukan
- Pastikan semua test berjalan dengan baik

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🙏 Ucapan Terima Kasih

- Tim OpenAI untuk model AI yang powerful
- Google untuk layanan Speech-to-Text dan Text-to-Speech
- Komunitas React dan Node.js untuk framework yang luar biasa
- Tailwind CSS untuk styling yang modern dan responsif

## 📞 Kontak

Untuk pertanyaan atau dukungan, silakan hubungi:
- Email: support@travas.ai
- GitHub Issues: [Buat issue baru](https://github.com/your-username/travas-app/issues)

---

**Travas** - Asisten AI Lokal Indonesia 🇮🇩
