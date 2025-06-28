import dayjs from 'dayjs'
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      countdown: 0,
      deadlineTime: '',
      timerServer: null,
    }
  },
  computed: {
    ...mapGetters({
      serverTime: 'alkamedia/serverTime',
      timeNow: 'alkamedia/timeNow',
      project: 'compiler/project',
    }),
  },
  methods: {
    ...mapActions({
      setTimeNow: 'alkamedia/setTimeNow',
      setTimer: 'alkamedia/setTimer',
      setTimeOver: 'alkamedia/setTimeOver',
    }),

    startServerTimer() {
      if (!this.timeNow) {
        this.setTimeNow(this.serverTime?.now__ || '')
      }

      if (!this.deadlineTime) {
        this.deadlineTime = dayjs(this.project?.created_at)
          .add(this.project?.timer || 0, 'minutes')
          .format()
      }

      this.timerServer = setInterval(() => {
        const newTime = dayjs(this.timeNow).add(1, 'seconds').format()
        this.setTimeNow(newTime)
      }, 1000)
    },

    startTimer() {
      this.startServerTimer()

      const timer = setInterval(() => {
        this.countdown = dayjs(this.deadlineTime).valueOf() - dayjs(this.timeNow).valueOf()

        const minutes = Math.floor(this.countdown / 60000)
        const seconds = ((this.countdown % 60000) / 1000).toFixed(0)

        if (this.countdown <= 0) {
          this.countdown = 0
          this.setTimeOver(true)
          clearInterval(timer)
          if (this.timerServer) clearInterval(this.timerServer)
        }

        const formatted = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
        this.setTimer(this.countdown < 1 ? '00:00' : formatted)
      }, 1000)
    },
  },
}
