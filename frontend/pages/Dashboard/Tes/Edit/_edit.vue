<template>
    <div>
        <ContentHeader title="Edit Tes" :centerForm="false" />

        <div class="container-fluid mt--6">
                
            <!-- Content Begin -->
            <CreateClassroomForm />
            
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import CreateClassroomForm from "@/components/template/micro/form/CreateClassroomForm"
import Footer from "@/components/template/dashboard/Footer"


export default {
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    CreateClassroomForm
  }

}
</script>