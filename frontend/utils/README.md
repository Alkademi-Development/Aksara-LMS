# 📁 Folder `utils`

Folder `utils` berisi utilitas atau helper function yang digunakan di seluruh lingkungan proyek. Fungsi atau class dalam folder ini bersifat reusable dan tidak bergantung langsung pada state komponen atau UI.

## 📝 httpClient.js 

`httpClient.js` adalah utilitas yang digunakan untuk menangani komunikasi HTTP dengan API eksternal. File ini membungkus Axios dalam sebuah class bernama `HTTPClient`

### Tujuan:

- Menyediakan antarmuka HTTP yang seragam di seluruh aplikasi.
- Menyederhanakan penggunaan header seperti token otentikasi (`Authorization`) dan `lmsId`.
- Memusatkan konfigurasi `baseURL` dan timeout.
- Menambahkan **interceptor** secara otomatis sebelum permintaan dikirim.