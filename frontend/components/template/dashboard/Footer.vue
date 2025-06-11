<template>
    <!-- Footer -->
    <!-- <footer :class="[container, backgroundColor]">
        <div class="row align-items-center justify-content-lg-between mb-3">
            <div class="col-lg-8">
                <div :class="['copyright text-center text-lg-left', textColor]">
                &copy; 2022 {{ settings != null ? settings.title : "" }} <strong v-if="host != 'alkamedia.id' && host != 'dev.alkamedia.id'" ><a href="https://alkamedia.id/" target="_blank" class="alkamedia-link">Powered by Alkamedia</a></strong>
                </div>
            </div>
            <div class="col-lg-4">
                <ul class="nav nav-footer justify-content-center justify-content-lg-end">
                    <li class="nav-item">
                        <a href="https://t.me/+DrD9IDeL4eIzY2Nl" target="_blank" :class="['nav-link', textColor]">Bantuan</a>
                    </li>
                </ul>
            </div>
        </div>
    </footer> -->
    <div></div>
</template>

<script>
export default {
    props: {
        container: String,
        backgroundColor: String,
        textColor: String,
    },
    data() {
        return {
            settings: this.$store.state.Sass.settings || null,
            host: document.location.host
        }
    }
}
</script>

<style>
.alkamedia-link {
    font-size: 1rem;
    color: #525f7f;
}
</style>