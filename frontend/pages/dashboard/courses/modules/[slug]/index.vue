<template>
    <div class="d-flex">
    
        <transition name="fade-right">
            <aside
                :class="[
                'module-sidebar d-flex flex-column position-fixed border-end bg-white max-w-xs w-100',
                isSidebarExpanded ? 'expanded' : 'collapsed',
                ]"
            >
                <!-- Tombol Expand Sidebar -->
                <button
                    class="expand-sidebar-btn d-flex d-lg-none align-items-center justify-content-center"
                    @click="toggleSidebar"
                >
                <i
                    :class="isSidebarExpanded ? 'ri-arrow-left-s-line' : 'ri-arrow-right-s-line'"
                    class="text-white text-2xl"
                ></i>
                </button>
                <div class="py-5 px-4 d-flex flex-column flex-grow-1">
                    <ul class="d-flex flex-column gap-3 flex-grow-1">
                        <li>
                        <NuxtLink to="#" class="d-flex align-items-center gap-2 text-primary">
                            <i class="ri-sticky-note-line text-lg"></i>
                            <span class="fw-medium text-limit limit-1">Overview</span>
                        </NuxtLink>
                        </li>
                        <li class="d-flex align-items-center gap-2">
                        <NuxtLink to="#" class="d-flex align-items-center gap-2 text-black">
                            <i class="ri-file-list-line text-lg"></i>
                            <span class="fw-medium text-limit limit-1">BAB 1 – Yuk Kenalan dengan Algoritma!</span>
                        </NuxtLink>
                        <div class="d-flex align-items-center gap-1">
                            <button type="button"><i class="ri-pencil-line text-lg"></i></button>
                            <button type="button" class="text-danger"><i class="ri-delete-bin-line text-lg"></i></button>
                        </div>
                        </li>
                    </ul>
                <div class="mt-auto">
                    <NuxtLink to="#" class="btn btn-primary w-100">
                    Tambah Module +
                    </NuxtLink>
                </div>
                </div>
            </aside>
        </transition>
  
        <!-- Konten utama -->
        <main class="module-main-content flex-grow-1 ps-4 pe-3 py-5">
            <div class="px-5 py-4 bg-white border rounded">
                <div v-html="htmlContent"></div>
            </div>
        </main>
    </div>
</template>

<script setup>

const htmlContent = `<h2 style="line-height: 150%"><strong>BAB 2 – Kenalan dengan Minecraft Education dan MakeCode</strong></h2><hr contenteditable="false"><h3 style="line-height: 150%">🎯 Apa yang Akan Kita Pelajari?</h3><p style="line-height: 200%">Di bab ini, kamu akan belajar:</p><ol class="list-decimal"><li><p style="line-height: 200%">Apa itu <strong>Minecraft Education Edition</strong>.</p></li><li><p style="line-height: 200%">Kenapa Minecraft Education adalah tempat yang tepat untuk belajar.</p></li><li><p style="line-height: 200%">Apa itu <strong>MakeCode</strong> dan bagaimana cara menggunakannya.</p></li><li><p style="line-height: 200%">Mengapa <strong>Minecraft Education</strong> dan <strong>MakeCode</strong> adalah kombinasi yang seru dan bermanfaat untuk belajar coding dan algoritma.</p></li></ol><hr contenteditable="false"><h3 style="line-height: 150%">1. 🌍 <strong>Kenalan dengan Minecraft Education Edition</strong></h3><p style="line-height: 200%"><strong>Minecraft Education Edition</strong> adalah versi khusus dari game <strong>Minecraft</strong> yang dirancang untuk belajar sambil bermain. Minecraft Education dibuat untuk <strong>mendidik</strong> dan <strong>mengembangkan keterampilan</strong> seperti <strong>berpikir logis</strong>, <strong>pemecahan masalah</strong>, dan <strong>kerja sama tim</strong>.</p><ul class="list-disc"><li><p style="line-height: 200%"><strong>Membuat Dunia Virtual</strong>: Di Minecraft, kamu bisa <strong>membangun dunia</strong> sendiri. Mulai dari membuat rumah, taman, atau bahkan menciptakan sistem kota lengkap dengan bangunan dan alat transportasi.</p></li><li><p style="line-height: 200%"><strong>Menyelesaikan Tantangan</strong>: Selain itu, Minecraft Education menawarkan <strong>tantangan pendidikan</strong> yang membantu kamu belajar berbagai mata pelajaran, mulai dari matematika, sains, hingga pemrograman (coding).</p></li><li><p style="line-height: 200%"><strong>Belajar Bersama Teman</strong>: Kamu bisa bekerja sama dengan teman-teman untuk menyelesaikan tantangan atau membangun proyek besar di dunia Minecraft. Dengan cara ini, kamu bisa <strong>belajar</strong> dan <strong>bermain</strong> secara bersamaan!</p></li></ul><p style="line-height: 200%">Minecraft Education memberikan pengalaman belajar yang sangat seru dan mendalam karena bisa <strong>bermain sambil belajar</strong>.</p><hr contenteditable="false"><h3 style="line-height: 150%">2. 🧩 <strong>Apa Itu MakeCode?</strong></h3><p style="line-height: 200%"><strong>MakeCode</strong> adalah platform coding visual yang <strong>memudahkan anak-anak belajar pemrograman</strong> dengan cara yang sangat menyenangkan. Di MakeCode, kamu tidak perlu menulis kode dalam bentuk teks yang rumit. Sebaliknya, kamu akan menggunakan <strong>blok-blok perintah</strong> yang bisa disusun seperti puzzle untuk membuat program.</p><ul class="list-disc"><li><p style="line-height: 200%"><strong>Blok Perintah</strong>: Setiap blok mewakili satu perintah. Kamu cukup menarik dan menyusun blok-blok ini untuk memberi instruksi pada komputer. Misalnya, ada blok yang memberi perintah untuk <strong>bergerak maju</strong>, ada yang untuk <strong>berputar</strong>, dan ada yang untuk <strong>mengulang langkah-langkah tertentu</strong>.</p></li><li><p style="line-height: 200%"><strong>Visual dan Interaktif</strong>: Karena MakeCode menggunakan <strong>blok visual</strong>, kamu bisa langsung melihat dan memahami apa yang sedang terjadi. Ini membuat belajar coding jadi lebih mudah dan menyenangkan!</p></li><li><p style="line-height: 200%"><strong>Menghubungkan dengan Minecraft</strong>: Di Minecraft Education, kamu bisa menggunakan MakeCode untuk memberi perintah pada <strong>Agent</strong>, yaitu robot virtual yang akan membantu kamu menyelesaikan tugas di dunia Minecraft. Kamu bisa membuat Agent bergerak, menggali tanah, menanam pohon, dan banyak lagi!</p></li></ul><hr contenteditable="false"><h3 style="line-height: 150%">3. 🧍‍♂️ Mengenal Agent – Asisten Virtualmu</h3><div data-v-35161491="" data-node-view-wrapper="" class="embedlink" style="white-space: normal;" draggable="true" data-drag-handle="" contenteditable="false"><div data-v-35161491="" class="embedlink-wrapper"><a data-v-35161491="" href="https://drive.google.com/file/d/1lgVS1FTwLrrWRJglVYx44stMadILNRTA/preview" target="_blank" class="link-item d-none">https://drive.google.com/file/d/1lgVS1FTwLrrWRJglVYx44stMadILNRTA/preview</a> <iframe data-v-35161491="" allow="fullscreen *" src="https://drive.google.com/file/d/1lgVS1FTwLrrWRJglVYx44stMadILNRTA/preview" frameborder="https://drive.google.com/file/d/1lgVS1FTwLrrWRJglVYx44stMadILNRTA/preview" width="100%" height="100%"></iframe></div></div><p style="line-height: 200%">Di dunia Minecraft Education, kamu memiliki <strong>teman khusus bernama Agent</strong>.</p><p style="line-height: 200%">Agent adalah robot kecil yang bisa:</p><ul class="list-disc"><li><p style="line-height: 200%">Bergerak sesuai perintah</p></li><li><p style="line-height: 200%">Membawa dan menaruh blok</p></li><li><p style="line-height: 200%">Membantu bertani, menanam, bahkan menyelesaikan labirin</p></li></ul><p style="line-height: 200%">Tapi Agent <strong>tidak bisa bergerak sendiri</strong>.<br>Ia hanya akan bertindak <strong>kalau kamu memberinya perintah lewat blok MakeCode.</strong></p><p style="line-height: 200%">🧠 <strong>Ingat:</strong><br>Di bab-bab berikutnya, kamu akan belajar bagaimana menyuruh Agent melakukan tugas-tugas seperti membangun pagar, membajak tanah, atau mencari jalan keluar. Seru kan?</p><hr contenteditable="false"><h3 style="line-height: 150%">4. 💡 <strong>Kenapa Menggunakan Minecraft dan MakeCode?</strong></h3><p style="line-height: 200%">Sekarang, kamu mungkin bertanya-tanya, <strong>kenapa harus Minecraft dan MakeCode? Apa bedanya dengan cara belajar lainnya?</strong></p><p style="line-height: 200%">Berikut beberapa alasan kenapa <strong>Minecraft Education</strong> dan <strong>MakeCode</strong> adalah pilihan yang bagus:</p><ul class="list-disc"><li><p style="line-height: 200%"><strong>Pembelajaran yang Menyenangkan</strong>: Minecraft adalah game yang sangat disukai banyak anak. Dengan Minecraft Education, kamu bisa belajar sambil bermain, yang membuat proses belajar jadi <strong>lebih seru</strong>.</p></li><li><p style="line-height: 200%"><strong>Belajar Pemrograman dengan Cara yang Mudah</strong>: MakeCode memudahkan kamu untuk belajar coding menggunakan <strong>blok-blok visual</strong> yang membuat kamu lebih mudah memahami konsep-konsep dasar dalam pemrograman.</p></li><li><p style="line-height: 200%"><strong>Meningkatkan Keterampilan Kritis</strong>: Saat kamu menyusun perintah di MakeCode, kamu belajar untuk berpikir secara <strong>logis</strong> dan <strong>terstruktur</strong>, yang sangat berguna dalam menyelesaikan masalah di dunia nyata. Misalnya, menyusun urutan langkah dalam membuat sesuatu (seperti algoritma), yang dapat membantu kamu di kehidupan sehari-hari dan dalam pelajaran.</p></li><li><p style="line-height: 200%"><strong>Kerja Sama Tim</strong>: Di Minecraft, kamu bisa bekerja bersama teman-teman untuk menyelesaikan tantangan dan membangun sesuatu. Ini meningkatkan keterampilan <strong>kerja sama</strong> dan <strong>komunikasi</strong>.</p></li><li><p style="line-height: 200%"><strong>Kreativitas Tanpa Batas</strong>: Di Minecraft, kamu bisa berkreasi sesuka hati, membuat dunia impianmu, dan mengekspresikan ide-ide kreatif dalam bentuk 3D. Ini memberi kesempatan bagi kamu untuk berpikir lebih <strong>kreatif</strong> dan inovatif.</p></li></ul><hr contenteditable="false"><h3 style="line-height: 150%">5. 🔧 <strong>Cara Menggunakan Minecraft dan MakeCode</strong></h3><p style="line-height: 200%">Sekarang kamu sudah tahu kenapa Minecraft dan MakeCode sangat seru dan bermanfaat! Lalu, bagaimana cara menggunakannya?</p><ol class="list-decimal"><li><p style="line-height: 200%"><strong>Buka Minecraft Education Edition</strong> di perangkatmu.</p></li><li><p style="line-height: 200%">Pilih dunia yang ingin kamu mainkan, lalu buka <strong>MakeCode</strong> untuk memulai membuat program.</p></li><li><p style="line-height: 200%">Di dalam MakeCode, kamu akan melihat berbagai <strong>blok perintah</strong> yang bisa kamu pilih dan susun untuk memberi perintah pada Agent.</p></li><li><p style="line-height: 200%"><strong>Susun blok-blok perintah</strong> dengan urutan yang benar, lalu klik <strong>Run</strong> untuk melihat hasilnya di Minecraft!</p></li></ol><p style="line-height: 200%">Dengan menggunakan <strong>MakeCode</strong> di Minecraft, kamu bisa memberi perintah pada Agent untuk melakukan berbagai tugas seru, seperti membuat pagar, menggali tanah, menanam bunga, dan banyak lagi!</p><hr contenteditable="false"><h3 style="line-height: 150%">📌 <strong>Kesimpulan Bab 2</strong></h3><ul class="list-disc"><li><p style="line-height: 200%"><strong>Minecraft Education Edition</strong> adalah game yang menyenangkan dan mendidik di mana kamu bisa belajar berbagai keterampilan sambil bermain.</p></li><li><p style="line-height: 200%"><strong>MakeCode</strong> adalah platform pemrograman visual yang memungkinkan kamu untuk belajar coding dengan <strong>blok perintah</strong> yang mudah dipahami.</p></li><li><p style="line-height: 200%">Menggunakan <strong>Minecraft</strong> dan <strong>MakeCode</strong> bersama-sama memungkinkan kamu untuk <strong>bermain, belajar, dan berkreasi</strong> dengan cara yang seru dan interaktif.</p></li><li><p style="line-height: 200%">Dengan <strong>Minecraft</strong> dan <strong>MakeCode</strong>, kamu belajar cara berpikir logis, mengatur urutan langkah (algoritma), dan meningkatkan keterampilan dalam memecahkan masalah.</p></li></ul>`;


const isSidebarExpanded = ref(false)

const toggleSidebar = () => {
  isSidebarExpanded.value = !isSidebarExpanded.value
}

const checkScreenSize = () => {
  const tabletMediaQuery = window.matchMedia('(min-width: 992px)')
  isSidebarExpanded.value = tabletMediaQuery.matches;
}

onMounted(() => {
  checkScreenSize()

  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

</script>
  
<style lang="scss" scoped>

.expand-sidebar-btn {
  background-color: var(--primary); /* Warna tombol */
  border: none;
  border-radius: 0 15px 15px 0;
  color: white;
  width: 25px;
  height: 80px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  position: absolute;
  right: -25px; /* Tetap terlihat di luar sidebar */
  top: 30%; /* Posisikan di tengah secara vertikal */
  transform: translateY(-50%);
  z-index: 15; /* Pastikan tombol di atas sidebar */

  i {
    // transform: translateX(2px);
  }
}

.module-sidebar {
    top: 16.5%; 
    height: calc(100vh - 120px);
    z-index: 10; 
    transition: transform 0.3s ease-in-out; /* Transisi hanya untuk posisi */

    &.collapsed {
        transform: translateX(-320px); /* Sidebar tersembunyi tetapi tombol tetap terlihat */
    }

    &.expanded {
        transform: translateX(0); /* Sidebar muncul sepenuhnya */
    }
}
  
.module-main-content {
    margin-left: 320px; /* Pastikan ada ruang untuk sidebar */
    transition: margin-left 0.3s ease-in-out;
    
    @media (max-width: 992px) {
        margin-left: 0px;
    }

    &.collapsed {
        margin-left: 40px; /* Jika sidebar tersembunyi */
    }
}
</style>