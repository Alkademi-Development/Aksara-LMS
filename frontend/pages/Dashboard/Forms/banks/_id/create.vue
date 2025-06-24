<template>
    <div>
        <!--<ContentHeader title="Membuat Pertanyaan" :centerForm="false" />-->

        <div class="container-fluid mt-4">
                
            <!-- Content Begin -->
            <div class="row">
                
                <PacketQuestionForm :paketId="paketId" />
                
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
  async asyncData({params, query}) {
    const paketId = toDecrypt(localStorage.getItem('bankQuestionsId'));

    return { paketId }
  },
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    PacketQuestionForm
  },

}
</script>