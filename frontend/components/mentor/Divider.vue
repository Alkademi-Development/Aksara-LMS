<template>
    <div class="divider-container">
        <div class="row">
            <div class="col col-lg-5 px-lg-5">
                <div class="divider">
                    <h1></h1>
                </div>
            </div>
            <div class="col col-lg-2">
                <div class="logo">
                    <h1 :class="['title', 'red']" v-html="customizeLogoText(name)"></h1>
                </div>
            </div>
            <div class="col col-lg-5 px-lg-5">
                <div class="divider">
                    <h1></h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        name: String
    },
    methods: {
        customizeLogoText(text) {
            return text.replace("Jong", "<span>Jong</span>").replace(" ", "")
        }
    }
}
</script>