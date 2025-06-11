<template>
	<div>
		<ContentHeader title="Rapor Peserta" />

		<div class="container-fluid mt--6">
			<b-alert
				:show="onEvent.show"
				:variant="onEvent.variant"
				dismissible
			>
					{{ onEvent.message }}
			</b-alert>

			<StudentAssignment
				:userId="userId"
				:classSlug="classSlug"
				@isEvent="setEvent"
				@removeEvent="onEvent.show = false"
			/>

			<Footer />
		</div>
	</div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader";
import StudentAssignment from "@/components/user/StudentAssignment.vue";
import Footer from "@/components/template/dashboard/Footer.vue";

export default {
	layout: "dashboard",
	asyncData({ params }) {
		const classSlug = params.classSlug;
		const userId = parseInt(params.detail)

		return { classSlug, userId };
	},
	components: {
		ContentHeader,
		Footer,
		StudentAssignment,
	},
	data() {
		return {
			user: JSON.parse(localStorage.getItem("user")),
            
            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: '',
                show: false,
            },
		};
	},
	methods: {
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },
        setEvent(data) {
            window.scrollTo(0,0)
            this.onEvent.message = data.message
            this.onEvent.status = data.status
            this.onEvent.variant = data.status ? 'success' : 'warning'
            this.onEvent.show = true
        }
    },
};
</script>