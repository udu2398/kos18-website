/* =========================================================
   KOS 18 — konten & terjemahan (ID utama, EN)
   Ubah harga / nomor WA / teks di file ini saja.
   ========================================================= */
window.KOS = {
  wa: '62811139149', // 0811-139-149

  rooms: {
    A: {
      price: 2300000, old: 2600000,   // old = harga coret / harga normal (isi null bila tidak ada)
      size: '4 × 5 m',
      // foto + keterangan (n2-4 tidak dipakai: hampir sama dengan n2-6)
      photos: [
        { f: 'n2-1', id: 'Queen bed & meja serbaguna', en: 'Queen bed & multipurpose desk' },
        { f: 'n2-6', id: 'Kamar ber-AC ½ PK', en: 'Room with ½ PK air conditioner' },
        { f: 'n2-2', id: 'Meja serbaguna & cermin', en: 'Multipurpose desk & mirror' },
        { f: 'n2-3', id: 'Tampak dari pintu masuk kamar', en: 'View from the room entrance' },
        { f: 'n2-5', id: 'Kamar mandi dalam & lemari baju', en: 'Private bathroom & wardrobe' }
      ],
      feat: {
        id: ['Akses Sunview', 'Akses Balkon', 'Akses 24 jam keluar & masuk', 'WiFi cepat 150 Mbps', 'Parkir motor & mobil', 'Room cleaning 4x / bulan (ganti sprei, disapu, dipel, diffuser)', 'Kamar 4 × 5 m', 'Kamar mandi dalam', 'Springbed semi latex 160 × 200 (Queen)', 'Lemari baju', 'Meja serbaguna', 'AC ½ PK'],
        en: ['Sunview access', 'Balcony access', '24-hour in & out access', 'Fast WiFi 150 Mbps', 'Motorbike & car parking', 'Room cleaning 4x / month (sheets, sweep, mop, diffuser)', '4 × 5 m room', 'Private bathroom', 'Semi-latex spring bed 160 × 200 (Queen)', 'Wardrobe', 'Multipurpose desk', '½ PK air conditioner']
      }
    },
    B: {
      price: 2100000, old: 2400000,
      size: '3 × 3 m',
      photos: [
        { f: 'n5-4', id: 'Kasur single, lemari baju & meja', en: 'Single bed, wardrobe & desk' },
        { f: 'n5-3', id: 'Pintu kamar mandi dalam', en: 'Private bathroom door' },
        { f: 'n5-1', id: 'Kamar mandi: shower & kloset duduk', en: 'Bathroom: shower & western toilet' },
        { f: 'n5-2', id: 'Depan kamar & lorong', en: 'Room entrance & corridor' }
      ],
      feat: {
        id: ['Akses Sunview', 'WiFi super cepat 5G 150 Mbps', 'Area jemuran luas', 'Akses 24 jam keluar & masuk', 'Parkir motor gratis', 'Room cleaning 4x / bulan (ganti sprei, disapu, dipel, diffuser)', 'Kamar 3 × 3 m', 'Kamar mandi dalam', 'Springbed semi latex 100 × 200 (Single)', 'Lemari baju', 'Meja serbaguna', 'AC ½ PK'],
        en: ['Sunview access', 'Super fast 5G WiFi 150 Mbps', 'Large drying area', '24-hour in & out access', 'Free motorbike parking', 'Room cleaning 4x / month (sheets, sweep, mop, diffuser)', '3 × 3 m room', 'Private bathroom', 'Semi-latex spring bed 100 × 200 (Single)', 'Wardrobe', 'Multipurpose desk', '½ PK air conditioner']
      }
    }
  },

  compare: [
    { k: { id: 'Ukuran kamar', en: 'Room size' }, A: '4 × 5 m', B: '3 × 3 m' },
    { k: { id: 'Kasur', en: 'Bed' }, A: { id: 'Queen 160 × 200', en: 'Queen 160 × 200' }, B: { id: 'Single 100 × 200', en: 'Single 100 × 200' } },
    { k: { id: 'Balkon', en: 'Balcony' }, A: true, B: false },
    { k: { id: 'Parkir', en: 'Parking' }, A: { id: 'Motor & mobil', en: 'Bike & car' }, B: { id: 'Motor', en: 'Bike' } },
    { k: { id: 'AC ½ PK & KM dalam', en: '½ PK AC & private bath' }, A: true, B: true },
    { k: { id: 'WiFi 150 Mbps', en: 'WiFi 150 Mbps' }, A: true, B: true },
    { k: { id: 'Room cleaning 4x/bln', en: 'Room cleaning 4x/mo' }, A: true, B: true },
    { k: { id: 'Listrik', en: 'Electricity' }, A: { id: 'Token, isi sendiri', en: 'Prepaid token' }, B: { id: 'Token, isi sendiri', en: 'Prepaid token' } },
    { k: { id: 'Harga / bulan', en: 'Price / month' }, A: 'Rp 2.300.000', B: 'Rp 2.100.000', strong: true }
  ],

  facilities: [
    { ic: 'wifi', id: ['WiFi 150 Mbps', 'Internet cepat & stabil untuk kerja, kuliah, dan streaming.'], en: ['150 Mbps WiFi', 'Fast, stable internet for work, study and streaming.'] },
    { ic: 'ac', id: ['AC ½ PK', 'Setiap kamar ber-AC, tetap sejuk siang dan malam.'], en: ['½ PK Air Con', 'Every room is air-conditioned, cool day and night.'] },
    { ic: 'bath', id: ['Kamar Mandi Dalam', 'Privasi penuh dengan shower dan kloset duduk.'], en: ['Private Bathroom', 'Full privacy with shower and western toilet.'] },
    { ic: 'clean', id: ['Room Cleaning 4x', 'Ganti sprei, disapu, dipel & diffuser 4x sebulan.'], en: ['Room Cleaning 4x', 'Fresh sheets, sweeping, mopping & diffuser 4x a month.'] },
    { ic: 'clock', id: ['Akses 24 Jam', 'Bebas keluar masuk kapan saja, sesuai jadwalmu.'], en: ['24-Hour Access', 'Come and go anytime that fits your schedule.'] },
    { ic: 'park', id: ['Parkir Gratis', 'Parkir motor gratis, Tipe A juga bisa parkir mobil.'], en: ['Free Parking', 'Free motorbike parking, Type A includes car parking.'] },
    { ic: 'sun', id: ['Sunview & Jemuran', 'Area jemuran luas dengan sinar matahari pagi.'], en: ['Sunview & Drying Area', 'Spacious drying area with morning sunlight.'] },
    { ic: 'bed', id: ['Springbed Semi Latex', 'Kasur empuk, lemari baju, dan meja serbaguna.'], en: ['Semi-Latex Spring Bed', 'Comfy mattress, wardrobe and multipurpose desk.'] }
  ],

  gallery: [
    { f: 'env-5', id: 'Tampak depan', en: 'Front view' },
    { f: 'env-1', id: 'Lorong kamar lantai atas', en: 'Upper-floor corridor' },
    { f: 'n2-1', id: 'Kamar Tipe A', en: 'Type A room' },
    { f: 'env-8', id: 'Jalan perumahan yang rindang', en: 'Leafy residential street' },
    { f: 'env-13', id: 'Pintu kamar kayu jati', en: 'Solid teak doors' },
    { f: 'n5-4', id: 'Kamar Tipe B', en: 'Type B room' },
    { f: 'env-7', id: 'Area parkir', en: 'Parking area' },
    { f: 'env-2', id: 'Lorong yang terang & bersih', en: 'Bright, clean corridor' },
    { f: 'n5-1', id: 'Kamar mandi dalam', en: 'Private bathroom' },
    { f: 'env-3', id: 'Area jemuran', en: 'Drying area' },
    { f: 'env-9', id: 'Lingkungan sekitar', en: 'Neighbourhood' },
    { f: 'env-14', id: 'Depan kamar', en: 'Room entrance' },
    { f: 'env-6', id: 'Fasad dengan kerai bambu', en: 'Facade with bamboo blinds' },
    { f: 'env-4', id: 'Lorong samping', en: 'Side corridor' },
    { f: 'env-12', id: 'Jemuran handuk', en: 'Towel rack' }
  ],

  faq: [
    { id: ['Kos ini untuk putra atau putri?', 'Kos 18 adalah kos khusus putra.'], en: ['Is it for men or women?', 'Kos 18 is a male-only boarding house.'] },
    { id: ['Apakah harga sudah termasuk listrik?', 'Belum. Listrik memakai sistem token (prabayar) yang bisa kamu isi sendiri sesuai pemakaian — beli token di aplikasi, minimarket, atau e-wallet kapan saja. Harga sewa bulanan sudah termasuk WiFi, room cleaning 4x sebulan, dan parkir.'], en: ['Does the price include electricity?', 'No. Electricity uses a prepaid token system that you top up yourself based on your usage — buy tokens anytime via apps, minimarkets or e-wallets. The monthly rent already includes WiFi, 4x monthly room cleaning and parking.'] },
    { id: ['Apa beda Tipe A dan Tipe B?', 'Tipe A berukuran 4 × 5 m dengan queen bed 160 × 200, akses balkon, dan parkir mobil. Tipe B berukuran 3 × 3 m dengan single bed 100 × 200 dan parkir motor. Keduanya sudah ber-AC dan ada kamar mandi dalam.'], en: ['What is the difference between Type A and B?', 'Type A is 4 × 5 m with a 160 × 200 queen bed, balcony access and car parking. Type B is 3 × 3 m with a 100 × 200 single bed and motorbike parking. Both have AC and a private bathroom.'] },
    { id: ['Apakah harga bisa nego?', 'Bisa nego tipis. Silakan hubungi kami lewat WhatsApp.'], en: ['Is the price negotiable?', 'Slightly negotiable. Please contact us on WhatsApp.'] },
    { id: ['Bisa survei lokasi dulu?', 'Tentu. Hubungi kami via WhatsApp untuk mengatur jadwal survei kamar.'], en: ['Can I visit before booking?', 'Of course. Message us on WhatsApp to schedule a room viewing.'] },
    { id: ['Sistem sewanya bagaimana?', 'Sewa dihitung bulanan. Untuk ketersediaan kamar dan ketentuan lainnya, tanyakan langsung via WhatsApp.'], en: ['How does the rental work?', 'Rent is paid monthly. Ask us on WhatsApp about availability and other terms.'] }
  ],

  t: {
    id: {
      'intro.line': 'Pulang ke tempat yang <em>resik</em> &amp; nyaman.',
      'intro.scroll': 'Scroll untuk masuk',
      'intro.tag': 'Resik · Nyaman · Serasa Rumah',
      'stmt.word': 'RESIK',
      'stmt.text': 'Resik itu bukan cuma bersih. Resik itu lorong yang terawat, kamar yang wangi setelah dibersihkan, dan pulang ke tempat yang bikin kamu tenang.',
      'show.eyebrow': 'Pilihan kamar', 'show.title': 'Pilih <em>kamarmu.</em>', 'show.balcony': 'Balkon', 'show.value': 'Paling hemat',
      'nav.about': 'Tentang', 'nav.rooms': 'Kamar', 'nav.facilities': 'Fasilitas', 'nav.gallery': 'Galeri', 'nav.location': 'Lokasi', 'nav.faq': 'FAQ', 'nav.cta': 'Tanya Kamar',
      'hero.eyebrow': 'Kos Putra · Pejaten Timur, Jakarta Selatan',
      'hero.title': 'Resik.<br>Nyaman.<br><em>Serasa Rumah.</em>',
      'hero.lead': 'Kamar ber-AC dengan kamar mandi dalam, WiFi 150 Mbps, akses 24 jam, dan layanan bersih-bersih kamar 4x sebulan. Tinggal bawa koper.',
      'hero.from': 'Mulai', 'hero.month': '/ bulan', 'hero.cta1': 'Lihat Kamar', 'hero.cta2': 'Chat WhatsApp',
      'mq.1': 'Kamar Mandi Dalam', 'mq.2': 'AC ½ PK', 'mq.3': 'WiFi 150 Mbps', 'mq.4': 'Akses 24 Jam', 'mq.5': 'Room Cleaning 4x / Bulan', 'mq.6': 'Parkir Gratis', 'mq.7': 'Springbed Semi Latex', 'mq.8': 'Sunview',
      'about.eyebrow': '01 — Tentang Kos 18',
      'about.title': 'Tempat pulang yang <em>bersih</em>, tenang, dan bikin betah.',
      'about.p1': '“Resik” artinya bersih — dan itu janji kami. Kos 18 adalah kos khusus putra di kawasan perumahan yang tenang di Jl. Tembakau Raya, Pejaten Timur. Lorong dan kamar dirawat rutin, kamar dibersihkan 4 kali sebulan, jadi kamu bisa fokus kerja atau kuliah.',
      'about.p2': 'Cocok untuk karyawan dan mahasiswa yang mencari kos yang rapi, aman, dan dekat dengan pusat aktivitas Pasar Minggu.',
      'stat.wifi': 'WiFi super cepat', 'stat.hour': 'jam', 'stat.access': 'Akses keluar masuk', 'stat.clean': 'Room cleaning / bulan', 'stat.type': 'tipe', 'stat.rooms': 'Pilihan kamar',
      'rooms.eyebrow': '02 — Pilihan Kamar',
      'rooms.title': 'Dua tipe kamar, <em>satu standar nyaman.</em>',
      'rooms.sub': 'Harga bulanan. Semua kamar sudah termasuk AC, kamar mandi dalam, WiFi, dan room cleaning. Listrik pakai token yang bisa diisi sendiri.',
      'room.type': 'Tipe', 'room.no': 'Kamar No.', 'room.month': '/ bulan', 'room.nego': 'Nego tipis', 'room.monthly': 'Bulanan',
      'room.avail': 'Tanya ketersediaan', 'room.feat': 'Fasilitas & isi kamar', 'room.excl': 'Listrik token — isi sendiri sesuai pemakaian (tidak termasuk harga sewa)',
      'room.book': 'Booking via WhatsApp', 'room.survey': 'Jadwalkan Survei', 'room.unit': 'Pilih kamar', 'room.save': 'Hemat', 'room.perMonth': '/bln',
      'room.descA': 'Kamar luas 4 × 5 m dengan queen bed dan akses balkon — ideal bagi yang butuh ruang lega untuk kerja dan istirahat.',
      'room.descB': 'Kamar 3 × 3 m yang ringkas dan efisien dengan fasilitas lengkap — pilihan hemat tanpa mengorbankan kenyamanan.',
      'cmp.title': 'Bandingkan Tipe A & B',
      'fac.eyebrow': '03 — Fasilitas', 'fac.title': 'Semua yang kamu butuhkan, <em>sudah ada.</em>', 'fac.sub': 'Fasilitas bersama dan fasilitas dalam kamar yang dirawat rutin.',
      'gal.eyebrow': '04 — Galeri', 'gal.title': 'Intip suasana <em>Kos 18.</em>', 'gal.hint': 'Scroll untuk menyusuri · ketuk foto untuk memperbesar',
      'loc.eyebrow': '05 — Lokasi', 'loc.title': 'Tenang di perumahan, <em>dekat ke mana-mana.</em>',
      'loc.desc': 'Berada di jalan perumahan yang asri dan rindang di kawasan Pejaten Timur, Pasar Minggu — akses mudah ke transportasi umum, pusat belanja, kampus, dan perkantoran di Jakarta Selatan.',
      'loc.open': 'Buka Google Maps', 'loc.route': 'Petunjuk Arah',
      'faq.eyebrow': '06 — FAQ', 'faq.title': 'Yang sering <em>ditanyakan.</em>',
      'cta.title': 'Siap pindah ke kos yang <em>resik & nyaman?</em>',
      'cta.sub': 'Tanya ketersediaan kamar atau jadwalkan survei lokasi — langsung balas lewat WhatsApp.',
      'foot.tag': 'Kos putra bersih & nyaman di Pejaten Timur, Jakarta Selatan.', 'foot.top': 'Kembali ke atas ↑',
      'wa.tip': 'Tanya kamar kosong?',
      'wa.general': 'Halo Kos 18 Resik Nyaman, saya ingin tanya ketersediaan kamar kos.',
      'wa.room': 'Halo Kos 18 Resik Nyaman, saya tertarik dengan Kamar Tipe {t} harga {p}/bulan. Apakah masih tersedia?',
      'wa.survey': 'Halo Kos 18 Resik Nyaman, saya ingin jadwalkan survei untuk Kamar Tipe {t}. Kapan bisa?'
    },
    en: {
      'intro.line': 'Come home to a place that’s <em>clean</em> &amp; cozy.',
      'intro.scroll': 'Scroll to enter',
      'intro.tag': 'Clean · Cozy · Feels Like Home',
      'stmt.word': 'RESIK',
      'stmt.text': '“Resik” is more than clean. It’s well-kept corridors, a room that smells fresh after cleaning, and coming home to a place that puts your mind at ease.',
      'show.eyebrow': 'Room options', 'show.title': 'Choose <em>your room.</em>', 'show.balcony': 'Balcony', 'show.value': 'Best value',
      'nav.about': 'About', 'nav.rooms': 'Rooms', 'nav.facilities': 'Facilities', 'nav.gallery': 'Gallery', 'nav.location': 'Location', 'nav.faq': 'FAQ', 'nav.cta': 'Ask a Room',
      'hero.eyebrow': 'Male-Only Boarding House · Pejaten Timur, South Jakarta',
      'hero.title': 'Clean.<br>Cozy.<br><em>Feels Like Home.</em>',
      'hero.lead': 'Air-conditioned rooms with private bathrooms, 150 Mbps WiFi, 24-hour access and room cleaning 4 times a month. Just bring your suitcase.',
      'hero.from': 'From', 'hero.month': '/ month', 'hero.cta1': 'View Rooms', 'hero.cta2': 'Chat on WhatsApp',
      'mq.1': 'Private Bathroom', 'mq.2': '½ PK Air Con', 'mq.3': '150 Mbps WiFi', 'mq.4': '24-Hour Access', 'mq.5': 'Room Cleaning 4x / Month', 'mq.6': 'Free Parking', 'mq.7': 'Semi-Latex Spring Bed', 'mq.8': 'Sunview',
      'about.eyebrow': '01 — About Kos 18',
      'about.title': 'A <em>clean</em>, quiet place you’ll love coming home to.',
      'about.p1': '“Resik” means clean in Javanese — and that’s our promise. Kos 18 is a male-only boarding house on a quiet residential street on Jl. Tembakau Raya, Pejaten Timur. Corridors are well kept and rooms are cleaned 4 times a month, so you can focus on work or study.',
      'about.p2': 'Perfect for professionals and students looking for a tidy, safe boarding house close to the Pasar Minggu activity hub.',
      'stat.wifi': 'Super fast WiFi', 'stat.hour': 'hrs', 'stat.access': 'In & out access', 'stat.clean': 'Room cleaning / month', 'stat.type': 'types', 'stat.rooms': 'Room options',
      'rooms.eyebrow': '02 — Our Rooms',
      'rooms.title': 'Two room types, <em>one standard of comfort.</em>',
      'rooms.sub': 'Monthly rates. Every room includes AC, a private bathroom, WiFi and room cleaning. Electricity is prepaid token you top up yourself.',
      'room.type': 'Type', 'room.no': 'Room No.', 'room.month': '/ month', 'room.nego': 'Slightly negotiable', 'room.monthly': 'Monthly',
      'room.avail': 'Ask for availability', 'room.feat': 'Facilities & furnishings', 'room.excl': 'Prepaid token electricity — top up yourself as you use (not included in rent)',
      'room.book': 'Book via WhatsApp', 'room.survey': 'Schedule a Visit', 'room.unit': 'Choose room', 'room.save': 'Save', 'room.perMonth': '/mo',
      'room.descA': 'A spacious 4 × 5 m room with a queen bed and balcony access — ideal if you need room to work and unwind.',
      'room.descB': 'A compact, efficient 3 × 3 m room with complete facilities — the value choice without compromising comfort.',
      'cmp.title': 'Compare Type A & B',
      'fac.eyebrow': '03 — Facilities', 'fac.title': 'Everything you need, <em>already here.</em>', 'fac.sub': 'Shared and in-room facilities, all regularly maintained.',
      'gal.eyebrow': '04 — Gallery', 'gal.title': 'A peek inside <em>Kos 18.</em>', 'gal.hint': 'Scroll to walk through · tap a photo to enlarge',
      'loc.eyebrow': '05 — Location', 'loc.title': 'Quiet residential street, <em>close to everything.</em>',
      'loc.desc': 'Located on a leafy residential street in Pejaten Timur, Pasar Minggu — easy access to public transport, shopping, campuses and offices across South Jakarta.',
      'loc.open': 'Open Google Maps', 'loc.route': 'Get Directions',
      'faq.eyebrow': '06 — FAQ', 'faq.title': 'Frequently <em>asked.</em>',
      'cta.title': 'Ready to move into a <em>clean & cozy</em> new home?',
      'cta.sub': 'Ask about room availability or schedule a visit — we reply on WhatsApp.',
      'foot.tag': 'A clean & cozy male-only boarding house in Pejaten Timur, South Jakarta.', 'foot.top': 'Back to top ↑',
      'wa.tip': 'Looking for a room?',
      'wa.general': 'Hello Kos 18 Resik Nyaman, I would like to ask about room availability.',
      'wa.room': 'Hello Kos 18 Resik Nyaman, I am interested in a Type {t} room at {p}/month. Is it still available?',
      'wa.survey': 'Hello Kos 18 Resik Nyaman, I would like to schedule a visit for a Type {t} room. When is possible?'
    }
  }
};
