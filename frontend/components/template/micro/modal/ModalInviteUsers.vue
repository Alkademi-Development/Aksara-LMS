<template>
    <div class="modal-invite-users">
        <h3 class="modal-title text-center">Tambah Mentor</h3>

        <b-form @submit="inviteStudent">

            <b-form-group>

                <SearchDropdownCheckbox 
                    v-if="!isLoadStudentsNotJoin"
                    :id="`checkbox-add-mentor`"
                    class="w-100"
                    buttonTitle="Pilih Mentor"
                    placeholder="Cari Atau Pilih Email Mentor"
                    :items="cityOptions"
                    @onChange="mentorSelected = $event"/>

            </b-form-group>

            <p v-if="modalError" class="text-center mb-3">{{modalError}}</p>

            <div v-if="!isInvite" class="d-flex align-items-center justify-content-end">
                <b-button variant="primary" type="submit" :disabled="mentorSelected.length != 0 ? false : true" >Tambahkan</b-button>
                <b-button variant="danger" @click="toggleInviteModal">Batal</b-button>
            </div>

            <div v-else class="d-flex align-items-center justify-content-end">
                <b-button variant="primary" class="d-flex align-items-center"><b-spinner small class="mr-2"></b-spinner>Loading</b-button>
            </div>

        </b-form>
    </div>
</template>

<script>
import { mapState } from "vuex";

import SearchDropdownCheckbox from '@/components/template/micro/inputs/SearchDropdownCheckbox.vue'

const ACTION_YES = 'actionYes'
const ACTION_NO = 'actionNo'

export default {
    props: {
        classroomId: {
            type: Number,
            default: -1
        },
        classroomSlug: {
            type: String,
            default: ""
        },
    },

    components: { SearchDropdownCheckbox },

    data() {
        return {
            isInvite: false,
            isLoadStudentsNotJoin: true,
            modalError: null,

            cityOptions: [],
            selectCity: '',
            mentorSelected: [],
            addDisabled: true,
        }
    },

    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            usersState: (state) => state.Users
        }),
    },

    mounted() {
        this.getStudentsNotJoin()
    },

    methods: {
        toggleInviteModal() {
            this.mentorSelected = []
            this.modalError = null
            this.isInvite = false;
            this.$emit(ACTION_NO)
        },
        async getStudentsNotJoin() {
            this.cityOptions = []
            this.isLoadStudentsNotJoin = true;

            const params = {
                classroomSlug: this.classroomSlug,
                joined: false
            }
            
            await this.$store.dispatch('Services/classroomMentors', params);

            if(!this.servicesState.status) {

                console.error(`Failed fetch mentors`, this.servicesState?.message);
                this.modalError = this.servicesState?.message
                this.isLoadStudentsNotJoin = false;

            } else {

                this.servicesState?.data?.map((item) => {
                    const object = {
                        label: item?.name,
                        value: item?.id
                    }
                    this.cityOptions.push(object)
                })

                this.modalError = null
                this.isLoadStudentsNotJoin = false;

            }
        },
        async inviteStudent(event) {
            event.preventDefault()
            this.isInvite = true;
            var listId = []

            this.mentorSelected.map((item) => {
                listId.push(item?.value)
            })

            const payloads = {
                params: listId,
                classroomId: this.classroomId
            }

            // return console.log(payloads, "PARAMS")
            await this.$store.dispatch('Services/classroomAssignMentors', payloads);

            if (!this.servicesState?.status) {
                console.error(`Failed add mentor`, this.servicesState?.message);
                this.modalError = this.servicesState?.message
                this.isInvite = false;
            } else {
                this.mentorSelected = []
                this.modalError = null
                this.isInvite = false;
                this.$emit(ACTION_YES)
            }
        },
    }


}
</script>

<style lang="scss">
@import '@/assets/scss/components/micro/modal-invite-users.scss';
</style>