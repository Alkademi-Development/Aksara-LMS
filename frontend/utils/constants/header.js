export const extraHeaderComponents = {
    'dashboard-classroom': {
        component: defineAsyncComponent(() => import('@/components/partials/header/extras/FilterTabsClassroom.vue')),
    },
    'dashboard-courses': {
        component: defineAsyncComponent(() => import('@/components/partials/header/extras/FilterTabsCourse.vue')),
    },
    'dashboard-classroom-slug': {
        component: defineAsyncComponent(() => import('@/components/partials/header/extras/MenuTabsClassroom.vue'))
    },
}

export const actionHeaderComponents = {
    'dashboard-classroom': {
      component: defineAsyncComponent(() => import('@/components/partials/header/actions/HeaderActionButton.vue')),
      props: {
        label: 'Kelas',
        to: '/dashboard/classroom/create',
        icon: 'ri-add-fill',
        class: 'd-md-none d-block',
      }
    },
    'dashboard-studio': {
      component: defineAsyncComponent(() => import('@/components/partials/header/actions/HeaderActionButton.vue')),
      props: {
        label: 'Studio',
        to: '/dashboard/studio/create',
        icon: 'ri-add-fill',
      }
    },
    'dashboard-classroom-slug': {
        component: defineAsyncComponent(() => import('@/components/partials/header/actions/BadgeStatusRegistration.vue'))
    },
    'dashboard-courses-modules-slug': {
        component: defineAsyncComponent(() => import('~/components/partials/header/actions/CourseDetailActions.vue'))
    },
    'dashboard-courses-bundle-slug': {
      component: defineAsyncComponent(() => import('@/components/partials/header/actions/HeaderActionButton.vue')),
      props: {
        label: 'Bundle',
        to: (route) => `/dashboard/courses/bundle/edit/${route?.params?.slug}`,
        icon: 'ri-pencil-line',
      }
    },
  }
  