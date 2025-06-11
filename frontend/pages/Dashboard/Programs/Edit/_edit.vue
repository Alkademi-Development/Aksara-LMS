<template>
    <div class="container-fluid mt-4">
            
        <ProgramForm title="Edit Program" action="edit" :programId="programId"/>
        
        <Footer />

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader.vue"
import ProgramForm from "@/components/template/micro/form/ProgramForm.vue"
import Footer from "@/components/template/dashboard/Footer.vue"

import { toDecrypt } from '~/commons/utils'

export default {
  layout: 'dashboard',
  asyncData({params, query}) {
    const programId = parseInt(toDecrypt(localStorage.getItem('programId')))
    return { programId }
  },
  components: {
    ContentHeader,
    Footer,
    ProgramForm
  }

}
</script>