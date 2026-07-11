# BLUEPRINT PENGEMBANGAN: 3D Endless Runner Game (Spek Juli 2026)

# TECH STACK: React 19, Vite, Three.js (r185+), React Three Fiber v9, @react-three/drei v10+, Zustand v5, typescript, tailwind

---

## STANDAR CODING & ATURAN KERJA AGENT (WAJIB DIPATUHI)

1. PERFORMA 3D: Dilarang keras menggunakan React `useState` atau memicu `setState` di dalam loop `useFrame`. Gunakan mutasi langsung pada `ref.current`.
2. AMBIL DATA ZUSTAND DIuseFrame: Untuk membaca data yang berubah setiap frame (seperti `speed`), gunakan `useGameStore.getState().speed` (non-reaktif) di dalam `useFrame` agar komponen tidak re-render masal.
3. SELECTOR UI: Di luar Canvas (UI HTML), gunakan `useShallow` dari `zustand/react/shallow` saat mengambil objek dari store Zustand v5 untuk mencegah render berantai yang tidak perlu.

---

## BAGIAN 1: FONDASI, PENCING & LINGKUNGAN 3D (REACT 19 / R3F v9)

### Chapter 1: Inisialisasi Environment 2026 & Pembersihan Scrap

- **Tujuan Utama:** Setup project Vite + React 19 dengan dependensi R3F v9 dan Zustand v5 tanpa konflik peer-dependency.
- **Perintah Eksekusi / Library:** `npm install three @types/three @react-three/fiber @react-three/drei zustand`
- **Langkah Logika:**
  1.  Hapus semua boilerplate css (`App.css`, `index.css`). Set `#root`, `html`, `body` ke `width: 100vw; height: 100vh; margin: 0; overflow: hidden; select: none;`.
  2.  Buat folder arsitektur: `/src/components`, `/src/store`.
- **Kriteria Selesai (DoD):** Aplikasi terkompilasi bersih di React 19 tanpa warning resolusi dependency di terminal.

### Chapter 2: Inisialisasi Canvas & Pencahayaan Dasar

- **Tujuan Utama:** Membuat viewport Canvas R3F v9 yang adaptif terhadap ukuran layar.
- **Detail Komponen:** `<Canvas>`, `<ambientLight>`, `<directionalLight>`.
- **Langkah Logika:**
  1.  Buka `App.jsx`, pasang `<Canvas camera={{ position: [0, 4, 8], fov: 55 }}>`.
  2.  Tambahkan pencahayaan: `<ambientLight intensity={0.6} />` dan `<directionalLight position={[5, 12, 4]} intensity={1.2} />`.
- **Kriteria Selesai (DoD):** Layar browser merender canvas 3D (default abu-abu) tanpa error.

### Chapter 3: Pembuatan Komponen Player Mesh (Karakter Utama)

- **Tujuan Utama:** Membuat objek primitif player terkontrol menggunakan `useRef`.
- **Detail Komponen:** `<mesh>`, `<boxGeometry>`, `<meshStandardMaterial>`.
- **Langkah Logika:**
  1.  Buat `/src/components/Player.jsx`. Deklarasikan `const playerRef = useRef()`.
  2.  Gunakan geometry box `[1, 1, 1]` berwarna merah terang. Taruh posisi awal di `[0, 0.5, 0]`.
  3.  Eksport dan panggil di dalam `<Canvas>` di `App.jsx`.
- **Kriteria Selesai (DoD):** Sebuah kubus merah muncul statis tepat di tengah koordinat origin.

### Chapter 4: Struktur Lintasan Jalan (The Track Geometry)

- **Tujuan Utama:** Membuat lintasan 3D yang memanjang sebagai arena lari.
- **Detail Komponen:** `<mesh>`, `<boxGeometry>`.
- **Langkah Logika:**
  1.  Buat `/src/components/Track.jsx` menggunakan `useRef`.
  2.  Gunakan BoxGeometry berdimensi `[6, 0.2, 120]`. Set posisi awal di `[0, -0.1, -50]`.
  3.  Beri warna abu-abu gelap dengan tingkat kekasaran (_roughness_) material tinggi agar terlihat seperti aspal.
- **Kriteria Selesai (DoD):** Kubus merah (Player) terlihat berpijak di atas struktur jalan panjang yang membentang ke depan.

---

## BAGIAN 2: KONTROL KEYBOARD & ILUSI INFINITE RUNNER

### Chapter 5: Setup Sistem Keyboard Kontrol Drei

- **Tujuan Utama:** Menangkap input pergerakan kiri/kanan secara efisien lewat distribusi event terpusat.
- **Detail Komponen:** `<KeyboardControls>` dari `@react-three/drei`.
- **Langkah Logika:**
  1.  Bungkus elemen `<Canvas>` di `App.jsx` dengan `<KeyboardControls map={[ { name: 'left', keys: ['ArrowLeft', 'KeyA'] }, { name: 'right', keys: ['ArrowRight', 'KeyD'] } ]}>`.
  2.  Di dalam `Player.jsx`, inisialisasi `const [subscribeKeys, getKeys] = useKeyboardControls()`.
- **Kriteria Selesai (DoD):** Logika input siap dibaca secara instan tanpa memicu re-render reaktif pada komponen Player.

### Chapter 6: Logika Pergerakan 3 Jalur (Smooth Lane Lerping)

- **Tujuan Utama:** Menggerakkan posisi X Player berpindah antar jalur (-2, 0, 2) secara mulus.
- **Detail Mekanisme:** `useFrame`, `THREE.MathUtils.lerp`.
- **Langkah Logika:**
  1.  Buat variabel internal let/useRef untuk melacak `targetX` (0 = tengah, -2 = kiri, 2 = kanan).
  2.  Gunakan `subscribeKeys` untuk mendengarkan ketukan: jika tombol kiri ditekan dan posisi tidak di -2, kurangi `targetX` sebanyak 2. Berlaku sebaliknya untuk kanan.
  3.  Di dalam `useFrame((state, delta) => { ... })`, lakukan interpolasi: `playerRef.current.position.x = THREE.MathUtils.lerp(playerRef.current.position.x, targetX, delta * 10)`.
- **Kriteria Selesai (DoD):** Menekan A/D menggeser kubus Player ke kiri dan kanan secara halus tanpa teleportasi.

### Chapter 7: Simulasi Gerak Maju (Track Scrolling Loop)

- **Tujuan Utama:** Membuat ilusi jalan terus berjalan ke belakang tanpa batas secara mulus.
- **Detail Mekanisme:** `useFrame` pada komponen Track.
- **Langkah Logika:**
  1.  Di `Track.jsx`, di dalam loop `useFrame`, tambahkan posisi Z track secara konstan ke arah positif (mundur mendekati kamera): `trackRef.current.position.z += speed * delta`.
  2.  Jika nilai `trackRef.current.position.z > 10` (sudah melewati kamera), kurangi posisinya kembali ke belakang sejauh satu siklus penuh untuk menciptakan efek _seamless loop_.
- **Kriteria Selesai (DoD):** Jalanan meluncur ke belakang menciptakan ilusi visual Player berlari maju tanpa henti secara konstan.

---

## BAGIAN 3: MANAJEMEN STATE CORE & SISTEM RINTANGAN V5

### Chapter 8: Konstruksi Central Game Store (Zustand v5)

- **Tujuan Utama:** Menyusun state arsitektur permainan yang terisolasi dari React render tree.
- **Detail Komponen:** `create` dari `zustand`.
- **Langkah Logika:**
  1.  Buat file `/src/store/useGameStore.js`.
  2.  Gunakan sintaks baru Zustand v5: `export const useGameStore = create((set) => ({ ... }))`.
  3.  State wajib: `status: 'START'`, `score: 0`, `speed: 15`, `obstacles: []`.
  4.  Actions wajib: `startGame: () => set({ status: 'PLAYING', score: 0, obstacles: [] }), endGame: () => set({ status: 'GAMEOVER' }), resetGame: () => set({ status: 'START' }), addObstacle: (obs) => set((state) => ({ obstacles: [...state.obstacles, obs] }))`.
- **Kriteria Selesai (DoD):** Store global siap digunakan secara non-reaktif dalam 3D dan secara reaktif dalam UI HTML.

### Chapter 9: Komponen Rintangan Tunggal (Obstacle Mesh Script)

- **Tujuan Utama:** Membuat rintangan yang bergerak mundur berdasarkan global game speed.
- **Detail Komponen:** Komponen `<mesh>`, `<boxGeometry>` warna jingga, di-render berdasarkan props koordinat.
- **Langkah Logika:**
  1.  Buat `/src/components/Obstacle.jsx` yang menerima prop `id`, `position` `[x, y, z]`.
  2.  Di dalam `useFrame`, update posisi Z objek ini secara independen ke arah positif menggunakan data kecepatan non-reaktif: `meshRef.current.position.z += useGameStore.getState().speed * delta`.
- **Kriteria Selesai (DoD):** Komponen rintangan jingga sukses muncul di koordinat spesifik dan bergerak lurus mundur melewati player.

### Chapter 10: Pembuat Rintangan Otomatis & Pembersihan Memori (Spawner & Garbage Collector)

- **Tujuan Utama:** Spawning rintangan secara berkala di jalur acak dan menghapusnya saat keluar layar.
- **Detail Komponen:** Komponen `/src/components/ObstacleManager.jsx`.
- **Langkah Logika:**
  1.  Gunakan `useEffect` yang diatur dengan pewaktu interval (misal tiap 1.5 detik) ketika `status === 'PLAYING'`.
  2.  Setiap tick interval, panggil `addObstacle()` dengan data: `id: Math.random()`, posisi: `[X acak (-2, 0, atau 2), 0.5, -80]`.
  3.  Lakukan mapping array `obstacles` dari store ke komponen `<Obstacle />`.
  4.  **Garbage Collector:** Di dalam `useFrame`, jika ada rintangan yang koordinat Z-nya `> 15`, jalankan filter aksi di store untuk menghapusnya dari array memory.
- **Kriteria Selesai (DoD):** Rintangan terus bermunculan secara acak dan memori browser tetap stabil (elemen DOM/Mesh terhapus otomatis setelah melewati kamera).

---

## BAGIAN 4: VALIDASI TABRAKAN & INTERFACE OVERLAY

### Chapter 11: Deteksi Tabrakan Real-time (AABB Collision Matrix)

- **Tujuan Utama:** Mengalkulasi benturan dimensi kubus Player dengan Rintangan pada setiap frame tunggal.
- **Detail Mekanisme:** Rumus Jarak Absolut Sumbu di dalam `useFrame` milik `ObstacleManager`.
- **Langkah Logika:**
  1.  Di dalam loop `useFrame` manager, dapatkan posisi X dan Z dari Player secara realtime via referensi atau store.
  2.  Lakukan perulangan cek pada array rintangan yang aktif.
  3.  Jika `Math.abs(player.x - obs.x) < 0.8` AND `Math.abs(player.z - obs.z) < 0.8`, picu `useGameStore.getState().endGame()`.
- **Kriteria Selesai (DoD):** Menyentuh kotak jingga langsung mengubah status game menjadi 'GAMEOVER' dan menghentikan seluruh pergerakan dunia 3D seketika.

### Chapter 12: Integrasi UI HTML Overlay & Zustand Selector v5

- **Tujuan Utama:** Membuat HUD menu utama, live score, dan tombol restart menggunakan elemen HTML di atas canvas.
- **Detail Komponen:** `/src/components/GameUI.jsx` (di-render di luar komponen `<Canvas>`).
- **Langkah Logika:**
  1.  Gunakan hook Zustand v5 dengan optimal menggunakan `useShallow` untuk menarik data `status` dan `score`.
  2.  Gunakan CSS `position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; pointer-events: none;`.
  3.  Untuk tombol interaktif, berikan properti CSS `pointer-events: auto;` agar bisa diklik.
  4.  Tampilkan layar yang sesuai berdasarkan kondisi `status` ('START' | 'PLAYING' | 'GAMEOVER').
- **Kriteria Selesai (DoD):** Siklus game (Mulai -> Bermain + Skor naik -> Tabrakan -> Game Over -> Mengulang kembali) bisa dieksekusi tanpa eror ataupun kebocoran state.

---

## BAGIAN 5: RETOUCH & PENYEMPURNAAN ATMOSFER VISUAL

### Chapter 13: Aktivasi Bayangan Dinamis (Shadow Maps)

- **Tujuan Utama:** Memberikan ilusi kedalaman spasial dengan memproyeksikan bayangan objek ke lantai.
- **Langkah Logika:**
  1.  Nyalakan fitur shadow di root canvas: `<Canvas shadows ...>`.
  2.  Tambahkan prop `castShadow` pada `<directionalLight position={[5, 12, 4]} castShadow />`.
  3.  Tambahkan prop `castShadow` pada mesh di dalam `Player.jsx` dan `Obstacle.jsx`.
  4.  Tambahkan prop `receiveShadow` pada mesh di dalam `Track.jsx`.
- **Kriteria Selesai (DoD):** Terbentuk bayangan hitam di bawah kubus Player dan rintangan jingga yang jatuh tepat di atas permukaan aspal jalan abu-abu.

### Chapter 14: Efek Kabut Kedalaman (Fog) & Final Cleanup

- **Tujuan Utama:** Menyembunyikan efek rintangan yang tiba-tiba muncul di ujung jalan (_clipping pop-in_) dengan kabut atmosferik.
- **Langkah Logika:**
  1.  Tambahkan tag `<fog attach="fog" args={['#202025', 30, 90]} />` di dalam Canvas.
  2.  Set warna clear background Canvas agar senada dengan warna kabut (`#202025`).
  3.  Hapus seluruh alat bantu development seperti `OrbitControls` jika sebelumnya sempat dipasang.
- **Kriteria Selesai (DoD):** Rintangan di kejauhan tampak muncul secara dramatis dan mulus dari balik kabut gelap. Game 3D Endless Runner Anda siap dimainkan seutuhnya dengan performa web modern 2026!
