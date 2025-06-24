const LIST_ROUTE_RELATIVE = [
    {
        key: 'modules',
        name: 'MODULES',
        path: '/dashboard/courses/modules',
        newPath: '/dashboard/courses'
    },
    {
        key: 'library',
        name: 'LIBRARY',
        path: '/dashboard/courses/library',
        newPath: '/dashboard/courses'
    },
    {
        key: 'modules',
        name: 'MODULES',
        path: '/dashboard/courses/library/modules',
        newPath: '/dashboard/courses'
    },
    {
        key: 'bundle',
        name: 'BUNDLE',
        path: '/dashboard/courses/library/bundle',
        newPath: '/dashboard/courses'
    },
    {
        key: 'edit',
        name: 'EDIT',
        path: '/dashboard/courses/library/bundle/edit',
        newPath: '/dashboard/courses/library/bundle'
    },
    {
        key: 'my-courses',
        name: 'MY-COURSES',
        path: '/dashboard/courses/my-courses',
        newPath: '/dashboard/courses'
    },
    {
        key: 'MODULES',
        name: 'MODULES',
        path: '/dashboard/courses/my-courses/modules',
        newPath: '/dashboard/courses'
    },
];

const LIST_CUSTOM_ROUTE_INCLUDES = [
    {
        key: 'students',
        name: 'STUDENTS',
        newRoute: 'users',
    },
];


/**
 * paths = which paths that will changed to newPath, you can find the path in (this.$route.matched[0].path)
 * newPath = path that will replace the path that has been specified in 'paths'
 * params = parameter in 'newPath' not in 'paths'
 * isParamExist = are there any params in 'newPath'
 */
const CUSTOM_BREADCRUMBS_ROUTE = [
    { 
        paths: [
            '/Dashboard/Classroom/:classroom/course/:course?/module/:module',
            '/Dashboard/Classroom/:classroom/course/:course?/module'
        ], 
        newPath: '/Dashboard/Classroom/:classroom/course/:course',
        params: ['classroom', 'course'],
        isParamExist: true,
    },
    { 
        paths: [
            '/Dashboard/Courses/My-Courses/Materi/Edit/:edit',
            '/Dashboard/Courses/My-Courses/Materi/Edit'
        ], 
        newPath: '/Dashboard/Courses/My-Courses/Materi',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Programs/Edit/:edit?',
            '/Dashboard/Programs/Edit'
        ], 
        newPath: '/Dashboard/Programs',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Users/Edit/:edit?',
            '/Dashboard/Users/Edit'
        ], 
        newPath: '/Dashboard/Users',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Courses/Bundle/Edit/:slug?',
            '/Dashboard/Courses/Bundle/Edit'
        ], 
        newPath: '/Dashboard/Courses/Bundle',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Courses/Materi/Edit/:edit?',
            '/Dashboard/Courses/Materi/Edit'
        ], 
        newPath: '/Dashboard/Courses/Materi',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Classroom/Edit/:edit?',
            '/Dashboard/Classroom/Edit'
        ], 
        newPath: '/Dashboard/Classroom',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Forms/banks/edit/:id?',
            '/Dashboard/Forms/banks/edit'
        ], 
        newPath: '/Dashboard/Forms/banks',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Forms/category/edit/:id?',
            '/Dashboard/Forms/category/edit'
        ], 
        newPath: '/Dashboard/Forms/category',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Forms/banks/:id/edit/:questionId?',
            '/Dashboard/Forms/banks/:id/edit'
        ], 
        newPath: '/Dashboard/Forms/banks/:id',
        params: ['id'],
        isParamExist: true,
    },
    { 
        paths: [
            '/Dashboard/Studio/Edit/:eventId?',
            '/Dashboard/Studio/Edit'
        ], 
        newPath: '/Dashboard/Studio',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Announcement/Edit/:edit?',
            '/Dashboard/Announcement/Edit'
        ], 
        newPath: '/Dashboard/Announcement',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Blog/Edit/:id?',
            '/Dashboard/Blog/Edit'
        ], 
        newPath: '/Dashboard/Blog',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Galleries/Edit/:id?',
            '/Dashboard/Galleries/Edit'
        ], 
        newPath: '/Dashboard/Galleries',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Career/Edit/:edit?',
            '/Dashboard/Career/Edit'
        ], 
        newPath: '/Dashboard/Career',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Program/Edit/:edit?',
            '/Dashboard/Program/Edit'
        ], 
        newPath: '/Dashboard/Program',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Courses/Draft/Materi',
            '/Dashboard/Courses/Draft'
        ], 
        newPath: '/Dashboard/Courses',
        params: [],
        isParamExist: false,
    },
    { 
        paths: [
            '/Dashboard/Courses/Draft/Modules/:courseId',
            '/Dashboard/Courses/Draft/Modules'
        ], 
        newPath: '/Dashboard/Courses/Draft/Materi',
        params: [],
        isParamExist: false,
    },
]

export {
    LIST_ROUTE_RELATIVE,
    LIST_CUSTOM_ROUTE_INCLUDES,
    CUSTOM_BREADCRUMBS_ROUTE
}