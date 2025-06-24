<template>
    <div class="col col-12 col-md-4 mb-4 mb-md-0">
        <div class="card-programs">

            <div class="logo">
                <!-- <img v-if="logo" :src="logo" />
                <h1 v-else :class="['title', color]">{{name}}</h1> -->

                <h1 :class="['title', 'red']" v-html="customizeLogoText(name)"></h1>
            </div>
            
            <p class="description">{{summary}}</p>
            <NuxtLink class="btn bg-primary" :to="`curriculum/${name.replace(/\s/g, '').toLowerCase()}`">Pelajari Lebih</NuxtLink>
            <NuxtLink v-if="onRegistration == 1 && !isAuthenticated"  class="btn bg-secondary" :to="`register/${name.replace(/\s/g, '').toLowerCase()}`">Daftar</NuxtLink>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: Object,
        registrationPeriod: Boolean,
    },
    data(){
        return {
            id: this.data.id,
            logo: this.data.logo,
            name: this.data.name,
            summary: this.data.summary,
            active: this.data.active,
            onRegistration: this.data.onRegistration,
            color: 'red',

            isAuthenticated: localStorage.getItem('access_token') != null || '',
            // color: this.data.color,
            // readMore: this.data.readMore,
            // register: this.data.register
        }
    },
    created(){
        // console.log(this.id)
    },
    methods: {
        customizeLogoText(text) {
            return text.replace("Jong", "<span>Jong</span>").replace(" ", "")
        }
    }
}
</script>