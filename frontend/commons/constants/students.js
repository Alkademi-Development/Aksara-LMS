const TABLE_COLUMN_STUDENTS = [
    {
        key: "checklist", 
        label: '',
        thStyle: 'width: 0%',
        // thClass: 'allSelectBoxStudent'
    },
    {
        key: "no", 
        label: 'Peringkat',
        thStyle: 'width: 5%; text-align: center',
    },
    {
        key: 'name',
        label: 'Nama',
        thStyle: 'width: 20%',
        stickyColumn: true,
    },
    {
        key: 'email',
        label: 'Email',
        thStyle: 'width: 20%'
    },
    {
        key: 'school',
        label: 'Sekolah',
        thStyle: 'width: 20%'
    },
    {
        key: 'city',
        label: 'Kota',
        thStyle: 'width: 20%'
    },
    {
        key: 'averageScore',
        label: 'Rata-Rata',
        thStyle: 'width: 20%'
    }
]

const TABLE_COLUMN_RECAP = [
    {
        key: "no", 
        label: 'Peringkat',
        thStyle: 'width: 5%; text-align: center',
    },
    {
        key: 'name',
        label: 'Nama',
        thStyle: 'width: 20%',
        stickyColumn: true,
    },
    {
        key: 'email',
        label: 'Email',
        thStyle: 'width: 20%'
    },
    {
        key: 'averageScore',
        label: 'Rata-Rata',
        thStyle: 'width: 20%'
    }
]

const TABLE_COLUMN_PRETEST_STUDENTS = [
    {   
        key: "no",
        label: 'No',
        thStyle: 'width: 5%'
    },
    {   
        key: "name",
        label: 'Nama',
        thStyle: 'width: 35%'
    },
    {   
        key: "submitted_at",
        label: 'Tanggal Pengumpulan',
        thStyle: 'width: 20%'
    },
    {   
        key: "task",
        label: 'Pretest',
        thStyle: 'width: 20%'
    },
    {   
        key: "score",
        label: 'Nilai',
        thStyle: 'width: 20%'
    },
]

export { 
    TABLE_COLUMN_RECAP,
    TABLE_COLUMN_STUDENTS,
    TABLE_COLUMN_PRETEST_STUDENTS
}