# 📁 Folder `pages`

Folder `pages` digunakan untuk mendefinisikan struktur halaman (routes) dalam aplikasi. NuxtJS 3 secara otomatis akan mengubah struktur file dan folder di dalam `pages/` menjadi URL atau path yang bisa diakses oleh pengguna.

---

## 🔧 Cara Kerja Routing Otomatis

Setiap file `.vue` di dalam folder `pages/` akan menjadi satu route di aplikasi.

---

## 📄 Konvensi Penamaan File

- `index.vue` → Halaman utama dari direktori tersebut.
- `[param].vue` → Dynamic route (contoh: `[id].vue` untuk `/users/123`).
- `[...slug].vue` → Catch-all route untuk sisa path (misalnya `/blog/2023/01/nuxt`).

---

## ✍️ Cara Menambahkan Halaman Baru

1. Buat file `.vue` baru di dalam folder `pages/`, contoh: `faq.vue`
2. Secara otomatis akan tersedia di path `/faq`
3. Tambahkan konten menggunakan struktur Vue 3 + Composition API atau `<script setup>`

### Contoh:

```vue
<!-- pages/faq.vue -->
<template>
  <h1>FAQ</h1>
</template>

<script setup>
// Logic khusus halaman ini bisa ditulis di sini
</script>