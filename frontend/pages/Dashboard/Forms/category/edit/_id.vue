<template>
    <div>
        <!--<ContentHeader title="Mengubah Kategori" :centerForm="false" />-->

        <div class="container-fluid mt-4">
                
            <!-- Content Begin -->
            <div class="row">
                
                <CategoryForm />
                
            </div>
            
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import CategoryForm from "@/components/template/micro/form/CategoryForm"
import Footer from "@/components/template/dashboard/Footer"


export default {
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    CategoryForm
  }

}
</script>