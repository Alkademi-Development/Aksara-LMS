<template>  
    <div>

        <!-- Header -->
        <!-- <ContentHeader :title="role == 'student' ? title : 'Dashboard'" /> -->

        <!-- Page content -->
        <div class="container-fluid pt-4">
            
            <!-- Content Begin -->
            <!-- Role 1 = Admin  || Role 9 = Lead Region -->
            <Admin v-if="role == 'admin' || role == 'superadmin' || role == 'lead_program'" />

            <!-- Role 2 = Mentor || Role 7 = Lead Mentor -->
            <Mentor v-else-if="role == 'mentor'" />

            <!-- Role 3 = Schools -->
            <School v-else-if="role == 'teacher'" />

            <!-- Role 4 = Students -->
            <Student v-else-if="role == 'student'" @titleUpdated="changeTitle"/>

            <!-- Role 5 = Industries -->
            <Industries v-else-if="role == 'industry'" />

            <!-- Role 8 = Partner -->
            <Partner v-else-if="role == 'partner'" />
            <!-- Content End -->

            <LeadRegion v-else-if="role == 'lead_region'" />

            <!-- Footer -->
            <!-- <Footer /> -->

        </div>

    </div>
</template>

<script>
import { mapState } from 'vuex';

import ContentHeader from "@/components/template/dashboard/ContentHeader.vue"
import Footer from "@/components/template/dashboard/Footer"
import Admin from '@/components/dashboard/variants/Admin.vue';
import Mentor from '@/components/dashboard/variants/Mentor.vue';
import Student from '@/components/dashboard/variants/Student';
import Industries from '@/components/dashboard/variants/Industries';
import Partner from '@/components/dashboard/variants/Partner';
import School from '@/components/dashboard/variants/School';
import LeadRegion from '@/components/dashboard/variants/LeadRegion';

export default {
    layout: "dashboard",
    components: {
        ContentHeader,
        Footer,
        Admin,
        Mentor,
        Student,
        Industries,
        Partner,
        School,
        LeadRegion
    },
    computed: {
        ...mapState({
            saasState: (state) => state.Sass
        })
    },
    data() {
        return {
            role: localStorage.getItem('user_kind') == null ? this.$store.state.Sidebar.role : localStorage.getItem('user_kind'),
            isTestCase: false,
            title: '',
        }
    },
    mounted() {
        this.isTestCase = this.saasState.isTestCase
        this.changeTitle(null)
    },
    methods: {
        changeTitle(event) {
            if (event) this.title = event
            else this.title = this.isTestCase ? 'Tes Tersedia' : 'Kelas Tersedia'
        }
    }
};
</script>
<style>
</style>