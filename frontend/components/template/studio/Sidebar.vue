<template>
  <aside class="studio-sidebar border border-end">
    <div class="sidebar-logo mb-4 text-center d-flex align-items-center justify-content-center">
      <img src="/assets/image/logo-alkademi.png" alt="Logo Alkademi" width="30" />
    </div>
    <ul class="sidebar-menu list-unstyled">
      <li
        v-for="item in tabIcons"
        :key="item.type"
        :class="['sidebar-menu-item', { 'active': item.type === activeScreen }]"
        @click="setActiveScreen(item.type)"
      >
        <i :class="item.icon" />
      </li>
    </ul>
  </aside>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState({
      activeScreen: (state) => state.Studio.activeScreen
    }),
    tabIcons() {
      if (this.activeScreen === 'compiler') {
        return [
          { type: 'compiler', icon: 'ri-braces-fill' }
        ]
      }
      if (this.activeScreen === 'web' || this.activeScreen === 'preview') {
        return [
          { type: 'web', icon: 'ri-code-s-slash-line' },
          { type: 'preview', icon: 'ri-mac-line' }
        ]
      }
      return []
    },
  },
  data() {
    return {
    }
  },
  methods: {
    ...mapActions('Studio', ['setActiveScreen'])
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