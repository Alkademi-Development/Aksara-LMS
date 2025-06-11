<template>
  <section class="container-fluid mt-4">

      <DetailAssignment :classroomId="classroomId" :assignmentId="assignmentId" :classSlug="slug" />

  </section>
</template>

<script>

import DetailAssignment from "@/components/classrooms/DetailAssignment.vue"

import { toDecrypt } from '~/commons/utils'

export default {
  async asyncData({params, query}){
    const classroomId = parseInt(toDecrypt(localStorage.getItem('classId')))
    const assignmentId = parseInt(toDecrypt(localStorage.getItem('assignmentId')))
    const slug = params.classroom;
    
    return { classroomId, assignmentId, slug }
  },
  components: {
    DetailAssignment
  },
  layout: 'dashboard',
}
</script>