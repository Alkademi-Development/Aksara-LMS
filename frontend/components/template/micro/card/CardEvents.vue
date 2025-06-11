<template>
    <div class="card" >
        <!-- Card header -->
        <div class="card-header">
            <!-- Title -->
            <h5 class="mb-0 h3">Kegiatan Yang Akan Datang</h5>
        </div>
        <!-- Card body -->
        <div v-if="!isBusy" class="card-body">
            <div v-if="events.length > 0" class="timeline timeline-one-side" data-timeline-content="axis" data-timeline-axis-style="dashed" >
                <div class="timeline-block" v-for="(event, index) in events" :key="index">
                    <span :class="[`timeline-step badge-${event.type == 'event' ? 'success' : 'info'}`]">
                        <i :class="[`ni ni-${event.type == 'event' ? 'bell-55' : 'hat-3'}`]"></i>
                    </span>
                    <div class="timeline-content">
                        <div class="d-flex justify-content-between">
                        <div>
                            <span class="text-sm d-block font-weight-bold">
                                <!-- {{ event.type == 'event' ? 'Event' : 'Meet Class' }} -->
                                {{ event.title }}
                            </span>
                            <small class="text-muted"><i class="mr-1 fas fa-clock"></i>{{ event.start | beautifyDate }}</small>
                        </div>
                        <div class="text-right">
                            <!-- <small class="mr-3 text-primary" style="cursor: pointer;">Lihat Detail</small> -->

                            <b-button @click="goDetail(event.eventCode)" pill variant="primary">{{ event.eventCode | detailTitle }}</b-button>
                        </div>
                        </div>
                        <!-- <h6 class="mt-1 mb-0 text-sm">{{ event.title }}</h6> -->
                    </div>
                </div>
            </div>
            <div v-else class="text-center"><span>Tidak Ada Kegiatan</span></div>
        </div>
        <div v-else class="card-body">
            <div class="d-flex align-items-center">
                <b-skeleton type="avatar"></b-skeleton>
                <div class="ml-2 w-100">
                    <b-skeleton width="20%"></b-skeleton>
                    <b-skeleton width="40%"></b-skeleton>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    props: {
        events: Array,
        isBusy: Boolean,
    },
    filters: {
        beautifyDate(date) {
            return moment(date).locale('ID').fromNow()
        },
        detailTitle(code) {
            const eventCode = code.split('_')[0]

            if (eventCode == 'EVT') {
                return 'Buka Event';
            } else if (eventCode == 'MET') {
                return 'Buka Kelas';
            }
        }
    },
    data () {
        return {
            userKind: localStorage.getItem('user_kind') == null ? this.$store.state.Sidebar.role : localStorage.getItem('user_kind'),
        }
    },
    methods: {
        goDetail(code) {
            const eventCode = code.split('_')

            if (eventCode[0] == 'EVT') {
                this.$router.push(`/dashboard/events/${eventCode[1]}`)
            } else if (eventCode[0] == 'MET') {
                if (this.userKind == 'student') {
                    this.$router.push('/dashboard/classroom');
                } else {
                    this.$router.push(`/dashboard/classroom/${eventCode[1]}`);
                }
            }
        }
    }

}
</script>

<style lang="scss" scoped>
.timeline-one-side .timeline-content {
    max-width: 100%;
    width: inherit !important;
}
</style>
