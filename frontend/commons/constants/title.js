const TOP_HEADER_TITLE = [
    { key: 'classroom', value: 'Kelas' },
    { key: 'create classroom', value: 'Buat Kelas' },
    { key: 'edit classroom', value: 'Edit Kelas' },
    { key: 'courses', value: 'Pustaka' },
    { key: 'my-courses', value: 'Materi Saya' },
    { key: 'bundle', value: 'Paket' },
    { key: 'course', value: 'Materi' },
    { key: 'create courses', value: 'Buat Materi' },
    { key: 'edit courses', value: 'Edit Materi' },
    { key: 'programs', value: 'Program Studi' },
    { key: 'create programs', value: 'Buat Program' },
    { key: 'edit programs', value: 'Edit Program' },
    { key: 'users', value: 'User' },
    { key: 'schedules', value: 'Jadwal Kegiatan' },
    { key: 'achievement', value: 'Hasil Belajar' },
    { key: 'profile', value: 'Profil' },
    { key: 'forms', value: 'Formulir' },
    { key: 'category', value: 'Kategori' },
    { key: 'module', value: 'Modul' },
    { key: 'pengaturan', value: 'Pengaturan' },
    { key: 'recap', value: 'Rekap' },
    { key: 'attendance', value: 'Absensi'},
    { key: 'recap attendance', value: 'Rekap Absensi'},
    { key: 'banks', value: 'Bank Soal' },
    { key: 'event', value: 'Kegiatan' },
    { key: 'create event', value: 'Buat Kegiatan' },
    { key: 'create', value: 'Buat' },
    { key: 'create assignment', value: 'Buat Tugas' },
    { key: 'assignment', value: 'Tugas' },
    { key: 'create module', value: 'Buat Modul' },
    { key: 'requirements', value: 'Persyaratan' },
    { key: 'raport', value: 'Rapor' },
    { key: 'view', value: 'Detail' },
    { key: 'students', value: 'Siswa' },
    { key: 'certificate', value: 'Sertifikat' },
    { key: 'create career', value: 'Buat Karir' },
    { key: 'create program', value: 'Buat Program' },
    { key: 'create schedules', value: 'Buat Jadwal' },
    { key: 'create users', value: 'Tambah User' },
    { key: 'schools', value: 'Sekolah' },
    { key: 'finances', value: 'Keuangan' }
]

/**
 * route = route name contained in this.$route.name
 * title = title of Top header (if it is dynamic, the title will be the default, if the title in the store does not exist)
 * dynamic = if the title want to get through the variable
 * variableOfStore = name of variable store that will to get the title [nameOfStore, variableInTheStore, ....]
 */
const TOP_HEADER_TITLE_BY_ROUTE = [
    // Pustaka
    { route: "Dashboard-Courses-Bundle", title: "Paket Pustaka", dynamic: false },
    { route: "Dashboard-Courses-Bundle-slug", title: "Detail Paket", dynamic: false },
    { route: "Dashboard-Courses-Bundle-slug-Modules-courseSlug", title: "Detail Materi", dynamic: true, variableOfStore: ["Services", "moduleDetail"] },
    { route: "Dashboard-Courses-Materi", title: "Materi Pustaka", dynamic: false },
    { route: "Dashboard-Courses-Library-Materi", title: "Materi Pustaka", dynamic: false },
    { route: "Dashboard-Courses-My-Courses-Materi", title: "Materi Saya", dynamic: false },
    { route: "Dashboard-Courses-Bundle-Create", title: "Buat Paket", dynamic: false },
    { route: "Dashboard-Courses-Materi-Create", title: "Buat Materi", dynamic: false },
    { route: "Dashboard-Courses-My-Courses-Modules-courseId", title: "Detail Modul", dynamic: true, variableOfStore: ["Services", "moduleDetail"] },
    { route: "Dashboard-Courses-My-Courses-Modules-courseId-topic-topicSlug", title: "Detail Modul", dynamic: true, variableOfStore: ["Services", "topicDetail"] },
    { route: "Dashboard-Courses-Modules-courseId", title: "Detail Materi", dynamic: true, variableOfStore: ["Services", "moduleDetail"] },
    { route: "Dashboard-Courses-Modules-courseId-topic-topicSlug", title: "Detail Modul", dynamic: true, variableOfStore: ["Services", "topicDetail"] },
    { route: "Dashboard-Courses-Draft-Materi", title: "Materi Draft", dynamic: false },

    { route: "Dashboard-Courses-Draft-Modules-courseId", title: "Detail Materi", dynamic: true, variableOfStore: ["Services", "moduleDetail"] },
    { route: "Dashboard-Courses-Draft-Modules-courseId-topic-topicSlug", title: "Detail Modul", dynamic: true, variableOfStore: ["Services", "topicDetail"] },
    
    // Edit Materi
    { route: "Dashboard-Courses-Materi-Edit-edit", title: "Edit Materi", dynamic: true, variableOfStore: ["Services", "moduleDetail"] },
    { route: "Dashboard-Classroom-classroom-course-course-edit", title: "Edit Materi", dynamic: true, variableOfStore: ["Classrooms", "detailModule"] },
    
    
    // Classroom
    { route: "Dashboard-Classroom-classroom-course-create", title: "Buat Materi", dynamic: false },
    { route: "Dashboard-Classroom-classroom-course-course", title: "Detail Materi", dynamic: true, variableOfStore: ["Classrooms", "detailModule"] },
    { route: "Dashboard-Classroom-classroom-course-course-module-module", title: "Detail Module", dynamic: true, variableOfStore: ["Classrooms", "detailTopic"] },
    
    // Assignment Classroom Module
    { route: "Dashboard-Classroom-classroom-course-course-assignment-assignment", title: "Detail Tugas", dynamic: false },
    
    // Event / Kegiatan
    { route: "Dashboard-Classroom-classroom-event-create", title: "Buat Kegiatan", dynamic: true, variableOfStore: ["Services", "classroomDetail"] },
    { route: "Dashboard-Classroom-classroom-event-event", title: "Detail Kegiatan", dynamic: true, variableOfStore: ["Meets", "detailMeet"] },
    { route: "Dashboard-Classroom-classroom-event-event-edit", title: "Edit Kegiatan", dynamic: true, variableOfStore: ["Meets", "detailMeet"] },
];

/**
 * route = route name contained in this.$route.name
 * params = parameter from the route
 * variableOfStore = name of variable store that will to get the title [nameOfStore, variableInTheStore, ....]
 */
const BREADCRUMB_BY_ROUTE = [
    // Pustaka
    { route: "Dashboard-Courses-Modules-courseId", params: ["courseId"], variableOfStore:{courseId: ["Services", "moduleDetail", "title"]} },
    { route: "Dashboard-Courses-Modules-courseId-topic-topicSlug", params: ["courseId", "topicSlug"], variableOfStore:{courseId: ["Services", "moduleDetail", "title"], topicSlug: ["Services", "topicDetail", "title"]} },
    { route: "Dashboard-Courses-My-Courses-Modules-courseId", params: ["courseId"], variableOfStore:{courseId: ["Services", "moduleDetail", "title"]} },
    { route: "Dashboard-Courses-My-Courses-Modules-courseId-topic-topicSlug", params: ["courseId", "topicSlug"], variableOfStore:{courseId: ["Services", "moduleDetail", "title"], topicSlug: ["Services", "topicDetail", "title"]} },

    // Pustaka Draft
    { route: "Dashboard-Courses-Draft-Modules-courseId", params: ["courseId"], variableOfStore:{courseId: ["Services", "moduleDetail", "title"]} },
    { route: "Dashboard-Courses-Draft-Modules-courseId-topic-topicSlug", params: ["courseId", "topicSlug"], variableOfStore:{courseId: ["Services", "moduleDetail", "title"], topicSlug: ["Services", "topicDetail", "title"]} },

    // Classroom
    { route: "Dashboard-Classroom-classroom-course-course", params: ["classroom", "course"], variableOfStore:{classroom: ["Services", "classroomDetail", "name"], course: ["Classrooms", "detailModule", "title"]} },
    { route: "Dashboard-Classroom-classroom-course-course-module-module", params: ["classroom", "course", "module"], variableOfStore:{classroom: ["Services", "classroomDetail", "name"], course: ["Classrooms", "detailModule", "title"], module: ["Classrooms", "detailTopic", "title"]} },
]

export {
    TOP_HEADER_TITLE,
    TOP_HEADER_TITLE_BY_ROUTE,
    BREADCRUMB_BY_ROUTE
}