<template>
    <div :class="`${containerClass}`">
        <div class="card border">
            <div class="card-header">
                <div class="col-12 col-md-auto d-flex align-items-center mb-3 mb-md-0">
                    <h6 class="surtitle">{{ subtitle }}</h6>
                    <h5 class="mb-0 h3">{{ title }} {{ chartOptions?.counter?.lmsTotalStudent }} Students</h5>
                </div>
            </div>
            <div class="col text-right">
                <div class="card-body relative">
                    <RadarChart 
                        v-if="!!chartData"
                        :chartData="chartData" 
                        :options="chartOptions.options" 
                        :height="height"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        }, 
        chartProps: {
            type: Object,
            default: () => {}
        }, 
        chartData: {
            type: Object,
            default: () => {}
        },
        containerClass: {
            type: String
        },
        height: {
            type: Number, 
            default: 200
        },
        isStacked: {
            type: Boolean
        },
        subtitle: {
            type: String,
            default: ''
        },
        showPercentage: {
            type: Boolean
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        isCard: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        chartOptions() {
            return this.chartProps 
        },
    },
    data: () => {
        return {};
    },
}
</script>