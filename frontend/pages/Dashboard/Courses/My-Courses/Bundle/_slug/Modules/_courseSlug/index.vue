<template>
    <section class="container-fluid py-4">
        <DetailCourse
            :isFromBundle="true"
            :slug="slug"
        />
    </section>
</template>

<script>
import DetailCourse from '@/components/courses/DetailCourse.vue'

export default {
    layout: 'dashboard',
    components: { DetailCourse },
    async asyncData({ params }) {
        const slug = params.courseSlug
        return { slug }
    },
    data() {
        return {}
    }
}
</script>
