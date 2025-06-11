<template>
    <b-card no-body>
        <b-card-header>
            <h5 class="mb-0 h3">Proyek Yang Kamu Ikuti</h5>
        </b-card-header>
        <b-card-body v-if="!isBusy">
            <b-row v-if="bids.length > 0">
                <b-col v-for="bid in bids" :key="bid.id" cols="12" class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>{{ bid.title }}</h5>
                        <p>{{ bid.owner }}</p>
                    </div>
                    <span class="badge badge-pill" :class="{ 'badge-warning': bid.approved == 0, 'badge-success': bid.approved == 1 }">{{ bid.approved == 1 ? 'Diterima' : bid.approved == 0 ? 'Menunggu Konfirmasi' : 'Ditolak' }}</span>
                </b-col>
            </b-row>
            <div v-else class="text-center"><span>Tidak Ada Penawaran</span></div>
        </b-card-body>
        <b-card-body v-else>
            <div class="d-flex align-items-center">
                <b-skeleton type="avatar"></b-skeleton>
                <div class="ml-2 w-100">
                    <b-skeleton width="20%"></b-skeleton>
                    <b-skeleton width="40%"></b-skeleton>
                </div>
            </div>
        </b-card-body>
    </b-card>
</template>

<script>
export default {
    props: {
        isBusy: Boolean,
        bids: Array
    }
}
</script>