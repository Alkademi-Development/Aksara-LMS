<template>
  <b-card class="border">
    <template v-if="!isLoading">
      <h3 class="mb-4">{{ assignmentDetail?.title }}</h3>
      <div class="mb-4">
        <div class="description mb-4" v-html="assignmentDetail?.description"></div>
        <div v-for="(content, index) in assignmentContents" :key="index">
          <div v-if="content != '' && content != '#' && validURL(content)" class="mt-3">
            <div class="p-2 d-block mx-auto rounded-lg text-white" style="background: #EBEBF0;">
              <div>
                <b-embed
                    type="iframe"
                    aspect="16by9"
                    allowfullscreen
                    frameborder="0"
                    :src="generateLinkEmbed(content)"
                >
                </b-embed>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-end">
        <div class="information-assignment">
          <div class="information-item">Tipe Tugas: <span class="text-capitalize">{{ assignmentDetail?.type }}</span></div>
          <div v-if="isTypeFormOrStudio(assignmentDetail?.type)" class="information-item">Durasi pengerjaan: <span>{{ assignmentDetail?.externalData?.timer }} Menit</span></div>
          <div class="information-item">Batas pengumpulan: <span>{{ toDateTimes(assignmentDetail?.deadline, null, { country: 'id-ID', type: 'long' }) || '-' }}</span></div>
        </div>
        <div>
          <b-button v-if="userRole != 'student' && userRole !== 'teacher'" variant="outline-primary" class="action-btn" @click="onClickReview">Review Tugas</b-button>
          <template v-else-if="userRole === 'student' && !assignmentEnded">
            <template v-if="statusConditionAssignment === 'not_submitted'">
              <template v-if="assignmentDetail?.type === 'form' || assignmentDetail?.type === 'studio'">
                <b-button v-if="assignmentDetail?.externalId" variant="primary" class="action-btn" @click="onClickAssignment">Lanjut Mengerjakan</b-button>
                <b-button v-else variant="primary" class="action-btn" @click="onClickAssignment">Kerjakan</b-button>
              </template>
              <template v-else>
                <b-button variant="primary" class="action-btn" @click="onClickAssignment">Kerjakan</b-button>
              </template>
            </template>
            <div v-else-if="statusConditionAssignment === 'submitted.not_scored'" class="outline-status--warning action-status">Sedang Direview</div>
            <div v-else-if="statusConditionAssignment === 'submitted.scored.not_passed' && !isTimeOver" class="action-btn--status outline-status--primary">Mulai dalam waktu {{ minutes }}:{{ seconds }}</div>
            <b-button v-else-if="statusConditionAssignment === 'submitted.scored.not_passed' && isTimeOver" variant="primary" class="action-btn" @click="onClickAssignment">Kerjakan</b-button>
          </template>
        </div>
      </div>
    </template>

    <!-- State Loading -->
    <template v-else>
      <b-skeleton animation="wave" width="10%" class="mb-4"></b-skeleton>
      <div class="mb-4 d-flex flex-column gap-2">
        <b-skeleton v-for="index in 5" :key="`skeleton--wave-${index}`" animation="wave" width="100%"></b-skeleton>
        <b-skeleton animation="wave" width="50%"></b-skeleton>
      </div>
      <div class="d-flex justify-content-between align-items-end">
        <div class="d-flex flex-column gap-2 w-100">
          <b-skeleton animation="wave" width="35%"></b-skeleton>
          <b-skeleton animation="wave" width="35%"></b-skeleton>
          <b-skeleton animation="wave" width="35%"></b-skeleton>
        </div>
        <div>
          <b-skeleton type="button"></b-skeleton>
        </div>
      </div>
    </template>
  </b-card>
</template>

<script>
import { toDateTimes } from "@/commons/utils/transform-data/dateConverter";
import { mapActions, mapState } from "vuex";

export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    assignmentDetail: {
      type: Object,
      default: () => {},
    },
    assignmentContents: {
      type: Array,
      default: () => [],
    },
    statusConditionAssignment: {
      type: String,
      default: "",
    },
    assignmentEnded: {
      type: Boolean,
      default: false,
    },
    isTimeOver: {
      type: Boolean,
      default: false,
    },
    minutes: {
      type: String,
      default: "00",
    },
    seconds: {
      type: String,
      default: "00",
    }
  },
  computed: {
    ...mapState({
      servicesState: (state) => state.Services,
    }),
  },
  data(){
    return{
      userRole: localStorage.getItem("user_kind"),
    }
  },
  methods: {
    ...mapActions({
        setSelectedFilter: 'Layouts/setSelectedFilter'
    }),
    toDateTimes,
    isTypeFormOrStudio(type){
      return type == 'form' || type == 'studio';
    },
    generateLinkEmbed(link) {
      if(link.includes("presentation")) {
        return link.replace(/\/edit\?/, "/embed?start=false&loop=false&delayms=3000&rm=minimal");
      } else {
        return link.replace("/view", "/preview")
      }
    },
    validURL(url) {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return !!pattern.test(url);
    },
    onClickReview() {
      const classroomDetail = this.servicesState?.classroomDetail;
      this.$router.push({
          path: '/dashboard/reviews',
          query: {
              classroomId: classroomDetail?.id,
              classroomSlug: classroomDetail?.slug,
              classroomName: classroomDetail?.name,
              assignmentId: this.assignmentDetail?.id,
          }
      })
    },
    onClickAssignment(){
      this.$emit("onClickAssignment", this.assignmentDetail?.type);
    }
  }
}
</script>

<style scoped lang="scss">
.information-assignment{
  display: flex;
  flex-direction: column;
  gap: 6px;

  .information-item{
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: black;

    span{
      font-weight: 600;
    }
  }
}

.action-btn{
  font-size: 14px;
  font-weight: 500;
  padding: 8px 18px;

}

.action-btn--status{
  font-size: 14px;
  font-weight: 500;
  padding: 8px 18px;
}

.outline-status--primary{
  color: var(--bs-primary) !important;
  border: 1px solid var(--bs-primary) !important;
  background-color: transparent !important;
  border-radius: 6px;
}

.action-status{
  font-size: 14px;
  font-weight: 500;
  padding: 8px;
}

.outline-status--warning{
  color: #FFC55A !important;
  border: 1px solid #FFC55A !important;
  background-color: transparent !important;
  border-radius: 6px;
}
</style>