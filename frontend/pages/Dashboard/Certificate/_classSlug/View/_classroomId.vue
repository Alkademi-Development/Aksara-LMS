<template>
  <div>
    <ContentHeader title="Rapor Peserta" />
    <div class="container-fluid mt--6">
      <b-card no-body>
        <b-card-header>
          <div class="row d-flex align-items-center">
            <div class="col d-flex align-items-center mb-3 mb-md-0">
              <CircleBackButton class="d-inline-block" />
              <div>
                <h3 class="mb-0">Preview Sertifikat</h3>
              </div>
            </div>
            <div class="col-12 col-md-6 d-flex justify-content-md-end">
              <b-button 
                v-if="!!detailCertificate?.status"
                class="btn btn-round btn-icon" 
                pill 
                variant="success"
                @click="generateReport"
              >
                <span class="btn-inner--icon"><i class="fas fa-download"></i></span>
                <span class="btn-inner--text">Download Sertifikat</span>
              </b-button>
              
            </div>
          </div>
        </b-card-header>
        <b-card-body class="d-flex justify-content-center overflow-auto">
          <DetailCertificate
            v-if="!!detailCertificate?.status"

            :isGenerateReport="isGenerateReport" 
            :detailCertificate="detailCertificate?.raport"

            @generateReport="generateReport"
          />

          <div v-else>
            <h3>{{ detailCertificate?.message }}</h3>
          </div>
          <!-- <div>
            <h3>Halaman sertifikat masih dalam perbaikan</h3>
          </div> -->
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';

import CircleBackButton from '~/components/CircleBackButton.vue';
import ContentHeader from '~/components/template/dashboard/ContentHeader.vue';
import DetailCertificate from '~/components/user/DetailCertificate.vue';
DetailCertificate

export default {
  layout: 'dashboard',
  asyncData({ params }) {
    const classroomId = params.classroomId

		return { classroomId };
	},
  components: {
    DetailCertificate,
    ContentHeader,
    CircleBackButton
  },
  data() {
    return {
      isGenerateReport: false,
      userId: JSON.parse(localStorage.getItem('user')).id
    }
  },
  computed: {
    ...mapState({
      detailCertificate: (state) => state.Certificates
    })
  },
  created() {
    this.getDetailRaport({userId: this.userId, classroomId: this.classroomId})
  },
  methods: {
    ...mapActions({
      getDetailRaport: 'Certificates/fetchDetailRaport'
    }),
    generateReport() {
      this.isGenerateReport = !this.isGenerateReport
    },
  }
}
</script>

<style>

</style>