<template>
	<client-only>
		<vue-html2pdf
			:show-layout="false"
			:float-layout="false"
			:enable-download="true"
			:preview-modal="true"
			:paginate-elements-by-height="1100"
			:pdf-quality="2"
			pdf-format="a4"
			pdf-orientation="portrait"
			pdf-content-width="800px"
			:manual-pagination="true"
			:html-to-pdf-options="htmlToPdfOptions"
			ref="html2Pdf"

			@hasDownloaded="$emit('generateReport')"
		>
			<RaportContent 
				slot="pdf-content" 
				:detailRaport="detailRaport"

				@domRendered="domRendered()" 
			/>
		</vue-html2pdf>
	</client-only>
</template>

<script>
import RaportContent from '../pdf/RaportContent.vue';

export default {
	layout: "dashboard",
	components: {
		RaportContent
	},
	props: {
		detailRaport: {
			type: Object,
			default: () => {}
		},
		isGenerateReport: {
			type: Boolean,
			default: false
		},
		progress: {
			type: Number,
			default: 0
		},
	},
	data() {
		return {
			contentRendered: false,
			generatingPdf: false,
			pdfDownloaded: false,
			htmlToPdfOptions: {
				margin: 0,
				image: {
					type: "jpeg",
					quality: 0.98,
				},

				enableLinks: true,
				
				filename: '',

				html2canvas: {
					scale: 1,
					useCORS: true,
				},

				jsPDF: {
					unit: "in",
					format: [8.3, 21],
					orientation: 'portrait',
				},
			},
		};
	},
	watch: {
		isGenerateReport: {
			handler(val) {
				this.htmlToPdfOptions.filename = `${this.detailRaport?.raport?.Title}.pdf`
				if (val) {
					this.generateReport()
				}
			},
			deep: true
		}
	},	
	methods: {
		domRendered() {
			this.contentRendered = true;
		},
		generateReport () {
			this.$refs.html2Pdf.generatePdf()
		},
	}
}
</script>

<style lang="scss" scoped>
</style>