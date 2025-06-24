<template>
    <editor
        v-if="isShow"
        :id="id"
        v-model="content"
        :api-key="apiKey"
        :init="{
            height: height,
            menubar: false,
            plugins: 'link image media code codesample fullscreen lists help',
            toolbar: 'undo redo | styleselect | forecolor | bold italic | link image media | \
            fullscreen | bullist numlist | alignleft aligncenter alignright alignjustify | \
            outdent indent | code codesample | help'
        }"
        :placeholder="dPlaceholder ? dPlaceholder : ''"
    />
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
export default {
    components: { Editor },
    props: {
        value: String,
        placeholder: String,
        id: {
            type: String,
            default: ""
        },
        height: {
            type: Number,
            default: 300,
        }
    },
    data() {
        return {
            isShow: false,
            content: this.value,
            dPlaceholder: this.placeholder,
            // apiKey: "g2vn80r34v8s90njwki7fltkvhossci1sbu3dsrxfyh40dm6", // Api Key From Account Rafli
            apiKey: "psxv5uijfhqjkkog2zseeky1km4a84yz7zgvslmsps9ojppr" // Api Key From Account Dev Alkademi
        }
    },
    mounted() {
        setTimeout(() => {
            this.isShow = true
        }, 100);
    },
    watch: {
        content() {
            this.$emit('onChange', this.content)
        }
    },
    destroyed() {
        this.isShow = false
    }
}
</script>