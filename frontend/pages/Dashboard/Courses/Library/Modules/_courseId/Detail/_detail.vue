<template>
  
    <div>
        <section class="container-fluid relative overflow-hidden" style="padding: 0px !important;">
          <!-- <div v-if="isLoaded"> -->
            <!-- <div v-if="moduleDetail"> -->
              <DetailModuleEditor :moduleId="moduleId" :topicId="topicId" />
              <!-- <DetailModuleEditor v-if="moduleDetail?.type === 'editor'" :moduleId="moduleId" :topicId="topicId" />
              <DetailModuleCourse v-else :moduleId="moduleId" :topicId="topicId" /> -->
            <!-- </div> -->
          <!-- </div> -->
        </section>
    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import Footer from "@/components/template/dashboard/Footer"

import DetailModuleCourse from "@/components/courses/DetailModuleCourse.vue"
import DetailModuleEditor from "@/components/courses/DetailModuleEditor.vue"

import { toDecrypt } from '~/commons/utils'

import { mapState } from "vuex";

export default {
  async asyncData({params, query}) {
    const moduleId = parseInt(toDecrypt(localStorage.getItem('courseId')));
    const topicId = parseInt(toDecrypt(localStorage.getItem('topicId')));

    return {
      moduleId,
      topicId,
    }
  },
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    DetailModuleCourse,
    DetailModuleEditor
  },
  computed: {
      ...mapState({
          servicesState: (state) => state.Services,
      })
  },
  mounted(){
    // this.fetchModule();
  },
  data(){
    return{
      moduleDetail: null,
      isLoaded: true,
    }
  },
  // methods: {
  //   async fetchModule() {
  //     this.isLoaded = false;

  //     let params = this.topicId

  //     await this.$store.dispatch(`Services/topicDetail`, params)

  //     if(!this.servicesState.status) {

  //         console.error('Failed get topic on classroom: ', this.servicesState.message)
  //         this.setEvent(this.servicesState.message)

  //     } else {
  //         this.moduleDetail = this.servicesState.topicDetail

  //         this.isLoaded = true
  //     }
  //   },
  // }

}
</script>