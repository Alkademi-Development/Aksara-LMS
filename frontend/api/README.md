# 📁 Folder `api`

Folder api pada proyek ini berfungsi untuk menyimpan berbagai file yang berhubungan dengan permintaan (request) API. Setiap file dalam folder ini biasanya berisi fungsi-fungsi API yang digunakan untuk mengakses data atau melakukan aksi tertentu melalui endpoint- endpoint yang disediakan oleh server.

# Struktur dan Fungsi di Dalam Folder api

Pada contoh yang ada, ada file sass.api.js yang berisi fungsi apiGetAllSettings. Fungsi ini digunakan untuk mengirimkan permintaan ke server (endpoint API) dan mengambil data pengaturan (settings) untuk versi tertentu dari CMS yang digunakan.

## Contoh fungsi di sass.api.js:

```js
import { httpClient } from "@/utils/httpClient"

const apiGetAllSettings = (version) => httpClient.get(`${version}/cms/app/settings`)

export {
    apiGetAllSettings
}
```

Di sini, httpClient.get digunakan untuk mengirimkan permintaan GET ke server untuk mendapatkan semua pengaturan CMS. Fungsi apiGetAllSettings menerima parameter version yang menentukan versi API yang digunakan.

# Hubungan dengan httpClient

Fungsi-fungsi yang ada di dalam folder api seperti apiGetAllSettings memanfaatkan httpClient untuk melakukan permintaan ke server. httpClient adalah instance terpusat yang bertugas untuk menangani seluruh permintaan HTTP, baik itu GET, POST, PUT, PATCH, atau DELETE.

httpClient menggunakan library Axios untuk melakukan permintaan HTTP dan menangani konfigurasi dasar seperti header, otentikasi, dan pengaturan lainnya. Fungsi get, post, put, patch, dan delete yang ada dalam httpClient adalah pembungkus dari metode HTTP standar yang disediakan oleh Axios, sehingga Anda tidak perlu menulis konfigurasi permintaan secara berulang-ulang.

## Contoh penggunaan httpClient di apiGetAllSettings:

```js
const apiGetAllSettings = (version) => httpClient.get(`${version}/cms/app/settings`)
```

ada contoh di atas, httpClient.get digunakan untuk mengirim permintaan GET ke endpoint yang ada di server dengan URL yang bersifat dinamis, tergantung pada parameter version yang diterima oleh fungsi. Begitu server merespons, data pengaturan (settings) akan diterima dan dapat digunakan di aplikasi.