export default {
    inputForm: [
        { name: 'logo', label: 'Logo', type: 'image', value: '', placeholder: '', required: false },
        { name: 'name', label: 'Judul Program *', type: 'text', value: '', placeholder: '', required: true },
        { name: 'summary', label: 'Summary *', type: 'textarea', value: '', placeholder: '', required: true },
        { name: 'description', label: 'Deskripsi Program *', type: 'textarea', value: '', placeholder: '', required: true },
        { name: 'method', label: 'Metode Pembelajaran *', type: 'text', value: '', placeholder: '', required: true },
        { name: 'totalMeeting', label: 'Jumlah Pertemuan *', type: 'number', value: '', placeholder: '', required: true },
    ],

    inputAkselerasiForm: [
        { name: 'cover', label: 'Cover', type: 'file', value: '', placeholder: '', required: false },
        { name: 'title', label: 'Judul Program *', type: 'text', value: '', placeholder: '', required: true }, 
        { name: 'content', label: 'Deskripsi Program *', type: 'wysiwyg', value: '', placeholder: '', required: true },
        { 
            name: 'advantages', 
            label: 'Keunggulan Program', 
            type: 'multitext',
            items: [
                [
                    {
                        label: 'title',
                        type: 'text',
                        value: '',
                        placeholder: 'Judul',
                        required: false
                    },
                    {
                        label: 'description',
                        type: 'text',
                        value: '',
                        placeholder: 'Deskripsi',
                        required: false
                    }
                ]
            ]
        },
        { 
            name: 'conditions', 
            label: 'Persyaratan Program', 
            type: 'multitext', 
            items: [
                [
                    {
                        label: 'title',
                        type: 'text',
                        value: '',
                        placeholder: 'Judul',
                        required: false
                    },
                    {
                        label: 'description',
                        type: 'text',
                        value: '',
                        placeholder: 'Deskripsi',
                        required: false
                    }
                ]
            ]
        },
        { 
            name: 'terms', 
            label: 'Ketentuan Program', 
            type: 'multitext', 
            items: [
                [
                    {
                        label: 'title',
                        type: 'text',
                        value: '',
                        placeholder: 'Judul',
                        required: false
                    },
                    {
                        label: 'description',
                        type: 'text',
                        value: '',
                        placeholder: 'Deskripsi',
                        required: false
                    }
                ]
            ]
        },
        { name: 'link', label: 'Link Program*', type: 'text', value: '', placeholder: '', required: true }, 
        { name: 'start', label: 'Dimulai *', type: 'date', value: '', placeholder: '', required: true },
        { name: 'end', label: 'Berakhir *', type: 'date', value: '', placeholder: '', required: true },

    ]
}