<template>
  <div>
    <SectionEditor />
  </div>
</template>

<script>
import SectionEditor from '@/components/editor/template/SectionEditor.vue';

export default {
  components: {
    SectionEditor
  },
  layout: 'blank',
}
</script>


<!-- <template>
    <div class="container-fluid mt-4">
            
        Content Begin
        <ModuleForm 
          action="create" 
          :courseId="courseId" 
          :courseName="courseName" 
          :courseParam="courseId"
          hideHeader
        />
        
        <Footer />

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import ModuleForm from '~/components/template/micro/form/ModuleForm.vue'
import Footer from "@/components/template/dashboard/Footer"

import { toDecrypt } from '~/commons/utils'

export default {
	async asyncData({ params, query }) {
		const courseId = parseInt(toDecrypt(localStorage.getItem('courseId')));
    const courseName = params.courseId;
		return { courseId, courseName };
	},
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    ModuleForm
  }

}
</script> -->