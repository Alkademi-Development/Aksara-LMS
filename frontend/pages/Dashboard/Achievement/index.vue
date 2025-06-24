<template>
	<section class="container-fluid mt-4">
        <SectionClass
            :withHeader="false"
            :sectionFilter="true"
            filterBy="achievement"/>
    </section>
</template>

<script>
import SectionClass from "@/components/template/micro/section/SectionClass.vue";

export default {
	layout: "dashboard",
	components: { SectionClass },
};
</script>