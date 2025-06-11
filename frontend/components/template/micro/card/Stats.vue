<template>
    <div :class="['col-md-6', sassState.settings.layout == 'smkcoding' ? 'col-xl-6' : 'col-xl-4']">
        <div class="card card-stats">
            <!-- Card body -->
            <div class="card-body">
                <div class="row">
                    <div class="col">
                        <h5 class="card-title text-uppercase text-muted mb-0">{{ title }}</h5>
                        <span class="h2 font-weight-bold mb-0">{{ amount }}</span>
                    </div>
                    <div class="col-auto">
                        <div :class="['icon', 'icon-shape', 'text-white', 'rounded-circle', 'shadow', background]">
                            <i :class="['ni', icon]"></i>
                        </div>
                    </div>
                </div>
                <p class="mt-3 mb-0 text-sm">
                    <NuxtLink class="text-nowrap font-weight-600 text-primary-card" :to="detail">
                        Lihat Semua
                    </NuxtLink>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    props: ['title', 'amount', 'icon', 'background', 'detail'],
    computed: {
        ...mapState({
            sassState: (state) => state.Sass
        })
    }
}
</script>

<style>
.text-primary-card {
    color: var(--bs-primary) !important;
}
</style>