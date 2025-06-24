export default {
    inputForm: [
        { name: 'title', label: 'Judul Kegiatan *', type: 'text', value: '', placeholder: '', required: true },
        { name: 'description', label: 'Deskripsi Kegiatan *', type: 'textarea', value: '', placeholder: '', required: true },
        { name: 'type', label: 'Tipe Kegiatan *', type: 'select', value: 0, placeholder: '', required: true, 
            options: [
                { value: 'disabled', text: 'Pilih salah satu', disabled: true }, 
                { value: 'offline', text: 'Offline'}, 
                { value: 'online', text: 'Online'}
            ] 
        },
        // { name: 'topicIds', label: 'Topik *', type: 'select', value: '', placeholder: 'Cari Atau Pilih Materi', required: true, options: [] },
        { name: 'meets', label: 'Platform Video Conference *', type: 'select', value: '', placeholder: '', required: true, options: [] },
        { name: 'place', label: 'Lokasi Kegiatan *', type: 'text', value: '', placeholder: 'Nama Gedung', required: true },
        { name: 'address', label: '', type: 'text', value: '', placeholder: 'Alamat', required: true },
        { name: 'content', label: '', type: 'text', value: '', placeholder: 'Link Maps', required: true },
        { name: 'datetime', label: 'Pelaksanaan Kegiatan *', type: 'datetime-local', value: null, placeholder: '', required: true },
        { name: 'endDate', label: 'Kegiatan Berakhir *', type: 'datetime-local', value: null, placeholder: '', required: true },
        { name: 'addAttendance', label: 'Absensi', type: 'checkbox', value: '', placeholder: '', required: false, disabled: false },
        { name: 'latitude', label: 'Latitude', type: 'text', value: '', placeholder: '', required: false, disabled: false },
        { name: 'longitude', label: 'Longitude', type: 'text', value: '', placeholder: '', required: false, disabled: false },
        { name: 'radius', label: 'Radius', type: 'text', value: '', placeholder: '', required: false, disabled: false },
        { name: 'openTime', label: 'Waktu Absen', type: 'time', value: null, placeholder: '', required: false, disabled: false },
        { name: 'closeTime', label: '', type: 'time', value: null, placeholder: '', required: false, disabled: false },
    ],
    inputFormAnnouncement: [
        { name: 'title', label: 'Judul Kegiatan *', type: 'text', value: '', placeholder: '', required: true },
        { name: 'description', label: 'Deskripsi Kegiatan *', type: 'textarea', value: '', placeholder: '', required: true },
        { name: 'type', label: 'Tipe Kegiatan *', type: 'select', value: 'disabled', placeholder: '', required: true, 
            options: [
                { value: 'disabled', text: 'Pilih salah satu', disabled: true }, 
                { value: 'offline', text: 'Offline'}, 
                { value: 'online', text: 'Online'}
            ] 
        },
        { name: 'meets', label: 'Platform Video Conference *', type: 'select', value: '', placeholder: '', required: true, options: [] },
        { name: 'place', label: 'Lokasi Kegiatan *', type: 'text', value: '', placeholder: 'Alamat Tempat', required: true },
        { name: 'link', label: '', type: 'text', value: '', placeholder: 'Link Maps', required: true },
        { name: 'datetime', label: 'Pelaksanaan Kegiatan *', type: 'datetime-local', value: null, placeholder: '', required: true },
        { name: 'endDate', label: 'Kegiatan Berakhir *', type: 'datetime-local', value: null, placeholder: '', required: true }
    ],
}