<template>
    <div>
        <ContentHeader title="Membuat Acara" :centerForm="false" />

        <div class="container-fluid mt--6">
                
            <!-- Content Begin -->
            <div class="row">
                
                <EventForm />
                
            </div>
            
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import EventForm from "@/components/template/micro/form/EventForm"
import Footer from "@/components/template/dashboard/Footer"


export default {
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    EventForm
  }

}
</script>