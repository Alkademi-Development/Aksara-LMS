<template>
	<div>
		<ContentHeader :title="`Membuat ${ isTestCase ? 'Tes' : 'Tugas' }`" :centerForm="false" />

		<div class="container-fluid mt--6">
			<!-- Content Begin -->
			<ModuleForm action="create" :isAssignment="true" :classroomId="classroomId" :isTestCase="isTestCase"/>

			<Footer />
		</div>
	</div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader";
import ModuleForm from "@/components/template/micro/form/ModuleForm";
import Footer from "@/components/template/dashboard/Footer";

import { mapState } from "vuex";

export default {
	async asyncData({ params }) {
		const classroomId = parseInt(params.classroomId);

		return { classroomId };
	},
	layout: "dashboard",
	computed: {
		...mapState({
			sassState: (state) => state.Sass,
		})
	},
	components: {
		ContentHeader,
		Footer,
		ModuleForm,
	},
	data() {
		return {
			isTestCase: false,
		}
	},
	mounted() {
		this.isTestCase = this.sassState.isTestCase
	}
};
</script>