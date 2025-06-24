<template>
    <div>
        <div class="container-fluid mt-4">

            <b-card no-body class="mb-4">
              <div class="w-100 d-flex justify-content-center align-items-center py-4">
                <ProgressHeader 
                  :getSteps="steps"
                  :size="95"
                  labelDirection="vertical"
                />
              </div>
            </b-card>
                
            <CreateClassroomForm v-if="activeStep == 'class'" @changeStep="changeStep" @onSave="getClassroomDetail" />
            <CreateTestForm v-if="activeStep == 'test'" @changeStep="changeStep" />
            <CreateCourseForm v-if="activeStep == 'course'" :detailOverview="classroomDetail" @changeStep="changeStep" @onFetchClassroomDetail="getClassroomDetail" />
            <PreviewCreateClass v-if="activeStep == 'preview'" :detailOverview="classroomDetail" :isClassDetailLoaded="isLoaded" @changeStep="changeStep" />

        </div>

    </div>
</template>

<script>
import ProgressHeader from "~/components/template/micro/header/ProgressHeader.vue"
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import CreateClassroomForm from "@/components/template/micro/form/CreateClassroomForm.vue"
import CreateTestForm from "@/components/template/micro/form/CreateTestForm.vue"
import CreateCourseForm from "@/components/template/micro/form/CreateCourseForm.vue"
import PreviewCreateClass from '~/components/template/micro/section/PreviewCreateClass.vue'
import Footer from "@/components/template/dashboard/Footer"
import { CLASS_STEPS } from '~/commons/constants/header-steps'
import { mapActions, mapState } from 'vuex'


export default {
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    CreateClassroomForm,
    ProgressHeader,
    CreateTestForm,
    CreateCourseForm,
    PreviewCreateClass
  },
  data() {
    return {
      steps: [],
      activeStep: null,
      isLoaded: false
    }
  },
  created() {
    this.initializeSteps()
  },
  computed: {
    ...mapState({
      classroomDetail: (state) => state?.Services?.classroomDetail,
    })
  },
  methods: {
    ...mapActions({
      classOverview: 'Services/classroomOverview',
    }),
    initializeSteps() {
      this.steps = JSON.parse(JSON.stringify(CLASS_STEPS))

      this.steps.map((step) => {
        if (step.status == 'inProgress') this.activeStep = step.key
      })
    },
    changeStep(step) {
      this.activeStep = step
      const stepIdx = this.steps.findIndex(item => item.key == step)
    
      this.steps.map((item, idx) => {
        item.status = 'notStarted'

        if (idx == stepIdx) item.status = 'inProgress'
        else if (idx < stepIdx) item.status = 'completed'
      })
    },
    getClassroomDetail({ slug, step = null }) {
      this.isLoaded = false
      this.classOverview(slug).then(() => {
        if (step) this.changeStep(step)
        this.isLoaded = true
      })
    }
  }

}
</script>