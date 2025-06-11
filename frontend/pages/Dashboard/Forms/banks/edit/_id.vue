<template>
    <div>
        <!--<ContentHeader title="Mengubah Paket" :centerForm="false" />-->

        <div class="container-fluid mt-4">
                
            <!-- Content Begin -->
            <div class="row">
                
                <PacketForm />
                
            </div>
            
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import PacketForm from "@/components/template/micro/form/PacketForm"
import Footer from "@/components/template/dashboard/Footer"


export default {
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    PacketForm
  }

}
</script>