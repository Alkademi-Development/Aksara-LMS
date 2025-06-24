// mixins/use-theme.js

export default {
  methods: {
    getLocalTheme() {
      if (process.client) {
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        return savedTheme || (prefersDark ? 'dark' : 'light')
      }
      return 'light'
    },

    changeTheme(theme) {
      if (process.client) {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
        this.$store.dispatch('studio/setStudioTheme', theme)
      }
    },

    rippleTheme() {
      if (process.client) {
        const ripples = document.createElement('span')
        ripples.className = 'right-0 top-0 fixed bg-foreground rounded-full animate-ripple-theme transition-colors'

        document.body.appendChild(ripples)
        setTimeout(() => ripples.remove(), 700)
      }
    }
  }
}