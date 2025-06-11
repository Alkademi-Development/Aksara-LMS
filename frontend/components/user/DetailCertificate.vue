<template>
	<client-only>
		<vue-html2pdf
			:show-layout="false"
			:float-layout="false"
			:enable-download="true"
			:preview-modal="true"
			:paginate-elements-by-height="800"
			:pdf-quality="2"
			pdf-format="a4"
			pdf-content-width="1122px"
			pdf-orientation="landscape"
			:html-to-pdf-options="htmlToPdfOptions"
			ref="html2Pdf"

			@hasDownloaded="$emit('generateReport')"
		>
			<CertificateContent
				slot="pdf-content"
				:detailCertificate="detailCertificate"

				@domRendered="domRendered()"
			/>
		</vue-html2pdf>
	</client-only>
</template>

<script>
import CertificateContent from '../certificate/CertificateContent.vue';
import AppToken from "@/api/app-token";

export default {
	layout: "dashboard",
	components: {
    CertificateContent,
	},
	props: {
		detailCertificate: {
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
			AppToken,
			contentRendered: false,
			generatingPdf: false,
			pdfDownloaded: false,
			htmlToPdfOptions: {
				margin: 0,
				image: {
					type: "jpeg",
					quality: 1,
				},

				enableLinks: true,

				filename: '',

				html2canvas: {
					scale: 5,
					useCORS: true,
				},

				jsPDF: {
					unit: "in",
					format: [9.3, 11.7],
					orientation: 'landscape',
				},
			},
		};
	},
	watch: {
		isGenerateReport: {
			handler(val) {
				this.htmlToPdfOptions.filename = `${this.detailCertificate?.raport?.Title}.pdf`
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