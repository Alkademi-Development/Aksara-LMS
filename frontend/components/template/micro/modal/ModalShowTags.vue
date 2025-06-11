<template>
    <div id="show-tags" class="p-4">
        <h6 class="mb-4">{{ selectedTags?.title }}</h6>
        <div class="tags-container">
            <span v-for="(item, index) in selectedTags?.tags" :key="index" class="badge-gray">{{ !!item.name ? item?.name : `#${item.trim()}` }}</span>
        </div>
    </div>
</template>

<script>
export default{
    props: {
        selectedTags: {
            type: Object,
        }
    }
}
</script>

<style scoped>
#show-tags h6{
    font-size: 20px;
    font-weight: 700;
}

#show-tags .tags-container{
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}
#show-tags .badge-gray{
    display: inline-block;
    white-space: nowrap;
    padding: 6px 12px;
    border-radius: 50px;
    background: #EBEBF0;
}

#show-tags .tags-container span{
    font-size: 12px;
}
</style>