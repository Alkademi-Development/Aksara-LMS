<template>
	<div>
		<ContentHeader title="Mengubah Tugas" :centerForm="false" />

		<div class="container-fluid mt--6">
			<!-- Content Begin -->
			<ModuleForm action="edit" :isAssignment="true" :classroomId="classroomId" :moduleId="topicId"/>

			<Footer />
		</div>
	</div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader";
import ModuleForm from "@/components/template/micro/form/ModuleForm";
import Footer from "@/components/template/dashboard/Footer";

export default {
	async asyncData({ params }) {
		const classroomId = parseInt(params.classroomId);
		const topicId = parseInt(params.topicId);

		return { classroomId, topicId };
	},
	layout: "dashboard",
	components: {
		ContentHeader,
		Footer,
		ModuleForm,
	},
};
</script>