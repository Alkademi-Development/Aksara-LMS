export default {
    inputForm: [
        { name: 'groupLink', label: 'Grup Kelas *', type: 'url', value: '', placeholder: 'Tambahkan link grup (Whatsapp/Telegram)', required: true },
    ],
    inputFormTes: [
        { name: 'groupLink', label: 'Grup Tes *', type: 'url', value: '', placeholder: 'Tambahkan link grup (Whatsapp/Telegram)', required: true },
    ],
    inputFormMeet: [
        { name: 'customLink', label: 'Link Meet', type: 'url', value: '', placeholder: '', required: false },
        { name: 'schedule', label: 'Jadwal *', type: 'datetime-local', value: '', placeholder: '', required: true },
    ],
    inputFormAssignTask: [
        { name: 'repository', label: 'Link File Tugas *', type: 'url', value: '', placeholder: 'Github / Google Drive', required: true },
        // { name: 'studentNotes', label: 'Catatan', type: 'text', value: '', placeholder: '', required: false },
        { name: 'files', label: 'File Tugas (Opsional - max 2 mb)', type: 'file', value: '', placeholder: '', required: false, accept: '*' },
    ],
    inputFormVerifyTask: [
        { name: 'score', label: 'Nilai *', type: 'number', value: '', placeholder: '', required: true },
        { name: 'mentorNotes', label: 'Catatan', type: 'textarea', value: '', placeholder: '', required: false }
    ],
    inputAssignLink: [
        { name: 'file', label: 'File Tugas *', type: 'file', value: '', placeholder: '', required: true },
        { name: 'link', label: 'Link File Tugas *', type: 'url', value: '', placeholder: '', required: true },
    ],
    taskFields: [
        { key: "index", label: 'No' },
        { key: 'name', label: 'Nama' },
        { key: 'task', label: 'Tugas' },
        { key: 'submited_at', label: 'Tanggal Pengumpulan' },
        { key: 'score', label: 'Nilai' },
        { key: 'action', label: '', class: 'text-right' }
    ],
    quizFields: [
        { key: "index", label: 'No' },
        { key: 'title', label: 'Judul' },
        { key: 'timer', label: 'Waktu Pengerjaan' },
        { key: 'questions', label: 'Jumlah Soal' },
        { key: 'respondents', label: 'Perespon' },
        { key: 'submitted', label: 'status' }, 
        { key: 'action', label: '', class: 'text-right' }
    ],
    responFields: [
        { key: "index", label: 'No' },
        { key: 'name', label: 'Nama' },
        { key: 'action', label: '', class: 'text-right' }
    ]
}