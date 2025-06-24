<template>
    <div>
        <!--<ContentHeader title="Edit Studio" :centerForm="false" />-->

        <div class="container-fluid mt-4">
                
            <!-- Content Begin -->
            <div class="row">
                
                <StudioForm />
                
            </div>
            
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import StudioForm from "@/components/template/micro/form/StudioForm"
import Footer from "@/components/template/dashboard/Footer"


export default {
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    StudioForm
  }

}
</script>