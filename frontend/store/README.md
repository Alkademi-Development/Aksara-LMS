# 📁 Folder `store`

Folder `store` digunakan untuk mengelola **state management** aplikasi dengan menggunakan **Vuex**, yang merupakan salah satu solusi populer dalam ekosistem Vue untuk mengatur data global aplikasi secara terstruktur dan konsisten.

## 🧱 Struktur Folder
store/ 
├── index.js → Inisialisasi root store (Vuex) 
└── modules/ 
    ├── index.js → Auto-import semua store module 
    └── sass.store.js

## ⚙️ `store/index.js` – Root Store

File ini menginisialisasi Vuex store dan menggabungkan seluruh modul dari `store/modules`.

```js
import { createStore } from 'vuex'
import modules from "@/store/modules/index"

const debug = process.env.NODE_ENV === 'production'

const store = createStore({
  modules,
  strict: debug
})

export default store
```


## 🔄 store/modules/index.js – Auto Import Module

File ini secara otomatis memuat semua file .store.js dalam folder modules dan mendaftarkannya sebagai modul Vuex.

```js
const modules = {}

const files = import.meta.glob('./*.js', { eager: true })

for (const path in files) {
  const name = path
    .replace('./', '')
    .replace('.store.js', '')
  modules[name] = files[path].default
}

export default modules
```
