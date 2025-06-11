const FIELDS_FILTER_ASSIGNMENT = [
    { 
        class: 'mb-2',
        id: 'select-course',
        label: 'Materi', 
        placeholder: 'Pilih Materi',
        type: 'select',
        options: 'modules',
        onOpenDropdown: 'fetchCourse',
        value: ''
    },
    { 
        class: '',
        id: 'select-assignment-type',
        label: 'Tipe Tugas', 
        placeholder: 'Pilih Tipe',
        type: 'select',
        options: 'assignmentTypes',
        onOpenDropdown: 'fetchAssignmentType',
        value: ''
    },
]

const FIELDS_FILTER_STUDENT = [
    {
        class: 'mb-2',
        id: 'minimum-score',
        label: 'Nilai',
        placeholder: 'Nilai Minimal',
        options: "minimumScore",
        type: 'number',
        value: null,
        vModel: 'minimumScore'
    },
    {
        class: '',
        id: 'maximum-score',
        label: '',
        placeholder: 'Nilai Maksimum',
        type: 'number',
        value: null,
        vModel: 'maximumScore',
        options: "maximumScore",
    },
]

const FIELDS_FILTER_USERS = [
    { 
        class: 'mb-2',
        id: 'select-role',
        label: 'Role', 
        placeholder: 'Pilih Role',
        type: 'select',
        options: 'roleTypes',
        onOpenDropdown: 'fetchRoles',
        vModel: 'roleType',
        value: ''
    },
    { 
        class: 'mb-2',
        id: 'certified',
        label: 'Bersertifikat', 
        placeholder: 'Bersertifikat',
        type: 'checkbox',
        options: 'certified',
    },
]

const FIELDS_FILTER_CATEGORY = [
    { 
        class: 'mb-2',
        id: 'select-category',
        label: 'Category', 
        placeholder: 'Pilih category',
        type: 'select',
        options: 'categoryBundle',
        onOpenDropdown: 'fetchRoles',
        value: ''
    },
]

const FIELDS_FILTER_CLASS = [
    {
        class: '',
        id: 'select-program',
        label: 'Program', 
        placeholder: 'Pilih Program',
        type: 'select',
        options: 'programs',
        onOpenDropdown: 'fetchPrograms',
        value: ''
    }
]

const FIELDS_FILTER_FINANCE = [
    {
        class: '',
        id: 'select-bank',
        label: 'Tujuan Bank', 
        placeholder: 'Tujuan Bank',
        type: 'select',
        options: 'banks',
        onOpenDropdown: 'fetchBankOptions',
        value: ''
    }
]

const FIELDS_FILTER_HISTORY_FINANCE = [
    {
        class: '',
        id: 'select-status',
        label: 'Status', 
        placeholder: 'Status',
        type: 'select',
        options: 'status',
        onOpenDropdown: 'fetchStatus',
        value: ''
    },
    {
        class: '',
        id: 'select-bank',
        label: 'Tujuan Bank', 
        placeholder: 'Tujuan Bank',
        type: 'select',
        options: 'banks',
        onOpenDropdown: 'fetchBankOptions',
        value: ''
    }
]


export {
    FIELDS_FILTER_USERS,
    FIELDS_FILTER_ASSIGNMENT,
    FIELDS_FILTER_STUDENT,
    FIELDS_FILTER_CLASS,
    FIELDS_FILTER_CATEGORY,
    FIELDS_FILTER_FINANCE,
    FIELDS_FILTER_HISTORY_FINANCE
}