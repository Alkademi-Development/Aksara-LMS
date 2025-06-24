<template>
    <b-form @submit="onSubmitForm" class="px-2">
        <b-row align-v="center" align-h="center">
            <b-col v-if="isAddModule" cols="12">
                <label v-if="errorMessage" for="selectedType" class="text-danger">{{ errorMessage }}</label>
                <v-select
                    class="select-city form-control mb-3"
                    :placeholder="isLoadModules ? 'Loading...' : 'Pilih salah satu materi'"
                    :options="optionsModules"
                    label="title"
                    id="selectedType"
                    v-model="selectedModule"
                >
                    <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                        Tidak ada hasil untuk <em>{{ search }}</em>.
                        </template>
                        <em style="opacity: 0.5;" v-else>Ketik untuk mencari.</em>
                    </template>
                </v-select>
            </b-col>
            <b-col cols="12">
                <div v-if="!isSubmit" class="d-flex justify-content-end">
                    <template v-if="isAddModule">
                        <b-button variant="danger" :disabled="isSubmit" @click="$emit('addModuleToggler')">Batal</b-button>
                        <b-button variant="primary" type="submit" :disabled="isSubmit">Tambahkan</b-button>
                    </template>
                </div>
                <div v-else class="d-flex justify-content-end align-items-center">
                    <b-spinner small class="mr-2"></b-spinner>Loading...
                </div>
            </b-col>
        </b-row>
    </b-form>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: {
        classroomId: Number,
        isAddModule: {
            type: Boolean,
            default: false,
        },
        classroomModules: {
            type: Array,
            default: () => []
        },
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services
        })
    },
    data() {
        return {
            isLoadModules: false,
            isSubmit: false,
            optionsModules: [],
            selectedModule: null,
            errorMessage: null,
        }
    },
    watch: {
        selectedModule() {
            this.errorMessage = null
        },
        isAddModule() {
            this.selectedModule = null
            this.errorMessage = null
            if (this.isAddModule && this.optionsModules.length == 0) {
                this.fetchCourses()
            }
        }
    },
    mounted() {
        this.fetchCourses()
    },
    methods: {
        async fetchCourses(){
            this.isLoadModules = true
            let params = {}
            
            await this.$store.dispatch('Services/modules', params)

            if(!this.servicesState.status) {
                console.error('Failed fetch modules', this.servicesState.message)
                this.isLoadModules = false
            } else {
                this.optionsModules = this.servicesState.modules ?? [];

                // Filter Modules
                var modules = []
                this.optionsModules.map((item) => {
                    const find = this.classroomModules.find(course => course.id == item.id)

                    if (!find) modules.push(item)
                })

                this.optionsModules = modules
                this.isLoadModules = false
            }

        },
        async onSubmitForm(event) {
            event.preventDefault()

            if (!this.selectedModule) return this.errorMessage = 'Pilih salah satu materi yang tersedia'

            this.isSubmit = true

            await this.$store.dispatch('Services/classroomAssignModule', {classroomId: this.classroomId, moduleId: this.selectedModule.id})

            if(!this.servicesState.status) {
                console.error('Failed fetch modules', this.servicesState.message)
                this.errorMessage = this.servicesState.message
                this.isSubmit = false
            } else {
                this.optionsModules = this.servicesState.modules ?? [];
                this.errorMessage = null
                this.isSubmit = false
                this.$emit('addModuleToggler')
                this.$emit('submitAddModule', this.selectedModule.id)
            }
        },
    }
}
</script>

<style lang="scss" scoped>
::v-deep .select-city ul{
    overflow-x: hidden !important;
}
</style>