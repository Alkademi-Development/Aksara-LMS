<template>
  <div>
    <div class="container-fluid mt-4">
      <b-card no-body>
        <div class="row d-flex align-items-center p-4">
          <div class="col d-flex align-items-center">
            <h5 class="mb-0 line-h-normal">Preview Sertifikat Peserta</h5>
          </div>
          <div class="col-12 col-md-6 d-flex justify-content-md-end mt-4 mt-md-0">
            <b-button 
              v-if="!!detailCertificate?.status"
              class="btn-icon border" 
              variant="no-style"
              @click="generateReport"
            >
              Download
              <i class="ri-download-line"></i>
            </b-button>
            
          </div>
        </div>
        <b-card-body class="d-none d-md-flex justify-content-center overflow-auto">
          <DetailCertificate
            v-if="!!detailCertificate?.status"

            :isGenerateReport="isGenerateReport" 
            :detailCertificate="detailCertificate?.raport"

            @generateReport="generateReport"
          />

          <div v-else>
            <span>{{ detailCertificate?.message }}</span>
          </div>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';

import DetailCertificate from '~/components/user/DetailCertificate.vue';

export default {
  layout: 'dashboard',
  asyncData({ params, query }) {
    const classroomId = params.classroomId
    const userId = parseInt(query.id)

		return { classroomId, userId };
	},
  components: { DetailCertificate },
  data() {
    return {
      isGenerateReport: false,
      studentData: null,
      userKind: localStorage.getItem('user_kind') ?? null,
    }
  },
  computed: {
    ...mapState({
      detailCertificate: (state) => state.Certificates,
      servicesState: (state) => state.Services
    })
  },
  created() {
    this.getUserDetail()
    this.getDetailRaport({userId: this.userId, classroomId: this.classroomId})
  },
  methods: {
    ...mapActions({
      getDetailRaport: 'Certificates/fetchDetailCertificate'
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