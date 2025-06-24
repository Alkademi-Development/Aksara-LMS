<template>
    <div>
        <ContentHeader title="Daftarkan Peserta" :centerForm="false" />

        <div class="container-fluid mt--6">
                
            <!-- Content Begin -->
            <div class="row">
                
                <UserForm />
                
            </div>
            
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import UserForm from "@/components/template/micro/form/UserForm"
import Footer from "@/components/template/dashboard/Footer"


export default {
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    UserForm
  }

}
</script>

<style>

</style>