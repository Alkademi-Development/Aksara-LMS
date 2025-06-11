export default {
    inputFormStudio: [
        { name: 'name', label: 'Nama Studio *', type: 'text', value: '', placeholder: '', required: true },
        { name: 'module', label: 'Modul *', type: 'text', value: '', placeholder: 'Link Google Drive (Isi dengan # jika tidak mempunyai modul)', required: true },
        { name: 'timer', label: 'Durasi Pengerjaan', type: 'number', value: 0, description: 'Isi dengan satuan menit. Contoh: 60 (1 Jam)', required: false },
        { name: 'associatedFileExtension', label: 'Ekstensi File *', type: 'select', value: '', placeholder: ''},
    ],
}