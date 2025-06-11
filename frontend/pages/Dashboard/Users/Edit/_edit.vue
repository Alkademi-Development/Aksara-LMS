<template>
    <div class="container-fluid mt-4">
            
        <!-- Content Begin -->
        <div class="row">
            
            <UserForm :userIdParams="userId" />
            
        </div>
        
        <Footer />

    </div>

</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import UserForm from "@/components/template/micro/form/UserForm.vue"
import Footer from "@/components/template/dashboard/Footer"

import { toDecrypt } from '~/commons/utils'

export default {
  async asyncData ({ params, query }) {
      const userId = parseInt(toDecrypt(localStorage.getItem('userId')));
      return { userId };
  },
  layout: 'dashboard',
  components: {
    ContentHeader,
    Footer,
    UserForm
  },

}
</script>