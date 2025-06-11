<template>
    <section class="container-fluid py-4">
        <DetailBundle :slug="slug" />
    </section>
</template>

<script>
import DetailBundle from '@/components/courses/DetailBundle.vue'

export default {
    layout: 'dashboard',
    components: { DetailBundle },
    async asyncData({ params, query }) {
        const slug = params.slug
        return { slug }
    },
    data() {
        return {}
    }
}
</script>
