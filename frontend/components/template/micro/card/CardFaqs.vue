<template>
    <div class="col col-lg-6">
        <div class="card-faqs">
            <h1>{{title}}</h1>
            <vsa-list v-for="(item, index) in accordion" :key="index" class="accordion">
                <vsa-item :class="indexData %2 == 0 ? 'left' : 'right'">
                    <vsa-heading class="sub-title">
                        {{item.subTitle}}
                    </vsa-heading>

                    <vsa-content class="sub-description">
                        <div v-html="item.subDescription"></div>
                    </vsa-content>
                </vsa-item>
            </vsa-list>
        </div>
    </div>
</template>

<script>
import {
  VsaList,
  VsaItem,
  VsaHeading,
  VsaContent,
  VsaIcon
} from 'vue-simple-accordion';
import 'vue-simple-accordion/dist/vue-simple-accordion.css';

export default {
    components: {
        VsaList,
        VsaItem,
        VsaHeading,
        VsaContent,
        VsaIcon
    },
    props: {
        data: Object,
        indexData: 0
    },
    data() {
        return {
            title: this.data.title,
            accordion: this.data.accordion,
        }
    },
    methods: {
    }
}
</script>