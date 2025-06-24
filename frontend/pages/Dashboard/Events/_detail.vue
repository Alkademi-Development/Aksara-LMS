<template>
    <div>
        <!-- <ContentHeader title="Kegiatan" :centerForm="false" /> -->

        <div class="event container-fluid mt-4">
                
            <!-- Content Begin -->
            <DetailEvent :eventId="eventId" />
            
            <!-- <Footer /> -->

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import Footer from "@/components/template/dashboard/Footer"

import DetailEvent from "@/components/events/DetailEvent"
import { toDecrypt } from '@/commons/utils'

export default {
  async asyncData(){
    const eventId = parseInt(toDecrypt(localStorage.getItem('eventId')))

    return { eventId }
  },
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    DetailEvent
  }

}
</script>