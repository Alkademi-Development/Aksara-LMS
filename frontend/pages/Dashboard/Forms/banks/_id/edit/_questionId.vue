<template>
    <div>
        <!--<ContentHeader title="Mengubah Paket" :centerForm="false" />-->

        <div class="container-fluid mt-4">
                
            <!-- Content Begin -->
            <div class="row">
                
                <PacketQuestionForm :paketId="paketId" 
                    :questionId="questionId" />
                
            </div>
            
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import PacketQuestionForm from "@/components/template/micro/form/PacketQuestionForm"
import Footer from "@/components/template/dashboard/Footer"

import { toDecrypt } from '~/commons/utils'

export default {
  layout: 'dashboard',
  async asyncData({params, query}) {
      const paketId = toDecrypt(localStorage.getItem('bankQuestionsId'))
      const questionId = toDecrypt(localStorage.getItem('questionId'))
      return { paketId, questionId }
  },
  components: {
    ContentHeader,
    Footer,
    PacketQuestionForm
  },
  mounted() {
    // console.log(this.paketId)
  }
}
</script>