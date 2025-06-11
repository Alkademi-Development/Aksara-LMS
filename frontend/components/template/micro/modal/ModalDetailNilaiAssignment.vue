<template>
  <b-modal
      v-model="dataVModel"
      size="md"
      centered
      hide-header
      hide-footer
  >
      <b-col cols="10" class="mx-auto">
          <h4 class="text-center">
              Nilai Tugas <strong class="text-primary">{{ assignmentDetail?.title }}</strong> Kamu
          </h4>
      </b-col>
      <h4 class="text-center mt-2" id="nilai">
          <b>{{ assignmentDetail?.scored && assignmentDetail?.score }}</b>
      </h4>
      <h4 id="catatan" class="">Catatan: </h4>
      <p class="text-md mt-2 overflow-auto" v-html="assignmentDetail?.mentorNotes != '' ? assignmentDetail?.mentorNotes : 'Tidak ada catatan'"></p>

  </b-modal>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
      onOpenModal: {
          type: Boolean,
          default: false,
      },
      pagination: {
          type: Object,
          default: {
              page: 1,
              perPage: 10,
              totalItems: 0,
              totalPages: 0,
          }
      },
      assignmentDetail: {
          type: Object,
      }
  },
  data() {
      return {
          isBusy: false,

          modalError: null,
          onEvent: {
              message: '',
              status: true,
              show: false,
              variant: ''
          },
          dataVModel: false

      }
  },
  watch: {
        onOpenModal() {
            this.dataVModel = this.onOpenModal
            this.$emit('vModelChange', this.dataVModel)
        },
        dataVModel() {
            this.$emit('vModelChange', this.dataVModel)
        }
  },
  computed: {
      ...mapState({
          servicesState: (state) => state.Services,
      })
  },
  mounted() {
  },
  created() {
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
  font-size: 24px !important;
  font-weight: 400 !important;
}

h4#nilai {
  margin-top: 24px !important;
  font-size: 28px !important;
}

h4#catatan {
  margin-top: 24px;
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
