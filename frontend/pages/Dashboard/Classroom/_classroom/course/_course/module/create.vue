<template>
    <div>
        <SectionEditor
            :isFromClass="true"
        />
    </div>
</template>

<script>
import SectionEditor from '@/components/editor/template/SectionEditor.vue';

export default {
    components: {
        SectionEditor
    },
    layout: 'blank',
}
</script>