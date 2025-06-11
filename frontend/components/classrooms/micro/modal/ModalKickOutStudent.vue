<template>
    <b-modal 
        v-model="onOpenModal" 
        size="md" 
        centered 
        hide-header 
        hide-footer 
        no-close-on-backdrop 
        no-close-on-esc
    >
        <h4 class="text-center mb-3" v-if="selectedsStudent.length > 1">
            Anda Yakin Akan Mengeluarkan 
            <template v-if="selectedsStudent.length == students.length">
                <b class="active">Semua Peserta</b> 
                Dari Kelas ini ?
            </template>
            <template v-else>
                <b class="active">{{ findStudent(students) }}</b> Dan yang <b class="active">Lain nya</b> 
                Dari Kelas ini ?
            </template>
        </h4>
        <h4 class="text-center mb-3" v-else>
            Anda Yakin Akan Mengeluarkan <b class="active">{{ findStudent(students) }}</b> <br> dari Kelas ini ?
        </h4>

        <b-alert 
            v-model="onEvent.show"
            :variant="onEvent.variant"
            dismissible
        >
            {{ onEvent.message }}
        </b-alert>
        
        <b-form @submit="onSubmitInvite">
            
            <p v-if="modalError" class="text-center mb-3">{{ modalError }}</p>
            <div v-if="!isBusy" class="d-flex align-items-center justify-content-center">
                <!-- <b-button variant="primary" type="submit" :disabled="selectedStudent.length != 0 ? false : true" >Tambahkan</b-button> -->
                <b-button variant="danger" type="submit" @click="toggleModalKickout">Ya, Saya Yakin</b-button>
                <b-button class="outline-light-custom" @click="toggleModalKickout">Tidak</b-button>
            </div>
            <div v-else class="d-flex align-items-center justify-content-end">
                <b-button variant="primary" class="d-flex align-items-center">
                    <b-spinner small class="mr-2"></b-spinner>
                    Loading
                </b-button>
            </div>
        </b-form>
    </b-modal>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: {
        classId: {
            type: Number,
            default: 0,
            required: true
        },
        onOpenModal: {
            type: Boolean,
            default: false,
        },
        selectedsStudent: {
            type: Array,
            default: [],
        },
        students: {
            type: Array,
        },
        classroomDetail: {
            type: Object,
            default: {},
        },
        pagination: {
            type: Object,
            default: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            }
        }
    },
    data() {
        return {
            isBusy: false,
            isLoadingSubmit: false,
            selectStudent: '',
            studentOptions: [],
            addDisabled: true,

            modalError: null,
            isSelectedAllStudent: false,
            // classroomDetail: [],

            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },

        }
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
        })
    },
    mounted() {
    },
    watch: {
        // onOpenModal() {
        //     this.selectedStudent = []
        //     this.modalError = null
        //     this.isBusy = true;

        //     if (this.onOpenModal) this.getStudentsNotJoin()
        // },
        // selectStudent() {
        //     if(this.selectStudent != ''){
        //         this.addDisabled = false
        //     } else {
        //         this.addDisabled = true
        //     }
        //     return 
        // }
    },
    created() {
        // this.getClassroomDetail()
    },
    methods: {
        setEvent(message, status){
            this.onEvent = {
                message: message,
                status: status,
                variant: status === true ? 'success' : 'warning',
                show: true,
                dismissed: false,
            }

            window.scrollTo(0,0)
        },
        toggleModalKickout() {
            this.$emit('toggleModalKickout')
        },
        setSelectedStudent() {
            if(this.selectStudent.trim() !== '') {
                const student = this.studentOptions.find(student => student.email === this.selectStudent)

                if(student != undefined) {
                    const filter = this.selectedStudent?.findIndex((student) => student?.email === this.selectStudent)

                    if(filter === -1) {
                        if (student?.id === 0){
                            const cities = this.$store.state.Cities.cities
                            student.data = cities
                            
                            this.selectedStudent = []
                            this.selectedStudent.push(student)
                            this.isSelectedAllStudent = true
                        } else {
                            if (this.isSelectedAllStudent) {
                                this.selectedStudent = []
                                this.selectedStudent.push(student)
                                this.isSelectedAllStudent = false
                            } else {
                                this.selectedStudent.push(student)
                            }
                        }
                    }

                }
            }
            this.selectStudent = ''
        },
        async getStudentsNotJoin() {
            this.studentOptions = []
            this.isBusy = true;

            await this.$store.dispatch('Services/classroomStudentsNotJoin', this.classId);

            if (!this.servicesState.status) {
                console.error('Failed fetch students', this.servicesState.message);
                this.modalError = this.servicesState.message
                this.isBusy = false;
            } else {
                this.modalError = null
                this.studentOptions = this.servicesState.data;

                this.isBusy = false;
            }
        },
        removeStudent(index){
            this.selectedStudent.splice(index, 1)
        },
        // async getClassroomDetail () {
        //     this.isBusy = true;
        //     await this.$store.dispatch('Services/classroomDetail', this.classId);

        //     if (!this.servicesState.status) {
        //         console.error('failed fetch classroom detail', this.servicesState.message);
        //         this.isBusy = false;
        //     } else {
        //         this.classroomDetail = this.servicesState.classroomDetail
        //         this.isBusy = false
        //     }
        // },
        async onSubmitInvite(event) {
            event.preventDefault();

            this.isLoadingSubmit = true;
            
            const params = {
                userIds: this.selectedsStudent,
                classroomId: this.classroomDetail.id
            }
            await this.$store.dispatch('Services/classroomKickStudent', params)
            .then(() => {
                var servicesState = this.$store.state.Services

                if(!servicesState.status) {
                    console.error('Failed kick student', servicesState.message)
                    this.$emit('setEvent', {message: servicesState.message, status: false})
                    this.$emit('isLoading', true)
                } else {
                    this.$emit('setEvent', 'Berhasil mengeluarkan peserta', true)
                    this.onUpdatePage(this.pagination.page);
                }

                this.isLoadingSubmit = false;
            })

            // console.log(this.selectedsStudent)
            
        },
        onUpdatePage(val) {
            this.$emit('fetchData', val)
        },

        findStudent(students) {

            let nameStudent = "";

            students.forEach((student, index) => {
                this.selectedsStudent.forEach((selectedStudent, index) => {
                    if(student.id == selectedStudent) {
                        nameStudent = student.name ? student.name : "User Ini";
                    }
                })
            });

            return nameStudent;

        }
    }
}
</script>

<style lang="scss" scoped>

.btn-danger {

    span {
        color: #fff !important;
    }
}

h4 {
    font-size: 18px;
}

.active {
    color: #2096C4;
}

button {
    font-weight: 600 !important;
}

.outline-light-custom {
    background-color: white !important;
    outline: 1px solid #ccc !important;
    color: #000 !important;
    transition: .2s ease-in-out !important;

    &:hover {
        background-color: #c7c7c7 !important;
    }
}

#selected-student {

    .student-card{
        border-radius: 6px;
        padding: 12px;
        display: flex;
        align-items: center;
        
        &.selected {
            background-color: #EBEBF0;
        }
        
        .student {
            width: 100%;
            margin: 0;
            color: rgba(0, 0, 0, 0.5);
            font-weight: 400;
            font-size: 14px;
            line-height: 17px;
        }

        .x {
            font-size: 17px;
            line-height: 17px;
            cursor: pointer;
            color: #000000;
            margin: 0;
            padding-left: 4px;
        }

        .program {
            width: 100%;
            text-align: center;
            cursor: pointer;
            padding: 5px;
            line-height: 150%;
            color: #000000;
        }
    }
}
</style>