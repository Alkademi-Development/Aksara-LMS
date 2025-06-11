<template>
  <div>
    <div class="container-fluid mt-4">
      <b-card no-body>
        <div class="row d-flex align-items-center p-4">
          <div class="col d-flex align-items-center">
            <h5 class="mb-0 line-h-normal">Preview Rapor Peserta</h5>
          </div>
          <div class="col-12 col-md-6 d-flex justify-content-md-end mt-4 mt-md-0">
            <b-button
              v-if="!!detailRaport?.status"
              class="btn-icon border"
              variant="no-style"
              @click="generateReport"
            >
              Download
              <i class="ri-download-line"></i>
            </b-button>
            
          </div>
        </div>
        <b-card-body class="d-none d-md-flex justify-content-center">
          <DetailRaport
            v-if="!!detailRaport?.status"

            :isGenerateReport="isGenerateReport" 
            :detailRaport="detailRaport?.raport"

            @generateReport="generateReport"
          />

          <div v-else>
            <span>{{ detailRaport?.message }}</span>
          </div>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';

import DetailRaport from '~/components/user/DetailRaport.vue';

export default {
  layout: 'dashboard',
  asyncData({ params, query }) {
		const userId = parseInt(query.id)
    const classroomId = params.classroomId

		return { userId, classroomId };
	},
  components: { DetailRaport },
  data() {
    return {
      isGenerateReport: false,
      studentData: null,
      userKind: localStorage.getItem('user_kind') ?? null
    }
  },
  computed: {
    ...mapState({
      detailRaport: (state) => state.Certificates,
      servicesState: (state) => state.Services
    })
  },
  created() {
    this.getUserDetail()
    this.getDetailRaport({userId: this.userId, classroomId: this.classroomId})
  },
  methods: {
    ...mapActions({
      getDetailRaport: 'Certificates/fetchDetailRaport'
    }),
    generateReport() {
      this.isGenerateReport = !this.isGenerateReport
    },
    async getUserDetail() {
      await this.$store.dispatch('Services/userDetail', this.userId)

      if(!this.servicesState.status) {
          console.error('Failed fetch user detail', this.servicesState.message)
      } else {
          this.studentData = this.servicesState.data ?? null
      }
		},
  }
}
</script>

<style>

</style>