<template>
    <div>
        <div class="row">

            <!-- Registration Chart -->
            <Chart v-if="isCityChartLoaded" title="Berdasarkan Regional" subtitle="Pendaftar (Sudah/Belum Pre-Test)" :chartProps="citiesChart" />

            <!-- Program Chart -->
            <Chart v-if="isProgramChartLoaded" title="Berdasarkan Program" subtitle="Pendaftar (Sudah/Belum Pre-Test)" :chartProps="programChart" />

        </div>
            
        <div class="row">

            <!-- Pretest Chart -->
            <Bar
                v-if="isPretestChartLoaded"
                title="Berdasarkan Pretest Per Kota"
                subtitle="Pendaftar (Sudah/Belum Pre-Test)"
                :chartProps="pretestChart"
                :isStacked="true"
                :showPercentage="false"
                containerClass="col-xl-6"
            />

            <Bar
                v-if="isStackedChartLoaded"
                title="Berdasarkan Kuota Peserta Per Program Per Kota"
                subtitle="Peserta"
                :chartProps="stackedChart"
                :isStacked="true"
                containerClass="col-xl-6"
            />

        </div>

        <div class="row">

            <Bar
                v-if="isRegistrarChartLoaded"
                title="Berdasarkan Pendaftar Per Program Per Kota"
                subtitle="Pendaftar (Sudah/Belum Pretest)"
                :chartProps="registrarChart"
                :isStacked="false"
                :showPercentage="false"
                containerClass="col-12"
            />

        </div>
    </div>
</template>

<script>
import Chart from "@/components/template/micro/chart/Chart"
import Bar from "@/components/template/micro/chart/Bar"

export default {
    components: {
        Chart,
        Bar
    },

    data() {
        return {
            isActiveBatch: false,
            // isCounterLoaded: false,
            isCityChartLoaded: false,
            isProgramChartLoaded: false,
            isPretestChartLoaded: false,
            isStackedChartLoaded: false,
            isRegistrarChartLoaded: false,
            // isEventsLoaded: false,

            // activeStatsLabel: ['Pendaftar', 'Peserta', 'Mentor', 'Industri'],
            // activeStats: null,
            activeProgramStats: null,
            activeCityStats: null,
            activeStudentStats: null,
            activeRegistrarStats: null,

            citiesChart: {
                data: {
                    labels: [],
                    datasets: [
                        {
                            backgroundColor: ['#F27A54', '#F2C94C', '#2F80ED', '#EB5757', '#313131'],
                            data: []
                        }
                    ],
                },
                options: {
                    legend: {
                        display: true
                    },
                },
            },
            programChart: {
                data: {
                    labels: [],
                    datasets: [
                        {
                            backgroundColor: ['#F27A54', '#F2C94C', '#2F80ED', '#EB5757', '#313131'],
                            data: []
                        }
                    ],
                },
                options: {
                    legend: {
                        display: true
                    },
                },
            },

            pretestChart: {
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Sudah Pretest',
                            backgroundColor: '#2F80ED',
                            data: [],
                            stack: 'stack 0'
                        },
                        {
                            label: 'Belum Pretest',
                            backgroundColor: '#EB5757',
                            data: [],
                            stack: 'stack 0'
                        },
                    ],
                },
                options: {
                    legend: {
                        display: true
                    },
                },
            },

            stackedChart: {
                data: {
                    labels: [],
                    datasets: [],
                },
                options: {
                    legend: {
                        display: true
                    },
                },
            },

            registrarChart: {
                data: {
                    labels: [],
                    datasets: [],
                },
                options: {
                    legend: {
                        display: true
                    },
                },
            },
        }
    },

    created() {
        this.getStatisticActiveBatchChart()
    },

    methods: {
        async getStatisticActiveBatchChart() {

            await this.$store.dispatch('Statistics/fetchStatisticActiveBatchChart', 'city').then(() => {
                var statisticState = this.$store.state.Statistics

                if(!statisticState.status) {
                    console.log('Failed get statistics', statisticState.message)
                    this.isActiveBatch = false
                } else {
                    this.activeCityStats = statisticState.statistics

                    this.setCitiesChart(this.activeCityStats)

                    this.isActiveBatch = true
                    this.isCityChartLoaded = true
                    this.isPretestChartLoaded = true
                }
            })

            await this.$store.dispatch('Statistics/fetchStatisticActiveBatchChart', 'program').then(() => {
                var statisticState = this.$store.state.Statistics

                if(!statisticState.status) {
                    console.log('Failed get statistics', statisticState.message)
                    this.isActiveBatch = false
                } else {
                    this.activeProgramStats = statisticState.statistics

                    this.setProgramChart(this.activeProgramStats)

                    this.isActiveBatch = true
                    this.isProgramChartLoaded = true
                }
            })

            await this.$store.dispatch('Statistics/fetchStatisticStudentChart').then(() => {
                const statisticState = this.$store.state.Statistics;

                if(!statisticState.status) {
                    console.error('Failed get statistics', statisticState.message)
                    this.isActiveBatch = false
                } else {
                    this.activeStudentStats = statisticState.statistics

                    this.setStudentsChart(this.activeStudentStats)

                    this.isActiveBatch = true
                    this.isStackedChartLoaded = true
                }
            })

            await this.$store.dispatch('Statistics/fetchStatisticRegistrarChart').then(() => {
                const statisticState = this.$store.state.Statistics;

                if(!statisticState.status) {
                    console.error('Failed get statistics', statisticState.message)
                    this.isActiveBatch = false
                } else {
                    this.activeRegistrarStats = statisticState.statistics

                    this.setRegistrarChart(this.activeRegistrarStats)

                    this.isActiveBatch = true
                    this.isRegistrarChartLoaded = true
                }
            })
        },
        setProgramChart(data) {

            if ( data.length == undefined ) return

            this.programChart.data.datasets[0].data = []

            for ( let i = 0; i < data.length; i++ ) {

                this.programChart.data.labels.push(data[i].name)
                this.programChart.data.datasets[0].data.push(data[i].registrar)

            }

        },
        setCitiesChart(data) {

            if ( data.length == undefined ) return

            const allLabel = data.map(dt => dt.name);
            const allRegistrar = data.map(dt => dt.registrar);

            this.citiesChart.data.labels = allLabel
            this.citiesChart.data.datasets[0].data = allRegistrar

            this.pretestChart.data.labels = allLabel

            data.forEach((dt) => {
                this.pretestChart.data.datasets[0].data.push(dt.filledPretest);
                this.pretestChart.data.datasets[1].data.push(dt.registrar - dt.filledPretest);
            });

        },
        setStudentsChart(data) {

            if ( data.length == undefined ) return

            const colors = ['#F27A54', '#F2C94C', '#2F80ED', '#EB5757', '#313131'];

            const allCity = data.map(dt => dt.cityName);

            this.stackedChart.data.labels = allCity;

            data.forEach((dt) => {
                const dataLabel = dt.programs.map(program => program.programName);
                const currentLabel = this.stackedChart.data.datasets.map(dataset => dataset.label);

                if (currentLabel.length == 0) {
                    dataLabel.forEach((label, i) => {
                        this.stackedChart.data.datasets.push({
                            label: label,
                            backgroundColor: colors[i],
                            data: [],
                            stack: 'stack 0',
                        });
                    })
                }

                this.stackedChart.data.datasets.forEach(dataset => {
                    const currentData = dt.programs.find(program => program.programName == dataset.label);
                    dataset.data.push(currentData.ratio);
                })
            });
        },
        setRegistrarChart(data) {

            if ( data.length == undefined ) return

            const colors = ['#F27A54', '#F2C94C', '#2F80ED', '#EB5757', '#313131'];

            const allCity = data.map(dt => dt.cityName);

            this.registrarChart.data.labels = allCity;

            data.forEach((dt) => {
                const dataLabel = dt.programs.map(program => program.programName);
                const currentLabel = this.registrarChart.data.datasets.map(dataset => dataset.label);

                if (currentLabel.length == 0) {
                    dataLabel.forEach((label, i) => {
                        this.registrarChart.data.datasets.push({
                            label: label,
                            backgroundColor: colors[i],
                            data: [],
                        });
                    })
                }

                this.registrarChart.data.datasets.forEach(dataset => {
                    const currentData = dt.programs.find(program => program.programName == dataset.label);
                    dataset.data.push(currentData.registrar);
                })
            });
        },
    }
}
</script>