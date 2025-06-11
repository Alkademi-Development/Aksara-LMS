<template>
    <b-modal
        v-model="onOpenModal"
        size="lg"
        centered
        hide-header
        hide-footer
        no-close-on-backdrop
        no-close-on-esc
    >
        <h3 class="text-center mb-3">Tambah Peserta</h3>

        <b-alert
            v-model="onEvent.show"
            :variant="onEvent.variant"
            dismissible
        >
            {{ onEvent.message }}
        </b-alert>

        <b-form @submit="onSubmitInvite">
            <b-form-group label-for="inputEmail">
                <SearchDropdownCheckbox
                    v-if="!isBusy"
                    :id="`checkbox-add-student`"
                    class="w-100"
                    buttonTitle="Pilih Siswa"
                    placeholder="Cari Atau Pilih Email Siswa"
                    :items="studentOptions"
                    @onChange="selectedStudent = $event"/>

                <!-- <div class="d-flex justify-content-between m-0">
                    <b-form-input
                        v-model="selectStudent"
                        :placeholder="isBusy ? 'Loading...' : 'Tekan untuk memilih email peserta'"
                        class="mr-2"
                        list="list-student"
                    ></b-form-input>
                    <datalist id="list-student" hidden>
                        <option
                            v-for="(item, index) in studentOptions"
                            :key="index"
                            :class="item.email"
                        >
                            {{ item.email }}
                        </option>
                    </datalist>
                    <b-button
                        variant="primary"
                        :disabled="addDisabled"
                        @click="setSelectedStudent()"
                    >
                        Pilih
                    </b-button>
                </div> -->
            </b-form-group>

            <!-- <b-form-group
                v-if="selectedStudent?.length > 0"
                label="Email Terpilih"
            >
                <div id="selected-student">
                    <div class="row">
                        <div
                            v-for="(item, index) in selectedStudent"
                            :key="index"
                            class="col col-lg-6 mb-3"
                        >
                            <div class="student-card selected">
                                <p class="student">{{ item.email }}</p>
                                <i class="x ri-close-fill" @click="removeStudent(index)"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </b-form-group> -->

            <p v-if="modalError" class="text-center mb-3">{{ modalError }}</p>
            <div v-if="!isBusy" class="d-flex align-items-center justify-content-end">
                <!-- <b-button variant="primary" type="submit" :disabled="selectedStudent.length != 0 ? false : true" >Tambahkan</b-button> -->
                <b-button variant="primary" type="submit" >Tambahkan</b-button>
                <b-button variant="danger" @click="toggleModalInvite">Batal</b-button>
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

import SearchDropdownCheckbox from '@/components/template/micro/inputs/SearchDropdownCheckbox.vue'

export default {
    components: {
        SearchDropdownCheckbox
    },
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
        classroomDetail: {
            type: Object,
            default: {},
        }
    },
    data() {
        return {
            isBusy: false,
            selectedStudent: [],
            selectStudent: "",
            studentOptions: [],
            addDisabled: true,
            modalError: null,
            isSelectedAllStudent: false,
            // classroomDetail: [],
            onEvent: {
                message: "",
                status: true,
                show: false,
                variant: ""
            },
        };
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
        })
    },
    watch: {
        onOpenModal() {
            this.selectedStudent = [];
            this.modalError = null;
            this.isBusy = true;
            if (this.onOpenModal)
                this.getStudentsNotJoin();
        },
        selectStudent() {
            if (this.selectStudent != "") {
                // this.setSelectedStudent()
                this.addDisabled = false;
            }
            else {
                this.addDisabled = true;
            }
            return;
        }
    },
    created() {
        // this.getClassroomDetail()
    },
    methods: {
        setEvent(message, status) {
            this.onEvent = {
                message: message,
                status: status,
                variant: status === true ? "success" : "warning",
                show: true,
                dismissed: false,
            };
            window.scrollTo(0, 0);
        },
        toggleModalInvite() {
            this.selectedStudent = [];
            this.modalError = null;
            this.isBusy = true;
            this.selectStudent = "";
            this.$emit("toggleModalInvite");
        },
        setSelectedStudent() {

            if (this.selectStudent.trim() !== "") {
                const student = this.studentOptions.find(student => student.email === this.selectStudent);
                if (student != undefined) {
                    const filter = this.selectedStudent?.findIndex((student) => student?.email === this.selectStudent);
                    if (filter === -1) {
                        if (student?.id === 0) {
                            const cities = this.$store.state.Cities.cities;
                            student.data = cities;
                            this.selectedStudent = [];
                            this.selectedStudent.push(student);
                            this.isSelectedAllStudent = true;
                        }
                        else {
                            if (this.isSelectedAllStudent) {
                                this.selectedStudent = [];
                                this.selectedStudent.push(student);
                                this.isSelectedAllStudent = false;
                            }
                            else {
                                this.selectedStudent.push(student);
                            }
                        }
                    }
                }
            }
            this.selectStudent = "";
        },
        async getStudentsNotJoin() {
            this.studentOptions = [];
            this.isBusy = true;
            await this.$store.dispatch("Services/classroomStudentsNotJoin", this.classId);
            if (!this.servicesState.status) {
                console.error("Failed fetch students", this.servicesState.message);
                this.modalError = this.servicesState.message;
                this.isBusy = false;
            }
            else {
                this.modalError = null;
                this.servicesState.data?.map((item) => {
                    const object = {
                        label: item?.email,
                        value: item?.id,
                        email: item?.email
                    }
                    this.studentOptions.push(object)
                })
                // this.studentOptions = this.servicesState.data;
                this.isBusy = false;
            }
        },
        removeStudent(index) {
            this.selectedStudent.splice(index, 1);
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
            if (this.selectedStudent?.length > 0) {
                this.isBusy = true;
                var emails = [];
                this.selectedStudent.map((item) => {
                    emails.push(item.email);
                });
                const params = {
                    emails: emails,
                    code: this.classroomDetail.code
                };
                await this.$store.dispatch("Services/classroomInviteStudent", params);
                if (!this.servicesState.status) {
                    console.error("Failed invite student", this.servicesState.message);
                    this.modalError = this.servicesState.message;
                    this.isBusy = false;
                }
                else {
                    this.$emit("setEvent", "Berhasil menambahkan peserta", true);
                    this.selectedStudent = [];
                    this.modalError = null;
                    this.isBusy = false;
                    this.$emit("fetchStudents");
                    this.toggleModalInvite();
                }
            }
            else {
                this.setEvent("Belum ada peserta yang dipilih", false);
            }
        },
    },
}
</script>

<style lang="scss" scoped>

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