<template>
    <b-card no-body>
        <b-card-body @click="$emit('openCourse', item.id)" :class="['cursor-pointer']">
            <b-row align-v="center">
                <b-col>
                    <b-card-title :class="['mb-2']">
                        {{ item.title }}
                    </b-card-title>
                    <!-- <nuxt-link v-if="userKind != 'student' && isAssignment && selectedCourse == item.id" class="btn btn-sm btn-round btn-icon btn-primary" :to="`/dashboard/classroom/assignments/${classId}/course/${item.id}/create`">
                        <span class="btn-inner--icon"><i class="fas fa-square-plus"></i></span>
                        <span class="btn-inner--text">Tugas</span>
                    </nuxt-link> -->
                </b-col>
                <!-- <b-col cols="2" v-if="userKind != 'student' && isAssignment"> -->
                <b-col cols="2" v-if="userKind != 'student'">
                    <i class="fas fa-trash" @click="$emit('onDelete', item)"></i>
                </b-col>
            </b-row>
            <!-- <b-progress max="100" class="mb-0 progress-xs" v-if="userKind == 'student'">
                <b-progress-bar :value="item.progress" class="bg-blue"></b-progress-bar>
            </b-progress> -->
        </b-card-body>
        <div v-if="selectedCourse == item.id" :class="['border-active', isHover ? 'delete' : '']"></div>
        <!-- <div v-if="userKind != 'student'" class="card-delete" v-on:mouseover="isHover = true" v-on:mouseleave="isHover = false" @click="$emit('onDelete', item)">
            <i class="fas fa-trash text-white"></i>
        </div> -->
        <!-- <div :class="['border-delete', isHover ? 'hover' : '']"></div> -->
    </b-card>
</template>

<script>
export default {
    props: {
        item: Object,
        userKind: String,
        selectedCourse: Number,
        classId: Number,
        isAssignment: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            isHover: false
        }
    },
}
</script>

<style scoped>
.card {
    overflow: hidden;
    flex-direction: row;
}
.fa-trash:hover {
    color: var(--bs-danger);
}
.card-delete:hover {
    display: flex;
    position: inherit;
    align-items: center;
    height: auto;
    z-index: 2;
    /* transition: all .2s ease; */
    background-color: var(--bs-danger);
}
.card-delete {
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    position: inherit;
    align-items: center;
    height: auto;
    z-index: 2;
    /* transition: all .2s ease; */
    background-color: var(--bs-primary);
}
.border-active {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border: 5px solid var(--bs-primary);
}
.border-active.delete {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border: 5px solid var(--bs-danger);
}
/* .border-delete {
    display: none;
    position: absolute;
    bottom: 0;
    right: 0;
    border: 5px solid var(--bs-danger);
    transition: all .5s ease;
}
.border-delete.hover {
    display: inherit;
    left: 0;
    transition: all .5s ease;
} */
</style>