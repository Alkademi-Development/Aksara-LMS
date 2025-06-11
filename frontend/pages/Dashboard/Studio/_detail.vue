<template>
    <div>
        <ContentHeader title="Kegiatan" :centerForm="false" />

        <div class="event container-fluid mt--6">
                
            <!-- Content Begin -->
            <DetailEvent />
            
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import Footer from "@/components/template/dashboard/Footer"

import DetailEvent from "@/components/events/DetailEvent"

export default {
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    DetailEvent
  }

}
</script>