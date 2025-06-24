const TABLE_COLUMN_USERS = [
    {   
        key: "index", 
        label: 'No',
        thStyle: 'width: 5%; text-align: center'
    },
    {   
        key: "name", 
        label: 'Nama',
        thStyle: 'width: 25%'
    },
    {   
        key: "email", 
        label: 'Email',
        thStyle: 'width: 20%'
    },
    {   
        key: "phone", 
        label: 'No Telepon',
        thStyle: 'width: 20%'
    },
    {   
        key: "kind", 
        label: 'Role',
        thStyle: 'width: 20%'
    },
    {   
        key: "action", 
        label: 'Aksi',
        thStyle: 'width: 10%;',
        tdStyle: 'text-align: right'
    },
]

const ROLES_USERS = [
    // { 
    //     label: "Super Admin", 
    //     value: 0, 
    //     selected: false, 
    //     isDisabled: true
    // },
    { 
        label: "Admin", 
        value: 1, 
        selected: false, 
        isDisabled: false
    },
    { 
        label: "Mentor", 
        value: 2, 
        selected: false, 
        isDisabled: false
    },
    { 
        label: "Guru", 
        value: 3, 
        selected: false, 
        isDisabled: false
    },
    { 
        label: "Siswa", 
        value: 4, 
        selected: false, 
        isDisabled: false
    },
    { 
        label: "Industri", 
        value: 5, 
        selected: false, 
        isDisabled: true
    },
    { 
        label: "Content Writer", 
        value: 6, 
        selected: false, 
        isDisabled: false
    },
    { 
        label: "Lead Program", 
        value: 7, 
        selected: false, 
        isDisabled: false
    },
    { 
        label: "Lead Region", 
        value: 9, 
        selected: false, 
        isDisabled: false
    },
    { 
        label: "Partner", 
        value: 8, 
        selected: false, 
        isDisabled: false
    },
]

const ROLES_USERS_EN = [
    { 
        label: "super admin", 
        value: 0,
    },
    { 
        label: "admin", 
        value: 1, 
    },
    { 
        label: "mentor", 
        value: 2,
    },
    { 
        label: "teacher", 
        value: 3,
    },
    { 
        label: "student", 
        value: 4,
    },
    { 
        label: "industri", 
        value: 5,
    },
    { 
        label: "content writer", 
        value: 6,
    },
    { 
        label: "lead program", 
        value: 7,
    },
    { 
        label: "partner", 
        value: 8,
    },
    { 
        label: "lead region", 
        value: 9,
    },
]

export {
    ROLES_USERS,
    TABLE_COLUMN_USERS,
    ROLES_USERS_EN
}