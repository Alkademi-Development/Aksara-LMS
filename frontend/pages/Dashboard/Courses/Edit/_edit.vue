<template>
    <div class="container-fluid mt-4">
            
        <div class="row">

            <CourseForm title="Edit Materi" action="edit" :courseId="courseId"/>
            
        </div>
        
        <Footer />

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import CourseForm from "@/components/template/micro/form/CourseForm"
import Footer from "@/components/template/dashboard/Footer"

import { toDecrypt } from '~/commons/utils'

export default {
  asyncData({params, query}) {
    const courseId = parseInt(toDecrypt(localStorage.getItem('courseId')))

    return { courseId }
  },
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    CourseForm
  },
}
</script>