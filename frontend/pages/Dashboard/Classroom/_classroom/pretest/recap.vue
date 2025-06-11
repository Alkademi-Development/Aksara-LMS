<template>
    <div class="container-fluid pt-4">
        <b-card class="border">

            <PretestHeader
                title="Rekap Peserta Pretest"
                :actionBtnTitle="!isEmpty ? 'Download' : ''"
                @actionBtnCallback="downloadLeaderboard(classId)"
                class="mb-4"/>

            <Students 
                noHeader
                noFilter
                isPretest
                :isShowCheckbox="false"
                :classId="classId"
                @isEmpty="isEmpty = $event"/>
            
        </b-card>
    </div>
</template>

<script>
import PretestHeader from '@/components/classrooms/pages/pretest/PretestHeader.vue';
import Students from '@/components/classrooms/pages/Students.vue';
import { mapActions } from 'vuex';
import { toDecrypt } from '~/commons/utils';

export default {
    async asyncData ({ params, query }) {
        const classId = parseInt(toDecrypt(localStorage.getItem('classId')));
        return { classId };
    },
    components: { PretestHeader, Students },
    layout: "dashboard",
    data() { return { isEmpty: true } },
    methods: {
        ...mapActions({
            downloadLeaderboard: 'Services/pretestLeaderboardsExport'
        }),
    }
}
</script>