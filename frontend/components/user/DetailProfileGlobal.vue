<template>
  <div>
    <div v-if="!isError" class="row">
      <div class="col-xl-4">
        <div v-if="!userLoading" class="card card-profile">
          <img
            src="@/assets/img/theme/img-1-1000x600.jpg"
            alt="Image placeholder"
            class="card-img-top"
          />

          <div class="row justify-content-center mb-5">
            <div class="col-lg-3 order-lg-2">
              <div
                :class="[
                  'card-profile-image',
                  userDetail.photo != null ? 'cursor-pointer' : '',
                ]"
                @click="
                  userDetail.photo != null
                    ? showModalDetail({
                        url: userDetail.photo,
                        title: userDetail.name,
                      })
                    : ''
                "
              >
                <b-avatar
                  size="8rem"
                  variant="primary"
                  :src="userDetail.photo"
                  :text="
                    userDetail.photo == '' || userDetail.photo == null
                      ? userDetail.name[0]
                      : ''
                  "
                >
                </b-avatar>
              </div>
            </div>
          </div>

          <div class="card-body">
            <div class="text-center">
              <h5 class="h3">
                {{ userDetail.name }}
              </h5>

              <div
                v-if="userDetail.bio != ''"
                class="
                  h5
                  font-weight-300
                "
              >
                {{ userDetail.bio }}
              </div>
              <div
                v-if="userDetail.city"
                class="
                  h5
                  d-flex
                  align-items-center
                  justify-content-center
                  font-weight-400
                  mt-4
                "
              >
                <i class="ni ni-pin-3 mr-2"></i>{{ userDetail.city.name }}
              </div>

              <!-- <div
                class="h5 d-flex align-items-center justify-content-center mt-4"
              >
                <i class="ni ni-hat-3 mr-2"></i>{{ userDetail.program }}
              </div> -->
            </div>
          </div>
        </div>

        <div v-else>
          <b-card>
            <div class="my-2 text-center text-primary">
              <b-spinner class="align-middle mr-2"></b-spinner>
              <strong>Memuat Data...</strong>
            </div>
          </b-card>
        </div>
      </div>

      <div class="col-xl-8">

        <div v-if="!taskLoading">
          <div v-if="$route?.query?.slug">
            <StudentAssignment
              :isPublic="true"
              :userId="userDetail?.id"
              :classSlug="$route?.query?.slug"
              :emailEncrypt="emailEncrypt"
            />
          </div>

          <div v-else>
            <b-card>
              <div class="my-2 text-center text-primary">
                <strong>Tugas tidak ditemukan</strong>
              </div>
            </b-card>
          </div>
        </div>

        <div v-else>
          <b-card>
            <div class="my-2 text-center text-primary">
              <b-spinner class="align-middle mr-2"></b-spinner>
              <strong>Memuat Tugas...</strong>
            </div>
          </b-card>
        </div>

      </div>

      <b-modal
        id="modal-detail"
        center
        :title="modalTitle"
        size="lg"
        cancel-disabled
        hide-footer
      >
        <div class="text-center">
          <b-img-lazy
            v-if="modalImage != null"
            center
            fluid
            :src="modalImage"
            blank
            blank-color="#bbb"
          ></b-img-lazy>

          <b-card-title v-else>Tidak Ada {{ modalTitle }}</b-card-title>
        </div>
      </b-modal>
    </div>

    <div v-else class="row">
      <div class="col">
        <b-card>
            <div class="my-2 text-center text-primary">
              <strong>{{ errorMessage }}</strong>
            </div>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader.vue";
import Footer from "@/components/template/dashboard/Footer.vue";
import CardTaskProfile from "@/components/template/micro/card/CardTaskProfile.vue";
import { mapState } from 'vuex';
import StudentAssignment from "@/components/user/StudentAssignment.vue";

export default {
    layout: "dashboard",

    props: ['emailEncrypt'],

    computed: {
        ...mapState({
            servicesState: (state) => state.Services
        })
    },

    components: {
        ContentHeader,
        Footer,
        CardTaskProfile,
        StudentAssignment
    },

    data() {
        return {
        isError: false,
        errorMessage: "",
        taskLoading: true,
        userLoading: true,

        userDetail: {},

        modalImage: null,
        modalTitle: "",
        
        studentTasks: [],

        pagination: {},

        programTitle: "",
        };
    },

    created() {
        this.fetchUserDetail()
    },

    methods: {
        async fetchUserDetail() {
            this.userLoading = true

            await this.$store.dispatch("Services/detailUserbyHashEmail", this.emailEncrypt)

            if (!this.servicesState.status) {
                console.log("Failed fetch user detail", this.servicesState.message);
                // this.setEvent(this.servicesState.message, false)
                this.userLoading = false;
                this.taskLoading = false;
                this.isError = true;
                this.errorMessage = this.servicesState.message
            } else {
                this.userDetail = this.servicesState.data;
                // this.studentTasks = this.servicesState.user.tasks;

                this.userLoading = false;
                this.taskLoading = false;
                this.isError = false;
                this.errorMessage = "";

                // this.studentAssigment()
            }
        },
        async studentAssigment() {
            this.taskLoading = true

            await this.$store.dispatch("Services/publicAssignment", this.emailEncrypt)

            if (!this.servicesState.status) {
                console.log("Failed fetch user assigment", this.servicesState.message);
                // this.setEvent(this.servicesState.message, false)
                this.taskLoading = false;
                this.isError = true;
                this.errorMessage = this.servicesState.message
            } else {
                this.studentTasks = this.servicesState.data;

                this.taskLoading = false;
                this.isError = false;
                this.errorMessage = "";
            }
        },

        // onClickPrev() {
        //   this.fetchStudentTasks(this.pagination.currentPage - 1);
        //   // this.pagination.currentPage -= 1
        //   // console.log(this.pagination.currentPage)
        // },

        // onClickNext() {
        //   this.fetchStudentTasks(this.pagination.currentPage + 1);
        //   // this.pagination.currentPage += 1
        //   // console.log(this.pagination.currentPage)
        // },

        showModalDetail(data) {
        this.modalImage = data.url;
        this.modalTitle = data.title;

        this.$bvModal.show("modal-detail");
        },
        
    },

    watch: {

        programTitle: function () {

        this.$emit('programTitle', this.programTitle)

        }

    }
};
</script>

<style>
</style>