<template>

	<div class="svg-map">
		
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 29 793 288" aria-label="Map of Indonesia" role="radiogroup" location-class="province" class="svg-map">

			<path 
				v-for="(item, index) in indonesiaMaps" 
				v-b-tooltip.hover="item.tooltip"
				:key="index" 
				:d="item.d"
				:class="[item.active == true ? 'active' : '']"
				:id="item.id" />

		</svg>

	</div>

</template>

<script>
import province from "@/static/dashboard/assets/js/components/maps/_indo_maps"

export default {
	province,
	props: {
		isAverageScore: Boolean
	},
	computed: {
		provincies() {
			return province
		}
	},
	data() {
		return {
			isProvinciesLoaded: false,

			indonesiaMaps: [],
		};
	},
	created() {
		this.getStatisticProvincies()
	},
	methods: {
		async getStatisticProvincies() {

			await this.$store.dispatch(`Statistics/${this.isAverageScore ? 'fetchRequestStatisticProvinciesScore' : 'fetchRequestStatisticProvincies'}`,)
                .then(() => {

					let data = this.$store.state.Statistics.statistics

					let provinceTotal = this.provincies.length
					let activeTotal = data.length

					for(var i = 0; i < provinceTotal; i++) {

						this.provincies[i].active = false
						
						for(var j = 0; j < activeTotal; j++) {

							let provinceTitle = this.provincies[i].title.toLowerCase()
							let activeTitle = data[j].name.toLowerCase()

							if (provinceTitle === activeTitle) {
								this.provincies[i].active = true

								this.provincies[i].tooltip = this.provincies[i].title + `\n${this.isAverageScore ? 'Rata Rata Nilai: ' + data[j].score : data[j].amount + ' Peserta'}`
							}

						}

					}

					this.indonesiaMaps = this.provincies					

					this.isProvinciesLoaded = true
                })

		},
	}
};
</script>

<style>

</style>