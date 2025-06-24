<template>
    <!-- <div :class="index == 0 ? 'col-lg-8' : 'col-lg-4'"> -->
        <div class="news-container">
            <img :src="cover.includes('https://alkademi.s3-ap-southeast-1.amazonaws.com') || cover == null ? require('@/assets/img/default_article.png') : cover" alt="" @click="newsClick">
            <div class="card-news">
                <h1 class="title" @click="newsClick">{{title}}</h1>
                <p class="description">{{summary}}</p>
                <p class="readmore" @click="newsClick">Lebih lanjut</p>
            </div>
        </div>
    <!-- </div> -->
</template>

<script>
export default {
    components: {
    },
    props: {
        data: Object,
        index: 0
    },
    data() {
        return {
            cover: this.data.cover,
            title: this.data.title,
            summary: this.data.summary,
        }
    },
    methods: {
        newsClick() {
            this.$router.push(`/dashboard/news/${this.data.id}`);
            const str = 'new';
        }
    }
}
</script>
