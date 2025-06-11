<template>
	<div
		id="callback-payment"
		class="d-flex justify-content-center align-items-center vh-100"
	>
		<div v-if="!isPaymentFailed" class="text-center">
			<img
				:src="`/dashboard/assets/image/loading.svg`"
				alt="Loading..."
				style="max-width: 100px"
			/>
			<p>Memproses pembayaran...</p>
		</div>
		<div v-else class="text-center">
			<h2 class="mb-3">Pembayaran Gagal</h2>
			<p>
				Pembayaran tidak berhasil.<br />
				Silakan coba lagi atau hubungi admin.
			</p>
			<b-button @click="goHome" variant="primary">
				Kembali ke beranda
			</b-button>
		</div>
	</div>
</template>

<script>
import { mapActions } from "vuex";

export default {
	layout: "blank",

	
	computed: {
		...mapState({
			paymentState: (state) => state.Payment,
		}),
	},
	data() {
		return {
			resultCode: this.$route.query.resultCode || "",
			merchantOrderId: this.$route.query.merchantOrderId || "",
			reference: this.$route.query.reference || "",
			isPaymentFailed: false,
		};
	},
	created() {
		this.handlePaymentCallback();
	},

	methods: {
		...mapActions({
            fetchClassPaymentInvoice: 'Payment/fetchClassPaymentInvoice',
            fetchClassPaymentDetail: 'Payment/fetchClassPaymentDetail'
        }),
		async handlePaymentCallback() {
			// Jika resultCode bukan '00', anggap gagal
			if (this.resultCode !== "00") {
				this.isPaymentFailed = true;
				return;
			}

			// Panggil store untuk cek detail pembayaran
			try {
				const payload = {
					merchantOrderId: this.merchantOrderId,
					reference: this.reference,
					resultCode: this.resultCode
				};
				const detail = await this.fetchClassPaymentDetail(payload);

				console.log('Payment detail:', detail);

				if (!detail || !detail.data) {
					console.error('API response invalid:', detail);
					this.isPaymentFailed = true;
					return;
				}

				// Jika paymentStatus 0, redirect ke url dari response
				if (detail.data.paymentStatus === 0 && detail.data.url) {
					window.location.replace(detail.data.url);
					return;
				} else {
					// Jika paymentStatus bukan 0, anggap gagal
					this.isPaymentFailed = true;
					return;
				}
			} catch (e) {
				console.error('API error:', e);
				this.isPaymentFailed = true;
				return;
			}
		},
		goHome() {
			window.location.replace("/dashboard");
		},
	},
};
</script>
