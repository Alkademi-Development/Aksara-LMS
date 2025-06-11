<template>
    <div :class="`${containerClass}`">
        <div class="card border">
            <div class="card-header">
                <div class="row d-flex align-items-center">
                    <div class="col-12 col-md-auto d-flex align-items-center mb-3 mb-md-0">
                        <h6 class="surtitle">{{ subtitle }}</h6>
                        <h5 class="mb-0 h3">{{ title }}</h5>
                    </div>
                    <div class="col text-right">
                        <ButtonDropdownFilter
                            v-if="showDropdown"
                            id="top-weekly-participant-filter"
                            toggleClass="px-3 py-1"
                            variant="outline-primary"
                            :items="filtersItems?.length > 0 ? filtersItems : [{label: 'Monthly '}]"
                            :selectedItem="selectedFilterValue"
                            :text="!!selectedFilterValue?.label ? selectedFilterValue?.label : 'Monthly'"
                            @onChange="filterChange"
                        />
                    </div>
                </div>
            </div>
            <div class="card-body" v-if="!isBusy">
                <LineChart 
                    :chartData="chartData" 
                    :options="chartOptions" 
                    :height="height"
                    v-if="!!chartData"
                />
            </div>
            <div v-else class="loading-wrapper">
                <b-spinner class="loading-state" label="Busy"></b-spinner>
            </div>
        </div>
    </div>
</template>

<script>
import ButtonDropdownFilter from '../buttons/ButtonDropdownFilter.vue';

export default {
    components: { ButtonDropdownFilter },
    props: {
        title: {
            type: String
        },
        chartProps: {
            type: Object,
            default: () => { }
        },
        chartData: {
            type: Object,
            default: () => { }
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
            default: ""
        },
        showPercentage: {
            type: Boolean,
            default: false 
        },
        showDropdown: {
            type: Boolean,
            default: false
        },
        isBusy: {
            type: Boolean,
            default: false
        },
        filtersItems: {
            type: Array,
            default: () => []
        },
        selectedFilterValue: {
            type: Object,
            default: () => {}
        },
    },
    data: () => {
        return {
            chartOptions: {
                responsive: true,
                legend: {
                    display: false,
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: "blue",
                        }
                    }
                }
            }
        };
    },
    mounted() {
        if (this.showPercentage) {
            this.chartOptions.tooltips = {
                callbacks: {
                    label: function (tooltipItem, data) {
                        return data.labels[tooltipItem.index] + ": " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%";
                    }
                }
            };
        }
        if (this.containerClass == "col-12") {
            this.chartOptions.maintainAspectRatio = false;
            this.chartOptions.aspectRatio = 0.5;
        }
    },
    methods: {
        filterChange(filter) {
            this.$emit('onChangeFilter', filter)
        }
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

    .loading-state{
        width: 3rem;
        height: 3rem;
        border-color: gray;
        border-right-color: transparent;
    }
}
</style>