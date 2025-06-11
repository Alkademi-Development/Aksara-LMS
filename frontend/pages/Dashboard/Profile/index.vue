<template>
	<div class="container-fluid mt-4">
		<b-alert :show="onEvent.show" :variant="onEvent.variant" dismissible>
			{{ onEvent.message }}
		</b-alert>

		<DetailProfile
			:userId="user.id"
			:isStudent="isStudent"
			@isEvent="setEvent"
			@removeEvent="onEvent.show = false"
		/>
	</div>
</template>

<script>
import DetailProfile from "@/components/user/DetailProfile.vue";

export default {
	layout: "dashboard",
	components: {
		DetailProfile,
	},
	data() {
		return {
			user: JSON.parse(localStorage.getItem("user")),
			isStudent: false,
			onEvent: {
				message: "",
				status: true,
				alertCounter: 0,
				variant: "",
				show: false,
			},
		};
	},
	mounted() {
		if (this.user.kind == 4) this.isStudent = true;
	},
	methods: {
		countDownChanged() {
			this.onEvent.alertCounter = 10;
		},
		setEvent(data) {
			window.scrollTo(0, 0);
			this.onEvent.message = data.message;
			this.onEvent.status = data.status;
			this.onEvent.variant = data.status ? "success" : "warning";
			this.onEvent.show = true;
		},
	},
};
</script>