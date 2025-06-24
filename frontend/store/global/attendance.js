export default {
    inputFormAttendance: [
        { name: 'title', label: 'Nama Kelas', type: 'text', value: '', placeholder: '', required: false, disabled: true },
        // { name: 'type', label: '', type: 'text', value: '', placeholder: '', required: false, disabled: false },
        { name: 'startDate', label: 'Pelaksanaan', type: 'date', value: null, placeholder: '', required: false, disabled: true },
        { name: 'endDate', label: '', type: 'date', value: null, placeholder: '', required: false, disabled: true },
        { name: 'openTime', label: 'Waktu Absen', type: 'time', value: null, placeholder: '', required: false, disabled: false },
        { name: 'closeTime', label: '', type: 'time', value: null, placeholder: '', required: false, disabled: false },
        { name: 'recurse', label: 'Aktifkan Absen Pada Hari', type: 'text', value: '', placeholder: '', required: false, disabled: false },
        { name: 'latitude', label: 'Latitude', type: 'text', value: '', placeholder: '', required: false, disabled: false },
        { name: 'longitude', label: 'Longitude', type: 'text', value: '', placeholder: '', required: false, disabled: false },
        { name: 'radius', label: 'Radius', type: 'text', value: '', placeholder: '', required: false, disabled: false },
    ],
    inputFormAttendanceEvent: [
        { name: 'title', label: 'Nama Event', type: 'text', value: '', placeholder: '', required: false, disabled: true },
        { name: 'startDate', label: 'Pelaksanaan', type: 'date', value: null, placeholder: '', required: false, disabled: true },
        { name: 'endDate', label: '', type: 'date', value: null, placeholder: '', required: false, disabled: true },
        { name: 'openTime', label: 'Waktu Absen', type: 'time', value: null, placeholder: '', required: false, disabled: false },
        { name: 'closeTime', label: '', type: 'time', value: null, placeholder: '', required: false, disabled: false },
        { name: 'latitude', label: 'Latitude', type: 'text', value: '', placeholder: '', required: false, disabled: false },
        { name: 'longitude', label: 'Longitude', type: 'text', value: '', placeholder: '', required: false, disabled: false },
        { name: 'radius', label: 'Radius', type: 'text', value: '', placeholder: '', required: false, disabled: false },
    ],
}