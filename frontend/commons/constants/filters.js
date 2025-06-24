const SORT_STUDENTS = [
    {
        key: 'name.asc',
        label: 'A - Z'
    },
    {
        key: 'name.desc',
        label: 'Z - A'
    },
    {
        key: 'score.desc',
        label: 'Rata - Rata Tertinggi'
    },
    {
        key: 'score.asc',
        label: 'Rata - Rata Terendah'
    },
]

const SORT_ASSIGNMENTS = [
    {
        key: 'title.asc',
        label: 'A - Z'
    },
    {
        key: 'title.desc',
        label: 'Z - A'
    },
    {
        key: 'deadline.desc',
        label: 'Deadline Terjauh'
    },
    {
        key: 'deadline.asc',
        label: 'Deadline Terdekat'
    },
]

const SORT_CLASS = [
    {
        key: 'name.asc',
        label: 'A - Z'
    },
    {
        key: 'name.desc',
        label: 'Z - A'
    },
    {
        key: 'date.desc',
        label: 'Tanggal berlangsung Terjauh'
    },
    {
        key: 'date.asc',
        label: 'Tanggal berlangsung Terdekat'
    },
]

const SORT_PROGRAM = [
    {
        key: 'name.asc',
        label: 'A - Z'
    },
    {
        key: 'name.desc',
        label: 'Z - A'
    },
]

const SORT_BUNDLE = [
    {
        key: 'title.asc',
        label: 'A - Z'
    },
    {
        key: 'title.desc',
        label: 'Z - A'
    },
]

const SORT_MATERI = [
    {
        key: 'title.asc',
        label: 'A - Z'
    },
    {
        key: 'title.desc',
        label: 'Z - A'
    },
]

const ASSIGNMENT_TYPE = [
    {
        key: 'link',
        value: 'Link'
    },
    {
        key: 'file',
        value: 'File'
    },
    {
        key: 'studio',
        value: 'Studio'
    },
    {
        key: 'form',
        value: 'Form'
    },
]

const ROLE_TYPE = [
    {
        key: 1,
        value: 'Admin'
    },
    {
        key: 2,
        value: 'Mentor'
    },
    { 
        key: 3, 
        value: "Guru", 
    },
    {
        key: 4,
        value: 'Siswa'
    },
    { 
        key: 5,
        value: 'Industri', 
    },
    { 
        key: 6,
        value: 'Content Writer', 
    },
    { 
        key: 7,
        value: 'Lead Program', 
    },
    { 
        key: 9,
        value: 'Lead Region', 
    },
    { 
        key: 8,
        value: 'Partner', 
    },
]

const SORT_ATTENDANCE = [
    {
        key: 'name.asc',
        label: 'A - Z'
    },
    {
        key: 'name.desc',
        label: 'Z - A'
    },
]

const SORT_COURSES_FROM_CLASS = [
    // {
    //     key: 'name.asc',
    //     label: 'Rata Rata Tertinggi'
    // },
    // {
    //     key: 'name.desc',
    //     label: 'Rata Rata Terendah'
    // },
    {
        key: 'title.asc',
        label: 'A-Z'
    },
    {
        key: 'title.desc',
        label: 'Z-A'
    },
    {
        key: 'date.desc',
        label: 'Terbaru'
    },
    {
        key: 'date.asc',
        label: 'Terlama'
    },
]

export {
    ASSIGNMENT_TYPE,
    SORT_STUDENTS,
    SORT_ASSIGNMENTS,
    ROLE_TYPE,
    SORT_CLASS,
    SORT_ATTENDANCE,
    SORT_PROGRAM,
    SORT_BUNDLE,
    SORT_MATERI,
    SORT_COURSES_FROM_CLASS
}