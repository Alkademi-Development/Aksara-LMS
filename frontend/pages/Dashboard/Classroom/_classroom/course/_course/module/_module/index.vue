<template>
  <div>
    <section class="container-fluid relative overflow-hidden" style="padding: 0px !important;">
      <DetailClassroom
        showContent="course"
      />
    </section>
  </div>
</template>
  
<script>
import DetailClassroom from '@/components/classrooms/pages/DetailClassroom.vue';

export default {
  layout: 'dashboard',
  components: {
    DetailClassroom
  },
}
</script>



<!-- <template>
    <div>
        <section class="container-fluid mt-3">
            <DetailModule
            :classroom="classroomSlug"
            :course="courseSlug"
            :topic="topicSlug"
            :topicId="parseInt(topicId)"
            :moduleId="parseInt(moduleId)"
            :moduleSlug="moduleSlug"
            @moduleDetail="moduleDetail = $event"
            />
        </section>
    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import Footer from "@/components/template/dashboard/Footer"
import DetailModule from "@/components/classrooms/DetailModule.vue"

import { toDecrypt } from '~/commons/utils'

export default {
    asyncData({ params, query }){
        const classroomSlug = params.classroom
        const courseSlug = params.course
        const topicSlug = params.module
        const moduleSlug = params.course
        const moduleId = parseInt(toDecrypt(localStorage.getItem('courseId')))
        const topicId = parseInt(toDecrypt(localStorage.getItem('moduleId')))

        return { 
            classroomSlug,
            courseSlug,
            topicSlug,
            topicId,
            moduleId,
            moduleSlug,
        };
    },
    components: {
        ContentHeader,
        Footer,
        DetailModule
    },
    data() {
        return {
            moduleDetail: null
        }
    },
    layout: 'dashboard',
}
</script> -->