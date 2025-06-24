export default {
    inputFormOverview: [
        { name: 'name', label: 'Nama *', type: 'text', value: '', placeholder: '', required: true },
        { name: 'logo', label: 'Logo', type: 'image', value: '', placeholder: '', required: false },
        { name: 'description', label: 'Deskripsi *', type: 'textarea', value: '', placeholder: '', required: true },
        { name: 'tags', label: 'Tags (Optional)', type: 'textarea', value: '', placeholder: '', description: '* Contoh: seleksi, PHP (Pisahkan setiap kalimat dengan koma!)', required: false },
        // { name: 'quota', label: 'Kuota *', type: 'number', value: '', placeholder: '', required: true },
        // { name: 'minScore', label: 'Standar Kelulusan *', type: 'number', value: '', placeholder: '', description: '* Masukan nilai 0 - 100', required: true },
        // { name: 'registrantCity', label: 'Kota Pendaftar *', type: 'select', value: '', placeholder: 'Cari Atau Pilih Kota Pendaftar', required: true},
        // { name: 'cityHeld', label: 'Kota Pelaksanaan', type: 'select', value: '', placeholder: 'Cari Atau Pilih Kota Pelaksanaan', required: true},
        // { name: 'type', label: 'Tipe Kelas *', type: 'select',  value: 0, placeholder: '',  
        //     options: [
        //         { value: 'bootcamp', label: 'Belajar' }, 
        //         { value: 'test', label: 'Tes'}
        //     ] 
        // },
        { name: 'visibility', label: 'Tipe Kelas *', type: 'select',  value: 0, placeholder: '',  
            options: [
                { value: 'public', label: 'Terbuka' }, 
                { value: 'private', label: 'Tertutup'}
            ] 
        },
        { name: 'schools', label: 'Pilih Sekolah', type: 'select', value: '', placeholder: 'Cari Atau Pilih Sekolah', required: false },
        { name: 'price', label: 'Harga kelas (Rp)', type: 'number', value: 0, placeholder: '', required: false, description: '* Minimal harga Rp10.000. Beri nilai 0 jika kelas gratis.'},

    ],
    inputFormDetail: [    
        { name: 'programId', label: 'Masukkan Kelas Ke Program *', type: 'select', value: '', placeholder: 'Pilih Program', required: true },

        { name: 'mode', label: 'Mode kelas *', type: 'select', value: 0, placeholder: '', 
            options: [
                { value: 'online', label: 'Online' }, 
                { value: 'offline', label: 'Offline'}, 
                { value: 'hybrid', label: 'Hybrid'}
            ] 
        },

        { name: 'type', label: 'Tipe Kelas *', type: 'select',  value: 0, placeholder: '',  
            options: [
                { value: 'bootcamp', label: 'Belajar' }, 
                { value: 'test', label: 'Tes'}
            ] 
        },
        
        // { name: 'level', label: 'Fase *', type: 'select', value: 0, placeholder: '', 
        //     options: [
        //         { value: 1, label: 'Fase 1' }, 
        //         { value: 2, label: 'Fase 2'}, 
        //         { value: 3, label: 'Fase 3'}
        //     ] 
        // },

        { name: 'prerequisite', label: 'Prasyarat Kelas', type: 'select', value: '', placeholder: 'Pilih Kelas', required: false },
        
        { name: 'visibility', label: 'Aksesibilitas *', type: 'select',  value: 0, placeholder: '',  
            options: [
                { value: 'public', label: 'Terbuka' }, 
                { value: 'private', label: 'Tertutup'}
            ] 
        },

        { name: 'mentors', label: 'Mentor', type: 'select', value: '', placeholder: 'Cari Atau Pilih Mentor', value: 'default',  options: [{ value: 'default', text: 'Cari Atau Pilih Email Mentor', disabled: true }, { value: 'email1', text: 'email1@gmail.com' }, { value: 'email2', text: 'email2@gmail.com'}] },
        // { name: 'modules', label: 'Materi', type: 'select', value: '', placeholder: 'Cari Atau Pilih Materi', required: false},
        { name: 'groupLink', label: 'Link Grup', type: 'text', value: '', placeholder: 'Link Grup Telegram / Whatsapp', required: false },
        // { name: 'schoolId', label: 'Pilih Sekolah *', type: 'select', value: '', placeholder: 'Cari Atau Pilih Sekolah', required: true },
        { name: 'schools', label: 'Pilih Sekolah', type: 'select', value: '', placeholder: 'Cari Atau Pilih Sekolah', required: false },
    ],
    inputFormAdvanced: [
        { name: 'programId', label: 'Masukkan Kelas Ke Program', type: 'select', value: '', placeholder: 'Pilih Program', required: false },
        { name: 'groupLink', label: 'Link Grup', type: 'text', value: '', placeholder: 'Link Grup Telegram / Whatsapp', required: false },
        { name: 'quota', label: 'Kuota', type: 'number', value: '', placeholder: '', required: false },
        { name: 'minScore', label: 'Standar Kelulusan', type: 'number', value: '', placeholder: '', description: '* Masukan nilai 0 - 100', required: false },
        { name: 'registrantCity', label: 'Kota Pendaftar', type: 'select', value: '', placeholder: 'Cari Atau Pilih Kota Pendaftar', required: false},
        { name: 'cityHeld', label: 'Kota Pelaksanaan', type: 'select', value: '', placeholder: 'Cari Atau Pilih Kota Pelaksanaan', required: false},
        { name: 'prerequisite', label: 'Prasyarat Kelas', type: 'select', value: '', placeholder: 'Pilih Kelas', required: false },
        { name: 'requirementFields', label: 'Persyaratan Kelas', type: 'select', value: '', placeholder: 'Cari Atau Pilih Persyaratan', description: '* Sesuaikan dengan kebutuhan kelas, form akan tampil ketika peserta mendaftar kelas', required: false},
    ],
    inputFormDate: [
        { name: 'registrationStart', label: 'Pendaftaran Dibuka', type: 'datetime-local', value: '', placeholder: '', required: false },
        { name: 'start', label: 'Pelaksanaan Dimulai', type: 'datetime-local', value: '', placeholder: '', required: false },
        { name: 'registrationEnd', label: 'Pendaftaran Ditutup', type: 'datetime-local', value: '', placeholder: '', required: false },
        { name: 'end', label: 'Pelaksanaan Berakhir', type: 'datetime-local', value: '', placeholder: '', required: false },
        { name: 'certificateRelease', label: 'Terbitkan Sertifikat', type: 'datetime-local', value: '', placeholder: '', required: false },
    ],
    inputFormOthers: [
        // { name: 'requirements', label: 'Persyaratan', type: 'textarea', value: '', placeholder: '', required: false },
        { name: 'requirementFields', label: 'Persyaratan Kelas', type: 'select', value: '', placeholder: 'Cari Atau Pilih Persyaratan', description: '* Sesuaikan dengan kebutuhan kelas, form akan tampil ketika peserta mendaftar kelas', required: true},
    ],

    inputFormTest: [
        { name: 'testType', label: 'Tipe Tes', type: 'text', value: null, placeholder: '', required: false, disabled: false },
        { name: 'title', label: 'Judul', type: 'text', value: null, placeholder: '', required: false, disabled: false },
        { name: 'description', label: 'Deskripsi', type: 'text', value: null, placeholder: '', required: false, disabled: false },
        { name: 'testKind', label: 'Jenis Tes', type: 'select', value: 0, placeholder: '', required: true, options: [{ value: 'disabled', text: 'Pilih salah satu', disabled: true }, { value: 'link', text: 'Link'}, { value: 'file', text: 'File'}, { value: 'form', text: 'Formulir'}, { value: 'studio', text: 'Editor'}] },
        { name: 'deadline', label: 'Deadline', type: 'datetime-local', value: null, placeholder: '', required: false, disabled: false },
    ]
}