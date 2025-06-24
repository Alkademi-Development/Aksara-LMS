<template>
    <div>
        <Divider :name="name"/>
        <div class="row">
            <div v-for="(item, index) in dataMentor" :key="index" class="col-lg-4">
                <div class="mentor-container">
                    <div class="mentor-content">
                        <div class="img-container">
                            <b-avatar 
                                variant="primary" 
                                :src="item.photo"
                                :text="item.photo == '' || item.photo == null ? item.name[0] : ''">
                            </b-avatar>
                        </div>
                        <h1 class="name">{{item.name}}</h1>
                        <p class="job">{{item.job}}</p>
                        <div class="expertise">
                            <p>
                                <span v-for="(data, i) in item.expertise" :key="i">
                                    {{data}}{{i != item.expertise.length - 1 ? ',&nbsp;' : ''}}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Divider from '@/components/mentor/Divider.vue'

export default {
    components: {
        Divider
    },
    props: {
        data: Object
    },
    data(){
        return {
            name: this.data.name,
            dataMentor: this.data.mentors
        }
    }
}
</script>