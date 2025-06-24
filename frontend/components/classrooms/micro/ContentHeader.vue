<template>
    <b-row :class="['mb-4', containerClass]">
        <b-col class="d-flex align-items-center mb-2 mb-md-0 ">
            <h4 class="title">{{ title }}</h4>
        </b-col>
        <b-col 
            v-if="userKind !== 'student' && userKind !== 'teacher' && actionButtons"
            cols="6" 
            sm="auto" 
            class="d-flex flex-row  align-items-center justify-content-end "
        >
            <div v-for="(action, idx) in actionButtons" :key="idx">
                <button 
                    v-if="action?.type === 'button'" 
                    :class="action?.class" 
                    @click="action?.isAction ? onClickAction(action?.to) : onClickLink(action?.to, action?.classId)"
                >
                    <i 
                        v-if="!!action?.iconClass" 
                        :class="action?.iconClass">
                    </i>
                    {{ action?.text }}
                </button>
                
                <div v-if="action?.type === 'dropdown'"  class="dropdown">
                    <button
                        :class="action?.class"
                        role="button" 
                        data-toggle="dropdown" 
                        aria-haspopup="true" 
                        aria-expanded="false"
                    >
                        <i v-if="!!action?.iconClass" :class="action?.iconClass"></i>
                        {{ action?.text }}
                        <i class="ri-arrow-down-s-line"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right mt-3">
                        <button 
                            v-for="(item, index) in action?.dropdownItem" 
                            :key="index" 
                            class="dropdown-item"
                            @click="item?.type === 'action' ? onClickAction(item?.to) : onClickLink(item?.to)"
                        >
                            <span class="text-darker">{{ item?.text }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </b-col>
    </b-row>
</template>

<script>
import { toEncrypt } from '~/commons/utils';

export default {
    props: {
        actionButtons: {
            type: Array,
            default: () => []
        },
        containerClass :{
            type: String,
            default: ''
        },
        page: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        userKind: {
            type: String,
            default: ''
        },
        classId: {
            type: Number,
            default: -1
        },
    },
    methods: {
        onClickAction(action) {
            this.$emit(action)
        },
        onClickLink(link, classId){
            localStorage.setItem('classId', toEncrypt(this.classId))
            this.$router.push({
                path: link,
            })
        }
    },
    mounted() {
        // console.log(this.classId)
    }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/components/classroom/courses.scss';
</style>