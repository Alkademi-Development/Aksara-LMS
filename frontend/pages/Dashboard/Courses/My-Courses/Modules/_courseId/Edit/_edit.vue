<template>

    <div class="">
        <!-- <div class="container-fluid mt-4"> -->
            
            <!-- <ModuleForm action="edit" :courseId="courseId" :courseName="courseName" :moduleId="topicId"/> -->
            <SectionEditor
              featureAction="edit"
            />
            
            <!-- <Footer /> -->
    </div>

</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import ModuleForm from "@/components/template/micro/form/ModuleForm"
import Footer from "@/components/template/dashboard/Footer"
import SectionEditor from "@/components/editor/template/SectionEditor.vue"

import { toDecrypt } from '~/commons/utils'

export default {
	async asyncData({ params, query }) {
		const courseId = parseInt(toDecrypt(localStorage.getItem('courseId')));
		const courseName = params.courseId;
		const topicId = parseInt(toDecrypt(localStorage.getItem('topicId')));
    const topicSlug = params?.edit;

		return { courseId, courseName, topicId, query, params, topicSlug };
	},
  layout: "blank",
  components: {
    ContentHeader,
    Footer,
    ModuleForm,
    SectionEditor
  },
  mounted(){
    // console.log(this.courseId, this.courseName, this.params, this.query)
  },
}
</script>