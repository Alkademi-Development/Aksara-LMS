const DATA_TABS = [
    'Dashboard-Classroom',
    'Dashboard-Classroom-classroom',
    'Dashboard-Settings',
    'Dashboard-Courses',
    'Dashboard-Finances'
]

const DATA_FILTERS = [
    'Dashboard-Reviews',
    'Dashboard-Recap',
]

const DATA_ACTION = [
    'Dashboard-Classroom',
    'Dashboard-Programs',
]

const ACTION_BUTTON_HEADER = [
    {
        class: '',
        position: 'body',
        routeName: 'Dashboard-Classroom',
        to: '/dashboard/classroom/create',
        type: 'link',
        text: 'Kelas'
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Programs',
        to: '/dashboard/programs/create',
        type: 'link',
        text: 'Program'
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Courses-Bundle-slug',
        from: "detailBundle",
        type: 'action',
        emitEvent: 'editBundle',
        icon: 'ri-pencil-line',
        text: 'Bundle',
    },
    // {
    //     class: '',
    //     position: 'head',
    //     routeName: 'Dashboard-Courses-Modules-courseId',
    //     type: 'action',
    //     emitEvent: 'editMateri',
    //     icon: 'ri-pencil-line',
    //     text: 'Materi',
    // },
    // {
    //     class: '',
    //     position: 'head',
    //     routeName: 'Dashboard-Classroom-classroom-course-course',
    //     type: 'action',
    //     emitEvent: 'editMateri',
    //     icon: 'ri-pencil-line',
    //     text: 'Materi',
    // },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Courses-Library-Modules-courseId',
        type: 'multiple',
        from: "detailModuleCourses",
        items: [
            {
                class: 'btn btn-warning',
                position: 'head',
                routeName: 'Dashboard-Courses-Library-Modules-courseId',
                type: 'action',
                emitEvent: 'deleteMateri',
                icon: 'ri-delete-bin-line',
                text: 'Materi',
                action: "delete"
            },
            {
                class: '',
                position: 'head',
                routeName: 'Dashboard-Courses-Library-Modules-courseId',
                type: 'action',
                emitEvent: 'editMateri',
                icon: 'ri-pencil-line',
                text: 'Materi',
                action: "edit"
            },
        ],
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Courses-Library-Modules-courseId-topic-topicSlug',
        type: 'multiple',
        from: "detailModuleCourses",
        items: [
            {
                class: 'btn btn-warning',
                position: 'head',
                routeName: 'Dashboard-Courses-Modules-courseId-topic-topicSlug',
                type: 'action',
                emitEvent: 'deleteMateri',
                icon: 'ri-delete-bin-line',
                text: 'Materi',
                action: "delete"
            },
            {
                class: '',
                position: 'head',
                routeName: 'Dashboard-Courses-Modules-courseId-topic-topicSlug',
                type: 'action',
                emitEvent: 'editMateri',
                icon: 'ri-pencil-line',
                text: 'Materi',
                action: "edit"
            },
        ],
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Courses-My-Courses-Modules-courseId',
        type: 'multiple',
        from: "detailModuleCourses",
        items: [
            {
                class: 'btn btn-warning',
                position: 'head',
                routeName: 'Dashboard-Courses-My-Courses-Modules-courseId',
                type: 'action',
                emitEvent: 'deleteMateri',
                icon: 'ri-delete-bin-line',
                text: 'Materi',
                action: "delete"
            },
            {
                class: '',
                position: 'head',
                routeName: 'Dashboard-Courses-My-Courses-Modules-courseId',
                type: 'action',
                emitEvent: 'editMateri',
                icon: 'ri-pencil-line',
                text: 'Materi',
                action: "edit"
            },
            {
                class: 'btn btn-light',
                position: 'head',
                routeName: 'Dashboard-Courses-My-Courses-Modules-courseId',
                type: 'action',
                emitEvent: 'publishMateri',
                icon: 'ri-volume-up-line',
                text: 'Terbitkan Materi',
                action: "publish"
            },
        ],
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Courses-My-Courses-Modules-courseId-topic-topicSlug',
        type: 'multiple',
        from: "detailModuleCourses",
        items: [
            {
                class: 'btn btn-warning',
                position: 'head',
                routeName: 'Dashboard-Courses-My-Courses-Modules-courseId-topic-topicSlug',
                type: 'action',
                emitEvent: 'deleteMateri',
                icon: 'ri-delete-bin-line',
                text: 'Materi',
                action: "delete"
            },
            {
                class: '',
                position: 'head',
                routeName: 'Dashboard-Courses-My-Courses-Modules-courseId-topic-topicSlug',
                type: 'action',
                emitEvent: 'editMateri',
                icon: 'ri-pencil-line',
                text: 'Materi',
                action: "edit"
            },
            {
                class: 'btn btn-light',
                position: 'head',
                routeName: 'Dashboard-Courses-My-Courses-Modules-courseId-topic-topicSlug',
                type: 'action',
                emitEvent: 'publishMateri',
                icon: 'ri-volume-up-line',
                text: 'Terbitkan Materi',
                action: "publish"
            },
        ],
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Courses-Draft-Modules-courseId-topic-topicSlug',
        type: 'multiple',
        from: "detailModuleCourses",
        items: [
            {
                class: 'btn btn-warning',
                position: 'head',
                routeName: 'Dashboard-Courses-Draft-Modules-courseId-topic-topicSlug',
                type: 'action',
                emitEvent: 'deleteMateri',
                icon: 'ri-delete-bin-line',
                text: 'Materi',
                action: "delete"
            },
            {
                class: '',
                position: 'head',
                routeName: 'Dashboard-Courses-Draft-Modules-courseId-topic-topicSlug',
                type: 'action',
                emitEvent: 'editMateri',
                icon: 'ri-pencil-line',
                text: 'Materi',
                action: "edit"
            },
            {
                class: 'btn btn-light',
                position: 'head',
                routeName: 'Dashboard-Courses-Draft-Modules-courseId-topic-topicSlug',
                type: 'action',
                emitEvent: 'publishMateri',
                icon: 'ri-volume-up-line',
                text: 'Terbitkan Materi',
                action: "publish"
            },
        ],
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Courses-Draft-Modules-courseId',
        type: 'multiple',
        from: "detailModuleCourses",
        items: [
            {
                class: 'btn btn-warning',
                position: 'head',
                routeName: 'Dashboard-Courses-Draft-Modules-courseId',
                type: 'action',
                emitEvent: 'deleteMateri',
                icon: 'ri-delete-bin-line',
                text: 'Materi',
                action: "delete"
            },
            {
                class: '',
                position: 'head',
                routeName: 'Dashboard-Courses-Draft-Modules-courseId',
                type: 'action',
                emitEvent: 'editMateri',
                icon: 'ri-pencil-line',
                text: 'Materi',
                action: "edit"
            },
            {
                class: 'btn btn-light',
                position: 'head',
                routeName: 'Dashboard-Courses-Draft-Modules-courseId',
                type: 'action',
                emitEvent: 'publishMateri',
                icon: 'ri-volume-up-line',
                text: 'Terbitkan Materi',
                action: "publish"
            },
        ],
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Courses-Modules-courseId',
        type: 'multiple',
        from: "detailModuleCourses",
        items: [
            {
                class: 'btn btn-warning',
                position: 'head',
                routeName: 'Dashboard-Courses-Modules-courseId',
                type: 'action',
                emitEvent: 'deleteMateri',
                icon: 'ri-delete-bin-line',
                text: 'Materi',
                action: "delete"
            },
            {
                class: '',
                position: 'head',
                routeName: 'Dashboard-Courses-Modules-courseId',
                type: 'action',
                emitEvent: 'editMateri',
                icon: 'ri-pencil-line',
                text: 'Materi',
                action: "edit"
            },
            {
                class: 'btn btn-light',
                position: 'head',
                routeName: 'Dashboard-Courses-Modules-courseId',
                type: 'action',
                emitEvent: 'publishMateri',
                icon: 'ri-volume-up-line',
                text: 'Terbitkan Materi',
                action: "publish"
            },
        ],
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Courses-Modules-courseId-topic-topicSlug',
        type: 'multiple',
        from: "detailModuleCourses",
        items: [
            {
                class: 'btn btn-warning',
                position: 'head',
                routeName: 'Dashboard-Courses-Modules-courseId-topic-topicSlug',
                type: 'action',
                emitEvent: 'deleteMateri',
                icon: 'ri-delete-bin-line',
                text: 'Materi',
                action: "delete"
            },
            {
                class: '',
                position: 'head',
                routeName: 'Dashboard-Courses-Modules-courseId-topic-topicSlug',
                type: 'action',
                emitEvent: 'editMateri',
                icon: 'ri-pencil-line',
                text: 'Materi',
                action: "edit"
            },
            {
                class: 'btn btn-light',
                position: 'head',
                routeName: 'Dashboard-Courses-Modules-courseId-topic-topicSlug',
                type: 'action',
                emitEvent: 'publishMateri',
                icon: 'ri-volume-up-line',
                text: 'Terbitkan Materi',
                action: "publish"
            },
        ],
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Classroom-classroom-course-course',
        type: 'multiple',
        from: "detailModuleClassroom",
        items: [
            {
                class: 'btn btn-warning',
                position: 'head',
                routeName: 'Dashboard-Classroom-classroom-course-course',
                type: 'action',
                emitEvent: 'deleteMateri',
                icon: 'ri-delete-bin-line',
                text: 'Materi',
                action: "delete"
            },
            {
                class: '',
                position: 'head',
                routeName: 'Dashboard-Classroom-classroom-course-course',
                type: 'action',
                emitEvent: 'editMateri',
                icon: 'ri-pencil-line',
                text: 'Materi',
                action: "edit"
            },
            {
                class: 'btn btn-light',
                position: 'head',
                routeName: 'Dashboard-Classroom-classroom-course-course',
                type: 'action',
                emitEvent: 'publishMateri',
                icon: 'ri-volume-up-line',
                text: 'Terbitkan Materi',
                action: "publish"
            },
        ],
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Classroom-classroom-course-course-module-module',
        type: 'multiple',
        from: "detailModuleClassroom",
        items: [
            {
                class: 'btn btn-warning',
                position: 'head',
                routeName: 'Dashboard-Classroom-classroom-course-course-module-module',
                type: 'action',
                emitEvent: 'deleteMateri',
                icon: 'ri-delete-bin-line',
                text: 'Materi',
                action: "delete"
            },
            {
                class: '',
                position: 'head',
                routeName: 'Dashboard-Classroom-classroom-course-course-module-module',
                type: 'action',
                emitEvent: 'editMateri',
                icon: 'ri-pencil-line',
                text: 'Materi',
                action: "edit"
            },
            {
                class: 'btn btn-light',
                position: 'head',
                routeName: 'Dashboard-Classroom-classroom-course-course-module-module',
                type: 'action',
                emitEvent: 'publishMateri',
                icon: 'ri-volume-up-line',
                text: 'Terbitkan Materi',
                action: "publish"
            },
        ],
    },
    // {
    //     class: '',
    //     position: 'head',
    //     routeName: 'Dashboard-Courses-Modules-courseId',
    //     type: 'action',
    //     emitEvent: 'editMateri',
    //     icon: 'ri-add-line',
    //     text: 'Module',
    // },
    // {
    //     class: '',
    //     position: 'head',
    //     routeName: 'Dashboard-Courses-Modules-courseId',
    //     type: 'multiple',
    //     items: [
    //         {
    //             class: '',
    //             position: 'head',
    //             routeName: 'Dashboard-Courses-Modules-courseId',
    //             type: 'action',
    //             emitEvent: 'editMateri',
    //             icon: 'ri-pencil-line',
    //             text: 'Materi',
    //         },
    //         {
    //             class: '',
    //             position: 'head',
    //             routeName: 'Dashboard-Courses-Modules-courseId',
    //             type: 'action',
    //             emitEvent: 'createModule',
    //             icon: 'ri-add-line',
    //             text: 'Module',
    //         },
    //     ],
    // },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Courses-Pretest',
        type: 'multiple',
        items: [
            {
                class: 'btn-secondary',
                position: 'head',
                routeName: 'Dashboard-Courses-Pretest',
                to: '/dashboard/courses',
                type: 'link',
                text: 'Module',
                icon: 'ri-book-3-line'
            },
            {
                class: 'ml-2',
                position: 'head',
                routeName: 'Dashboard-Courses-Pretest',
                to: '',
                type: 'link',
                text: 'Materi'
            },
        ],
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Courses',
        type: 'multiple',
        items: [
            // {
            //     class: 'btn-secondary',
            //     position: 'head',
            //     routeName: 'Dashboard-Courses',
            //     to: '/dashboard/courses/pretest',
            //     type: 'link',
            //     text: 'Pretest',
            //     icon: 'ri-draft-line'
            // },
            // {
            //     class: 'ml-2',
            //     position: 'head',
            //     routeName: 'Dashboard-Courses',
            //     to: '',
            //     type: 'link',
            //     text: 'Materi'
            // },
        ],
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Forms',
        type: 'action',
        emitEvent: 'goToForm',
        text: 'Formulir'
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Forms-banks',
        type: 'multiple',
        items: [
            {
                class: 'btn-secondary',
                position: 'head',
                to: '/dashboard/forms/category',
                type: 'link',
                text: 'Kategori Soal',
                icon: ''
            },
            {
                class: 'ml-2',
                position: 'head',
                to: '/dashboard/forms/banks/create',
                type: 'link',
                text: 'Paket'
            },
        ],
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Studio',
        to: '/dashboard/studio/create',
        type: 'link',
        text: 'Studio'
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Blog',
        to: '/dashboard/blog/create',
        type: 'link',
        text: 'Blog'
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Newsletter',
        to: '/dashboard/newsletter/create',
        type: 'link',
        text: 'Newsletter'
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Galleries',
        to: '/dashboard/galleries/create',
        type: 'link',
        text: 'Galeri'
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Announcement',
        to: '/dashboard/announcement/create',
        type: 'link',
        text: 'Announcement'
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Program',
        to: '/dashboard/program/create',
        type: 'link',
        text: 'Program'
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Career',
        to: '/dashboard/career/create',
        type: 'link',
        text: 'Career'
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Classroom-classroom-attendance-recap',
        type: 'action',
        emitEvent: 'goToEditAttendance',
        icon: '',
        text: 'Edit Absensi'
    },
    {
        class: '',
        position: 'head',
        routeName: 'Dashboard-Schedules-id-attendance-recap',
        type: 'action',
        emitEvent: 'goToEditAttendance',
        icon: '',
        text: 'Edit Absensi'
    },
]

const TAB_MENU_CLASSROOM = [
    { key: "overview", label: 'Overview' },
    { key: "courses", label: 'Materi' },
    { key: "assignments", label: 'Tugas' },
    { key: "student", label: 'Peserta'},
    { key: "events", label: 'Kegiatan' },
    { key: "statistics", label: 'Statistik' }
]
const TAB_MENU_TEST = [
    { key: "overview", label: 'Overview' },
    { key: "courses", label: 'Materi' },
    { key: "assignments", label: 'Tes' },
    { key: "student", label: 'Peserta'},
    { key: "events", label: 'Kegiatan' },
    { key: "statistics", label: 'Statistik' }
]

const TAB_MENU_TEST_STUDENT = [
    { key: "overview", label: 'Overview' },
    { key: "assignments", label: 'Tes' },
    { key: "student", label: 'Peserta'},
    { key: "events", label: 'Kegiatan' },
    { key: "statistics", label: 'Statistik' }
]

const TAB_MENU_FILTER_CLASS = [
    { key: "draft", label: 'Draft' },
    { key: "all", label: 'Semua' },
    { key: "myclass", label: 'Kelasku' },
    { key: "waiting", label: 'Menunggu' },
    { key: "registration", label: 'Pendaftaran' },
    { key: "running", label: 'Berlangsung' },
    { key: "finish", label: 'Selesai' }
]

const TAB_MENU_FORM_SETTINGS = [
    { key: "general", label: 'General' },
    { key: "video", label: 'Video Conference' },
]

const TAB_MENU_COURSES = [
    { key: "draft", label: 'Draft' },
    { key: "library", label: 'Pustaka' },
    { key: "myCourses", label: 'Materi Saya' },
]

const TAB_MENU_FINANCE = [
    { key: "overview", label: 'Overview' },
    { key: "history", label: 'Riwayat' },
]

export {
    ACTION_BUTTON_HEADER,
    DATA_TABS,
    DATA_FILTERS,
    DATA_ACTION,
    TAB_MENU_CLASSROOM,
    TAB_MENU_TEST,
    TAB_MENU_TEST_STUDENT,
    TAB_MENU_FILTER_CLASS,
    TAB_MENU_FORM_SETTINGS,
    TAB_MENU_COURSES,
    TAB_MENU_FINANCE
}