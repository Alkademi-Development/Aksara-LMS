export default {
    inputFormCourse: [
        { name: 'cover', label: 'Cover', type: 'image', value: '', placeholder: '', required: false },
        { name: 'color', label: 'Color Background *', type: 'color', value: '', placeholder: '', required: true },
        { name: 'title', label: 'Judul Materi *', type: 'text', value: '', placeholder: '', required: true },
        { name: 'description', label: 'Deskripsi Materi *', type: 'wysiwyg', value: '', placeholder: '', required: true },
        // { name: 'description', label: 'Deskripsi Materi *', type: 'textarea', value: '', placeholder: '', required: true },
        { name: 'price', label: 'Harga Materi *', type: 'number', value: '0', placeholder: '0', required: true },
        { name: 'minScore', label: 'Standar Kelulusan *', type: 'number', value: '', placeholder: 'Masukan nilai 0 - 100', required: true} ,
        // { name: 'summary', label: 'Ringkasan Materi *', type: 'wysiwyg', value: '', placeholder: '', required: true },
        // { name: 'summary', label: 'Ringkasan Materi *', type: 'textarea', value: '', placeholder: '', required: true },
        // { name: 'type', label: 'Tipe *', type: 'select', value: 'module', placeholder: 'Module / Pretest', required: true, options: [{ value: 'module', text: 'Modul' }, { value: 'pretest', text: 'Pretest'}] },
    ],
    inputFormModule: [
        { name: 'title', label: 'Judul *', type: 'text', value: '', placeholder: '', required: true },
        { name: 'description', label: 'Deskripsi *', type: 'textarea', value: '', placeholder: '', required: true },
        { name: 'attachments', label: 'File', type: 'text', value: '', placeholder: 'Link Embed', required: false },
        { name: 'course', label: 'Materi *', type: 'select', value: '', placeholder: '', required: true, options: [] },
        { name: 'kind', label: 'Jenis *', type: 'select', value: '', placeholder: '', required: true, options: [{ value: 'assignment', text: 'Tugas' }, { value: 'course', text: 'Materi'}] },
        { name: 'type', label: 'Tipe *', type: 'select', value: 0, placeholder: '', required: true, options: [{ value: 'disabled', text: 'Pilih salah satu', disabled: true }, { value: 'link', text: 'Link'}, { value: 'file', text: 'File'}, { value: 'form', text: 'Formulir'}, { value: 'studio', text: 'Editor'}] },
        { name: 'deadline', label: 'Deadline', type: 'datetime-local', value: null, placeholder: '', required: false },
        { name: 'startDate', label: 'Jadwalkan Publish', type: 'datetime-local', description: 'Tugas akan terpublish sesuai tanggal yang ditentukan', value: null, placeholder: '', required: false },
        { name: 'reassignable', label: 'Bisa Kerjakan Ulang?', type: 'checkbox', value: '', placeholder: '', required: false },
    ],
    inputFormBundleContent: [
        { name: 'cover', label: 'Cover', type: 'image', value: '', placeholder: '', required: false },
        { name: 'color', label: 'Color Background *', type: 'color', value: '', placeholder: '', required: true },
        { name: 'title', label: 'Judul Paket *', type: 'text', value: '', placeholder: '', required: true },
        // { name: 'description', label: 'Deskripsi Bundle *', type: 'wysiwyg', value: '', placeholder: '', required: true },
        { name: 'description', label: 'Deskripsi Paket *', type: 'wysiwyg', value: '', placeholder: '', required: true },
    ],
    inputFormBundleAttribute: [
        // { name: 'category', label: 'Kategori *', type: 'select', value: '', placeholder: 'Pilih Kategori Bundle', required: true, options: [] },
        { name: 'price', label: 'Harga *', type: 'number', value: '0', placeholder: '0', required: true },
    ],
    inputFormListMateri: [
        { name: 'materi', label: 'List Materi *', type: 'select', value: '', placeholder: 'Pilih Materi', required: true, options: [] },
    ],
    colorTemplate: [
        { color: "#FFE1CC", isSelect: false },
        { color: "#D3F5EC", isSelect: false },
        { color: "#E3DBFA", isSelect: false },
        { color: "#DFF3FE", isSelect: false },
        { color: "#FBE2F4", isSelect: false },
        { color: "#ECEFF4", isSelect: false },
    ]
}