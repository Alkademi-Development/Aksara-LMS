<template>
    <div id="footer" class="wrapper">
        <div class="container">
            <div class="row">
                <div v-for="(item, index) in data" :key="index" class="col col-12 col-md-4 mb-4 mb-md-0">
                        <img v-if="item.logo" :src="srcLogoLight" class="img-logo" alt="">
                        
                        <h1 v-if="item.title" :class="{'logo': index == 0, 'title': index > 0}">{{item.title}}</h1>

                        <div v-if="item.menus" class="item">
                            <div v-for="(list, col) in item.menus" :key="col">
                                <nuxt-link :to="list.url">{{list.label}}</nuxt-link>
                            </div>
                        </div>

                        <!-- <div v-if="item.hotline">
                            <a href="#" class="button" @click="hotlineBtn(item.hotline)">{{item.hotline.label + ` ${item.hotline.timeStart} - ${item.hotline.timeEnd} WIB`}}</a>
                        </div> -->

                        <div v-if="item.sosmed" class="sosmed d-flex justify-content-center">
                            <div v-for="(list, col) in item.sosmed" :key="col" :class="['sosmed-container', list.alt]" @click="goTo(list.url)">
                                <i :class="[list.icon, 'sosmed-logo']"></i>
                            </div>
                        </div>

                        <div v-if="item.items" class="item">
                            <div v-for="(list, col) in item.items" :key="col">
                                <p>{{list}}</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>

        <b-modal id="modal-hotline" hide-header cancel-disabled ok-title="Oke">
            <p class="my-4">Zoom telah berakhir.</p>
        </b-modal>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    data() {
        return {
            data: [],
            srcLogoLight: ''
        }
    },
    mounted() {
        this.generateFooter();
        this.srcLogoLight = localStorage.getItem('logo-light')
    },
    methods: {
        goTo(url) {
            window.open(url, '_blank')
        },

        hotlineBtn(item) {
            // var start = item.timeStart.replace('.', ':')
            // var end = item.timeEnd.replace('.', ':')

            // const timeNow = moment().valueOf()
            // const timeStart = moment(moment().format('YYYY-MM-DDT') + start + '00', 'YYYY-MM-DDThh:mm:ss').valueOf()
            // const timeEnd = moment(moment().format('YYYY-MM-DDT') + end + '00', 'YYYY-MM-DDThh:mm:ss').valueOf()

            // if(timeNow >= timeStart && timeNow <= timeEnd) {
                this.goTo(item.url)
            // } else {
            //     this.$bvModal.show('modal-hotline')
            // }
        },

        generateFooter() {
            var object = [
                {
                    logo: true,
                },
                {
                    title: 'Informasi Lanjutan',
                    menus: [
                        {
                            label: 'Tentang Kami',
                            url: '/about'
                        },
                        // {
                        //     label: 'Terms Of Service',
                        //     url: "#"
                        // }
                    ],
                },
                {
                    title: 'Kontak Kami',
                    items: [
                        // 'alkademi@alkademi.id', 
                        'Jl. Cisitu Indah VI. No. 6'
                    ],
                    hotline: {
                        url: 'https://s.id/hotlinejk2021',
                        timeStart: '11.00',
                        timeEnd: '13.00',
                        label: 'Hotline Zoom'
                    },
                    sosmed: [
                        // {
                        //     icon: 'fab fa-whatsapp',
                        //     url: 'https://api.whatsapp.com/send/?phone=6289524669635',
                        //     alt: 'wa'
                        // },
                        {
                            icon: 'fab fa-instagram',
                            url: 'https://www.instagram.com/alkademi.idn/',
                            alt: 'ig'
                        },
                        {
                            icon: 'fab fa-youtube',
                            url: 'https://www.youtube.com/channel/UClrtoaPaIHDY2liEh_RJcOg',
                            alt: 'yt'
                        },
                    ],
                    button: 'Contact Now'
                },
            ];

            this.data = object;
        }
    }
}
</script>

<style lang="scss">

</style>