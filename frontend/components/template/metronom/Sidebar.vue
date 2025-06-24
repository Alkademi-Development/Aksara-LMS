<template>
  <div class="sidebar border border-end">
    <ul class="list-group">
      <li class="list-group-item">
        <img src="/assets/image/logo-alkademi.png" width="30" height="30" alt="Logo Alkademi" class="img-fluid">
      </li>
      <li
        v-for="item in menuItems"
        :key="item.id"
        class="list-group-item"
        :class="{ active: item.type === compilerType }"
        @click="setCompilerType(item.type)"
      >
      <i :class="item.icon"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      compilerType: "web",
      menuItems: [
        { name: "Editor", icon: "ri-braces-fill", action: "editor" },
        { name: "View", icon: "ri-mac-line", action: "viewer" },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.sidebar {
  max-width: max-content;
  background: var(--white);
  height: 100svh;
}

.list-group-item {
  cursor: pointer;
  background-color: transparent;
  border-radius: none;
  border: none;
  text-align: center;
}

.list-group-item.active {
  background-color: #2096C4; /* Primary color */
  color: #fff;
}

.list-group-item i {
  font-size: 1.2rem;
}
</style>