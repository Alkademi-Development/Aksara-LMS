<template>
    <b-col no-body>
        <h5>{{ item.name }}</h5>
        <b-progress max="100" class="mb-0 progress-xs">
            <b-progress-bar :value="item.progress" class="bg-blue"></b-progress-bar>
        </b-progress>
    </b-col>
</template>

<script>
export default {
    props: {
        item: Object
    }
}
</script>