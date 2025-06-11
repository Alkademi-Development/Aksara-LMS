<template>
    <div class="container-fluid mt-4">
        <div class="row">
            
            <PacketForm />
            
        </div>
        
        <Footer />

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