<template>
    <section class="card border m-0">
        <b-table
            id="datatables"
            class="pb-4 m-0"
            head-variant="light"
            responsive
            outlined
            show-empty
            tdClass="vetical-align: middle"
            :fields="fields"
            :items="items"
            :busy="isBusy"
            :tbody-tr-class="rowClass"
        >
            <template #cell(no)="data">
                <div class="w-100 text-center">{{data?.item?.rank}}</div>
            </template>
            <template #cell(name)="data">
                <nuxt-link
                    class="name-link" 
                    :to="`/dashboard/students/${data?.item?.id}`"
                >{{ data?.item?.name }}</nuxt-link>
            </template>
            <template #cell(score)="data">
                {{data.item.score}} / 100
            </template>
            <template #table-busy>
                <div class="my-2 text-center text-primary">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Memuat Data...</strong>
                </div>
            </template>
        </b-table>
        <b-pagination
            v-if="!isBusy"
            class="mx-4"
            v-model="pagination.page"
            :total-rows="pagination.totalItems"
            :per-page="pagination.perPage"
            @change="onUpdatePage"
        ></b-pagination>
    </section>
  </template>
  
  <script>
  import moment from 'moment'
  
  export default {
      props: {
          isBusy: Boolean,
          role: String,
          fields: {
              type: Array
          },
          leaderboardDetail: {
              type: Object,
              default: {}
          },
          classroomDetail: {
              type: Object,
              default: {}
          },
          items: {
              type: Array,
              default: []
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
      filters: {
          capitalize: function (value) {
              if (!value) return ''
              value = value.toString()
              return value.charAt(0).toUpperCase() + value.slice(1)
          },
      },
      data() {
          return {
              res: "",
              userKind: localStorage.getItem('user_kind'),
              user: JSON.parse(localStorage.getItem('user'))
          }
      },
      mounted() {
        // Set the initial number of items
          const url = this.$router.currentRoute.fullPath
          this.res = url.split('/')
          this.res.shift()
          this.res = this.res[1]
          this.pagination.totalItems = this.items.length
      },
      methods: {
          async onClickDownload(){
              let dispatch = 'Services/classroomLeaderboardsExport'
              
              if (this.classroomDetail.pretest == 1) dispatch = 'Services/pretestLeaderboardsExport'
  
              await this.$store.dispatch(dispatch, this.classroomDetail.id)
              .then(() => {
                  var servicesState = this.$store.state.Services
  
                  if(!servicesState.status) {
                      console.error('Failed download leaderboard', servicesState.message)
                  } else {
                  }
              })
          },
          onClickOpen(item) {
              const url = `/dashboard/students/${item.userId}`
              this.$router.push(url)
          },
          rowClass(item, type) {
              if (!item || type !== 'row') return
              if (item.userId === this.user.id) return 'table-primary'
          },
          beautifyDate(date) {
              return moment(date).format("DD MMM YY")
          },
          onUpdatePage(val) {
              this.$emit('fetchData', val)
          },
      }
  }
  </script>
  
  <style lang="scss" scoped>
    .name-link {
        font-size: 13px !important;
        color: var(--bs-primary) !important;
    }

    .td {
        vertical-align: middle !important;

    }
    .badge {
        text-transform: none !important;
    }
  </style>
  