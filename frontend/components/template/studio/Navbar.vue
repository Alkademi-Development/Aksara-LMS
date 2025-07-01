<template>
  <nav class="bg-white border border-end">
    <div class="p-3 d-flex align-items-center justify-content-between">

      <h2>
        {{ project?.name }}
      </h2>

      <div class="d-flex align-items-center gap-4">
        <!-- Theme Toggle -->
        <!-- <button
          class="text-primary text-lg rounded-lg p-2"
          @click="onChangeTheme"
        >
          <i :class="studioTheme === 'light' ? 'ri-sun-fill' : 'ri-moon-fill'"></i>
        </button> -->
        <img :src="user?.photo" width="40" height="40" class="img-fluid rounded-pill" alt="Profil User" v-if="user?.photo">
        <span class="profile-text" v-else>{{ user?.name.split('')[0] }}</span>
      </div>

    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import useThemeMixin from '~/mixins/useThemeMixin'

export default {
  mixins: [useThemeMixin],
  computed: {
    ...mapState({
      user: (state) => state.Services.detail_auth,
      showTimer: (state) => state.Alkamedia.showTimer,
    }),
    localUserRole() {
      return this.$store.getters['Auth/localUserRole']
    }
  },
  data() {
    return {
      project: {
        name: "#1 Nearby Animal Species Location",
      }
    }
  },
  methods: {
    onChangeTheme() {
      this.rippleTheme()
      const newTheme = this.studioTheme === 'light' ? 'dark' : 'light'
      this.changeTheme(newTheme)
    }
  }
}
</script>

<style lang="scss" scoped>
button:hover {
  background-color: #EAEAEA;
}
</style>
