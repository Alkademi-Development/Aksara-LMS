export default {
    inputForm: [
        { name: 'title', label: 'Judul *', type: 'text', value: '', placeholder: '', required: true },
        { name: 'start', label: 'Mulai Event *', type: 'datetime-local', value: '', placeholder: '', required: true },
        { name: 'end', label: 'Tutup Event *', type: 'datetime-local', value: '', placeholder: '', required: true },
        { name: 'cover', label: 'Cover', type: 'file', value: '', placeholder: '', required: false },
        { name: 'file', label: 'File', type: 'file', value: '', placeholder: '', required: false },
        { name: 'link', label: 'Url Meeting *', type: 'text', value: '', placeholder: '', required: true },
    ],
}