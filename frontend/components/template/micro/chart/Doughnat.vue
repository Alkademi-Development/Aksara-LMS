<template>
    <div :class="`${containerClass}`">
          <div :class="isCard ? 'card border' : ''">
            <div class="card-header" v-if="showHeader">
                <h6 class="surtitle">{{ subtitle }}</h6>
                <h5 class="h3 mb-0">{{ title }}</h5>
            </div>
            <div :class="isCard ? 'card-body' : ''">
                <div id="daterange-picker" class="mb-2" v-if="showDateRangePicker">
                    <DateRangePicker
                        ref="picker"
                        v-model="dateRange"
                        class="w-100"
                        singleDatePicker="range"
                        opens="right"
                        :showWeekNumbers="false"
                        :ranges="false"
                        :autoApply="true"
                    >
                        <template v-slot:input="picker">
                            <button
                                type="button"
                                class="border btn w-100 d-flex justify-content-between align-items-center text-darker"
                                style="font-size: .875rem"
                            >
                                <div class="d-flex flex-row align-items-center gap-2">
                                    <i class="ri-calendar-2-line" style="font-size: 1.125rem"></i>
                                    {{ picker.startDate | formatDate }} - {{ picker.endDate | formatDate }}
                                </div>
                                <i class="ri-arrow-drop-down-line" style="font-size: 1.125rem"></i>
                            </button>
                        </template>
                    </DateRangePicker>
                </div>
                <DoughnutChart 
                    :chartData="chartData" 
                    :options="chartOptions.options" 
                    :height="height"
                />
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

export default {
    components: { DateRangePicker },
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
        showDateRangePicker: {
            type: Boolean,
            default: false
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
        chartOptions() { return this.chartProps }
    },
    data: () => {
        return {
            // chartOptions: {
			// 	responsive: true,
			// 	legend: {
            //         display: true,
			// 		position: 'bottom',
			// 	},
            // },

            dateRange: {
                startDate: null,
                endDate: null,
            },
        };
    },
    filters: {
        formatDate(val) {
            moment.locale('id')
            if (!val) return ''

            return moment(val).format('DD MMMM YYYY')
        }
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

        if (this.containerClass == 'col-12') {
            this.chartOptions.maintainAspectRatio = false;
            this.chartOptions.aspectRatio = 0.5;
        }
    },
    created() {
        this.setInitialDate()
    },
    watch: {
        dateRange() {
            this.$emit('onDateChange', this.dateRange)
        }
    },
    methods: {
        setInitialDate() {
            const thisDay = new Date()

            this.dateRange.endDate = new Date()
            this.dateRange.startDate = thisDay.setMonth(thisDay.getMonth() - 1)

            this.$emit('onDateChange', this.dateRange)

        },
    }
}
</script>

<style lang="scss">

    #daterange-picker {
        .form-control {
            &.reportrange-text {
                display: flex;
                height: max-content;
                border: 0;
                padding: 0;
            }
        }
    }

</style>