<template>
  <aside class="studio-sidebar border border-end">
    <div class="sidebar-logo mb-4 text-center d-flex align-items-center justify-content-center">
      <img src="/assets/image/logo-alkademi.png" alt="Logo Alkademi" width="30" />
    </div>
    <ul class="sidebar-menu list-unstyled">
      <li
        v-for="item in menuItems"
        :key="item.type"
        :class="['sidebar-menu-item', { 'active': item.type === activeType }]"
        @click="$emit('change-type', item.type)"
        v-tooltip="item.label"
      >
        <i :class="item.icon" />
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      activeType: "editor",
      menuItems: [
        { name: "Editor", icon: "ri-braces-fill", type: "editor" },
        { name: "View", icon: "ri-mac-line", type: "viewer" },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.studio-sidebar {
  max-width: max-content;
  background: var(--white);
  height: 100svh;
}
</style>