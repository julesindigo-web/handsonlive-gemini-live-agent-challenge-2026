IDEA_TITLE: HandsOnLive – Real-Time Vision AI Skills Mentor

PROBLEM_STATEMENT:
- Siapa yang mengalami: Pemuda Indonesia (siswa SMK, UMKM, ibu rumah tangga, pekerja remote) yang ingin belajar skill praktis seperti memasak masakan Nusantara, memperbaiki motor, bertani hidroponik, atau teknik kerajinan batik/tatah.
- Pain point: Tutorial YouTube/video statis tidak bisa koreksi kesalahan real-time. Mentor manusia mahal & tidak scalable. Hasilnya: tingkat dropout tinggi di pelatihan vokasi (data Kemdikbud 2025).
- Solusi existing gagal: App tutorial biasa cuma video pasif, tidak bisa lihat tangan kamu & kasih feedback langsung.

INNOVATION_HIGHLIGHT:
HandsOnLive adalah agen AI live pertama yang mengubah kamera HP biasa menjadi “mentor pribadi yang selalu siap”. Kamu stream video tangan & objek secara real-time, agen langsung bicara (Bahasa Indonesia natural), koreksi gerakan instan (“Potong miring 15 derajat”), kasih demo overlay, dan adaptasi level kamu. Novel karena menggabungkan Gemini Live API (see + speak bidirectional) dengan agentic memory + tool calling – bukan chatbot, tapi coach yang benar-benar “melihat” apa yang kamu lakukan. Belum ada yang lakukan di skala personal & lokal seperti ini!

TECHNICAL_APPROACH:
- Core engine: Gemini Live API untuk continuous video stream (kamera) + audio I/O real-time (<200ms latency).
- Architecture: 
  - Frontend (Next.js) → WebRTC/MediaStream kirim video live ke backend.
  - Backend: Vertex AI Agent Builder (ADK) dengan system prompt “Kamu mentor sabar berbahasa Indonesia yang ahli skill praktis”.
  - Vision analysis: Gemini multimodal langsung paham objek, tangan, gerakan (augmentasi opsional dengan MediaPipe Hands).
  - Agent logic: Short-term memory (session history) + tool calling (search resep, hitung nutrisi, generate gambar langkah via Imagen).
  - Output: Voice natural + text overlay + AR visual guidance.
- Data: Tidak perlu training ulang – pakai RAG dari dataset resep Indonesia + skill manual (Firestore).

TECH_STACK_2026:
- Gemini 2.0 + Gemini Live API (wajib kompetisi)
- Google GenAI SDK / Agent Development Kit (ADK)
- Hosting: Google Cloud Run + Vertex AI
- Frontend: Next.js 15 + Tailwind + shadcn/ui + WebRTC
- Database: Firestore (user progress & memory)
- Tambahan: Google Text-to-Speech (native Gemini), optional MediaPipe
- Deployment: Fully on GCP (mudah buat bukti recording)

IMPLEMENTATION_ROADMAP:
- Phase 1 MVP (1 minggu): Fokus 1 skill (masak Nasi Goreng) – camera stream + basic voice guidance. Deadline 10 Maret.
- Phase 2 (1 minggu): Tambah multi-skill (motor repair, hidroponik), memory conversation, error detection, Bahasa Indonesia full.
- Phase 3 (3-4 hari): AR overlay, polish demo video, automated Cloud deployment script, architecture diagram.
- Milestone: 15 Maret submit ke Devpost + video demo 3 menit (user masak, agen koreksi live).

FEASIBILITY_ASSESSMENT:
✓ Available models: Gemini Live API (sudah production 2026) + Vertex AI
✓ Existing libraries: Google GenAI SDK, WebRTC, MediaPipe, Firestore
✓ Hardware requirements: Hanya HP Android/iOS dengan kamera (no extra device)
✓ Technical risks: Latency → mitigasi dengan prompt optimization & Cloud Run edge; Vision accuracy → Gemini multimodal sudah >95% di benchmark 2026
✓ Required expertise: Prompt engineering + basic Next.js (bisa 1 orang)

MARKET_VIABILITY:
- Target users: 50 juta+ pemuda Indonesia (SMK + UMKM)
- Competitive landscape: Kalah telak dari app statis (YouTube, Skillshare) karena tidak real-time.
- Unique value proposition: Mentor pribadi gratis, lokal (resep Nusantara, bahasa Indonesia natural), scalable ke jutaan user.
- Monetization potential: Freemium + partnership Kemdikbud, Gojek (training driver), atau corporate training. Potensi viral di TikTok/Instagram.

CHALLENGES_&_SOLUTIONS:
- Technical: Akurasi vision di cahaya buruk → Gemini Live sudah handle + fallback prompt “jelaskan apa yang kamu lihat”.
- Ethical: Tidak ganti ahli profesional → tambah disclaimer + saran “kalau serius, konsultasi expert”. Privacy: Semua processing on-device/cloud dengan consent, no simpan video user.
- Regulatory: Sesuai Google AUP & GDPR-like di Indonesia. Dual-use: Tidak ada risiko harmful.
- Bonus untuk juri: Demo video tunjukkan interruptible conversation (user bilang “stop” atau “lebih pelan”) + visual correction.

RESEARCH_PAPERS_REF:
- Inspired by: Gemini Technical Report (Google 2025) + “Segment Anything Model 2” (Meta 2024) untuk vision grounding.
- Industry reports: Google Cloud Next 2025 keynote tentang multimodal agents.

TREND_ALIGNMENT:
- 100% leverage 2026 trends: Multimodal Live Agents, real-time vision streaming, personalized education, edge-to-cloud inference.
- Future-proof: Bisa evolve ke AR glasses atau multi-user group coaching.