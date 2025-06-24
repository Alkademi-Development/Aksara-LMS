<template>
    <div class="container-fluid mt-4">
            
        <!-- Content Begin -->
        <div class="row">
            
            <UserForm />
            
        </div>
        
        <Footer />

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import UserForm from "@/components/template/micro/form/UserForm.vue"
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