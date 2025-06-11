<template>
    <div :class="containerClass" >
        <b-card no-body class="border">
            <b-card-header>
                <div class="row d-flex align-items-center">
                    <div class="mb-3 col-12 col-md-8 d-flex align-items-center mb-md-0">
                        <h5 class="mb-0">Progress Review Tugas</h5>
                    </div>
                </div>
            </b-card-header>
            <b-card-body class="max-scroll p-3">
                <div v-if="!isLoading">
                    <div v-if="tasks?.length > 0" class="d-flex flex-column gap-4">
                        <template v-for="(task, idx) in tasks">
                            <b-row
                                v-if="task?.scored != task?.submitted"
                                class="progress-item d-flex align-items-center justify-content-center mx-1 py-3 bg-light"
                                :key="idx"
                                @click="goToReviewTugas(task)"
                            >
                                <b-col cols="auto" md="4">
                                    <h6 class="mb-0">{{ task?.title }}</h6>
                                </b-col>
                                <b-col class="d-flex align-items-center justify-content-center">
                                    <b-progress 
                                        class="w-100 mb-0" 
                                        height=".5rem" 
                                        variant="primary"
                                        :value="task?.scored" 
                                        :max="task?.totalStudent"
                                    ></b-progress>
                                </b-col>
                                <b-col cols="auto" class="text-right">
                                    <h6 class="mb-0">{{ task?.scored }} / {{ task?.submitted }}</h6>
                                </b-col>
                            </b-row>
                        </template>
                        <p v-if="!isThereStudentSubmittedAgain" class="information-empty">Belum ada siswa yang mengumpulkan tugas lagi</p>
                    </div>
                    <div v-else class="text-center">Belum ada tugas yang tersedia</div>
                </div>
                <div v-else class="d-flex flex-column gap-4">
                    <b-skeleton v-for="index in 5" :key="`loading-state--${index}`" class="loading-state"></b-skeleton>
                </div>
            </b-card-body>
        </b-card>
    </div>
</template>

<script>export default {
    props: {
        containerClass: String,
        tasks: Array,
        isLoading: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        isThereStudentSubmittedAgain(){
            return this.tasks.find(task => task?.scored != task?.submitted);
        }
    },
    methods: {
        goToReviewTugas(task) {
            this.$router.push({
                path: `/dashboard/reviews`,
                query: {
                    classroomId: task.classroomId,
                    classroomSlug: task.classroomSlug,
                    classroomName: task.classroomName
                }
            })
        }
    }
}
</script>

<style scoped>
.max-scroll {
    max-height: 400px !important;
    overflow: auto !important;
}

.progress-item {
    cursor: pointer;
}

.information-empty{
    margin-bottom: 0px;
    text-align: center;
    color: rgba(0, 0, 0, .65);
    font-weight: 500;
}

.loading-state{
    height: 40px;
    margin-bottom: 0px;
}
</style>