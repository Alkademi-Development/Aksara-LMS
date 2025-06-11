export default {
    inputCategories: [
        { name: 'name', label: 'Nama Kategori *', type: 'text', value: '', placeholder: '', required: true },
        { name: 'score', label: 'Nilai *', type: 'number', value: '', placeholder: '', required: true },
    ],
    inputFormPacket: [
        { name: 'title', label: 'Nama Paket *', type: 'text', value: '', placeholder: '', required: true },
        { name: 'description', label: 'Deskripsi', type: 'textarea', value: '', placeholder: '', required: false },
        { name: 'timer', label: 'Durasi Pengerjaan', type: 'number', value: 0, description: 'Isi dengan satuan menit. Contoh: 60 (1 Jam)', required: false },
        { name: 'formType', label: 'Tipe  *', type: 'select', placeholder: '', value: 'basic',  options: [
            { value: 'basic', text: 'Basic', disabled: false },
            { value: 'quiz', text: 'Quiz', disabled: false },
        ] },
        { name: 'randomize', label: 'Acak Soal Berdasarkan Kategori', type: 'select', value: '', placeholder: '', required: false },
    ],
    inputFormPacketQuestion: [
        { name: 'image', label: 'Cover', type: 'image', value: '', placeholder: '', required: false },
        { name: 'question', label: 'Pertanyaan *', type: 'textarea', value: '', placeholder: '', required: true },
        { name: 'type', label: 'Tipe  *', type: 'select', placeholder: '', value: 'choice',  options: [
            { value: "short_text", text: "Text Pendek", disabled: false },
            { value: "long_text", text: "Text Panjang", disabled: false },
            { value: "number", text: "Nomor", disabled: false },
            { value: "email", text: "Email", disabled: false },
            { value: "password", text: "Password", disabled: false },

            { value: "divider", text: "", disabled: true },

            { value: "choice", text: "Pilihan Ganda", disabled: false },
            { value: "multiple_choice", text: "Kotak Centang", disabled: false },
            { value: "dropdown", text: "Drop Down", disabled: false },

            { value: "divider", text: "", disabled: true },
            
            { value: "date", text: "Tanggal", disabled: false },
            { value: "time", text: "Waktu", disabled: false } ,

            { value: "divider", text: "", disabled: true },

            { value: "file", text: "Upload File", disabled: false },
            { value: "image", text: "Upload Image", disabled: false },

        ] },
        { name: 'category', label: 'Kategori  *', type: 'select', placeholder: '', value: ''},
        { name: 'choices', label: 'Pilihan *', type: 'choices', value: '', placeholder: '', required: true },
    ],
}