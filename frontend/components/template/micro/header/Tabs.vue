<template>
    <div v-if="tabs?.length > 0" :class="['d-flex flex-row align-items-center mw-100 overflow-auto', containerClass]">
        <div v-for="(tab, idx) in tabs" :key="idx">
            <div 
                class="item-tab d-flex flex-row align-items-center mr-4 py-3" 
                v-if="showTabItem(tab)"
                :style="activeTab === tab?.key ? 'border-bottom: solid 3px var(--bs-primary);' : ''"
                @click="!disabled ? onClickTab(tab?.key) : null"
            >
                <span 
                    :class="['text-uppercase', activeTab === tab?.key ? 'font-weight-bold' : '']" 
                    style="font-size: 13px;"
                >
                    <template v-if="tab?.key === 'assignments'">
                        {{ isTestCase ? 'Tes' : 'Tugas' }}
                    </template>
                    <template v-else>{{ tab?.label }}</template>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    props: {
        activeTab: {
            type: String,
            default: ''
        },
        containerClass: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        tabs: {
            type: Array,
            default: () => []
        },
        userKind: {
            type: String,
            default: ''
        },
        isTestCase: {
            type: Boolean,
            default: false,
        }
    },
    watch: {
        tabs() {
            this.setInitialTabs()
        }
    },
    computed: {
        ...mapState({
            sassState: (state) => state.Sass,
            classroomDetail: (state) => state?.Services?.classroomDetail,
        })
    },
    created() {
        this.setInitialTabs()
    },
    methods: {
        showTabItem(tab) {
            const isStudent = this.userKind === 'student';

            if (isStudent && !this.isTestCase) {
                return !(tab?.key === 'student' || tab?.key === 'statistics');
            } else if (isStudent && this.isTestCase) {
                return !(tab?.key === 'student' || tab?.key === 'statistics' || tab?.key === 'courses')
            }
            else {
                return true;
            }
        },
        setInitialTabs() {

            if (this.tabs?.length > 0) {
                const foundActiveTab = this.tabs?.some((tab) => tab?.key === this.activeTab)

                if (!foundActiveTab) {
                    this.$emit('setActiveTab', this.tabs?.[0]?.key)
                }
            }
        },
        onClickTab(tab) {
            this.$emit('setActiveTab', tab)
        }
    },
}
</script>

<style scoped>
    a:hover {
        color: var(--bs-primary);
    }

    .item-tab {
        cursor: pointer;
    }
</style>