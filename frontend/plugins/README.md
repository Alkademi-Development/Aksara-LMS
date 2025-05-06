# 📁 Folder `plugins`

Folder `plugins` pada proyek NuxtJS 3 digunakan untuk mendaftarkan dan menginisialisasi plugin-plugin yang akan dijalankan secara global sebelum aplikasi dirender. File di dalam folder ini secara otomatis akan dijalankan oleh Nuxt saat aplikasi dimulai.

---

## 🔧 Tujuan Penggunaan

- Menginisialisasi library pihak ketiga (misalnya Axios, Vue Plugins, dan lainnya).
- Mengonfigurasi instance global yang dibutuhkan di banyak tempat dalam aplikasi.
- Mengakses dan menyuntikkan nilai ke dalam context Nuxt (`app`, `store`, `router`, dll).
- Register global helper atau utilitas seperti `httpClient`.

---

## 📄 Contoh: `httpClient.js`

File `httpClient.js` di folder `plugins` bertanggung jawab untuk menginisialisasi klien HTTP (`httpClient`) dengan base URL yang diambil dari konfigurasi runtime (`useRuntimeConfig()`).

### Isi Plugin:

```js
import { httpClient } from '@/utils/httpClient'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  httpClient.init(config.public.servicesApi)
})
