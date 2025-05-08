export const extraHeaderComponents = {
    'dashboard-classroom': () => import('@/components/partials/header/extras/FilterTabsClassroom.vue'),
    'dashboard-classroom-slug': () => import('@/components/partials/header/extras/MenuTabsClassroom.vue'),
}

export const actionHeaderComponents = {
    'dashboard-classroom-slug': () => import('@/components/partials/header/actions/BadgeStatusRegistration.vue'),
  }
  