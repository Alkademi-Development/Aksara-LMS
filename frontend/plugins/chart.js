import Vue from 'vue'
import { Pie, Doughnut, Bar, Line, mixins, Radar } from 'vue-chartjs'
import 'chartjs-plugin-doughnutlabel'
const { reactiveProp } = mixins

Vue.component('PieChart', {
	extends: Pie,
	props: ['data', 'options'],
	mounted () {
		this.renderChart(this.data, this.options)
	}
})

Vue.component('DoughnutChart', {
	extends: Doughnut,
	mixins: [reactiveProp],
	props: ['chartData', 'options'],
	mounted () {
		this.renderChart(this.chartData, this.options)
	}
})

Vue.component('BarChart', {
	extends: Bar,
	mixins: [reactiveProp],
	props: ['options', 'height'],
	mounted () {
		this.renderChart(this.chartData, this.options)
	}
})

Vue.component('LineChart', {
	extends: Line,
	mixin: [reactiveProp],
	props: ['chartData', 'options', 'height'],
	mounted () {
		this.renderChart(this.chartData, this.options)
	}
})

Vue.component("RadarChart", {
	extends: Radar,
	mixin: [reactiveProp],
	props: ["chartData", "options", "height"],
	mounted(){
		this.renderChart(this.chartData, this.options);
	}
})