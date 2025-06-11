<template>
    <div :class="`${containerClass}`">
          <div class="card border">
            <div class="card-header">
                <h6 class="surtitle">{{ subtitle }}</h6>
                <h5 class="h3 mb-0">{{ title }}</h5>
            </div>
            <div class="card-body">
                <PieChart 
                    :data="chartData" 
                    :options="chartOptions" 
                />
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
        }
    },
}
</script>

<style>

</style>