<template>
    <div :class="`${containerClass}`">
        <div class="card border">
            <div class="card-header">
                <div class="row d-flex align-items-center">
                    <div class="col-12 col-md-auto d-flex align-items-center mb-3 mb-md-0">
                        <h6 class="surtitle">{{ subtitle }}</h6>
                        <h5 class="mb-0 h3">{{ title }}</h5>
                    </div>
                </div>
            </div>
            <div class="col text-right">
                <div v-if="!isLoading" class="card-body">
                    <BarChart
                        v-if="!!chartData"
                        :chart-data="chartData" 
                        :options="chartOptions?.options" 
                        :height="height"
                    />
                </div>
                <div v-else class="loading-wrapper">
                    <b-spinner class="loading-state" label="Busy"></b-spinner>
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
        showLegend: {
            type: Boolean,
            default: false
        },
        isStacked: {
            type: Boolean
        },
        subtitle: {
            type: String,
            default: ''
        },
        showPercentage: {
            type: Boolean,
            default: false
        },
        isLoading: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        chartOptions() { return this.chartProps }
    },
    mounted() {
        if (this.showPercentage) {
            this.chartOptions.tooltips = {
                callbacks: {
                    label: function (tooltipItem, data) {
                        return data.labels[tooltipItem.index] + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
                    }
                }
            }
        }

        if (this.isStacked) {
            this.chartOptions.scales = {
                xAxes: [
                    {
                        stacked: true
                    }
                ],
                yAxes: [
                    {
                        stacked: true,
                    }
                ]
            }
        }
    //     if (this.containerClass == 'col-12') {
    //         this.chartOptions.maintainAspectRatio = false;
    //         this.chartOptions.aspectRatio = 0.5;
    //     }
    }
}
</script>

<style lang="scss" scoped>
.loading-wrapper{
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;

    ::v-deep .loading-state{
        width: 3rem;
        height: 3rem;
        border-color: gray;
        border-right-color: transparent;
    }
}
</style>