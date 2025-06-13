<template>
  <!-- Footer -->
  <footer :class="[container, backgroundColor]">
      <div class="row align-items-center justify-content-lg-between">
          <div class="col-lg-6">
              <div :class="['copyright text-center text-lg-left', textColor]">
              &copy; {{ new Date().getFullYear() }} <strong>{{ sassState.settings?.isCustomAuth ? sassState.settings?.title : 'Alkademi' }}</strong>
              </div>
          </div>
          <div class="col-lg-6">
              <ul class="nav nav-footer justify-content-center justify-content-lg-end">
                  <li class="nav-item">
                      <a href="#faq" :class="['nav-link', textColor]" target="_blank">FAQ</a>
                  </li>
                  <li class="nav-item">
                      <a href="#help" :class="['nav-link', textColor]" target="_blank">Bantuan</a>
                  </li>
              </ul>
          </div>
      </div>
  </footer>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
      container: String,
      backgroundColor: String,
      textColor: String,
      lmsId: String,
  },

  computed: {
      ...mapState({
          sassState: (state) => state.Sass,
      }),
  },
}
</script>

<style>

</style>