import { mapActions, mapState } from 'vuex';
import { toDateShort } from '~/commons/utils'

export default {
  computed: {
    ...mapState({            
        assignmentReview: (state) => state.Assignments,
        participantsState: (state) => state.Dashboard.participants,
        dailyLoginState: (state) => state.Dashboard.dailyLogin,
        landingVisitorState: (state) => state.Dashboard.landingVisitor,
        classVisitorState: (state) => state.Dashboard.classVisitor,
        programParticipantState: (state) => state.Dashboard.programParticipants,
        sassState: (state) => state.Sass, 
        servicesState: (state) => state.Services,
        dashboardState: (state) => state?.Dashboard,
    }),
  },
  data(){
    return{
      landingVisitor: {
        data: null,
        isLoading: false,
        params: {
          fromDate: '',
          toDate: ''
        },
        filterOptions: [
          { label: 'Monthly', value: 1 },
          { label: 'Weekly', value: 2 },
          { label: 'Daily', value: 3 },
        ],
        selectedFilter: null,
      },
      dailyLogin: {
        data: null,
        isLoading: false,
        params: {
          fromDate: '',
          toDate: ''
        },
      },
      classVisitor: {
        data: null,
        options: null,
        isLoading: false,
        params: {
          fromDate: '',
          toDate: ''
        },
      },
      chartProgramParticipant: {
        data: null,
        options: null,
        isLoading: false,
      },
      assignment: {
        options: [],
        isLoading: false,
        pagination: {
          page: 1,
          perPage: 10,
          totalItems: 0,
          totalPages: 0,
        }
      },
      classrooms: {
        data: [],
        isLoading: false,
        isLoadMore: false,
        selectedFilter: null,
        pagination: {
            page: 1,
            perPage: 10,
            totalItems: 0,
            totalPages: 0,
        },
      },
      participants: {
        fields: [],
        items: [],
        isLoading: false,
        selectedFilter: null
      },
    }
  },
  methods: {
    ...mapActions({
      getParticipants: 'Dashboard/fetchParticipants',
      getDailyLogin: 'Dashboard/fetchDailyLogin',
      getLandingVisitor: 'Dashboard/fetchVisitor',
      getClassVisitor: 'Dashboard/fetchClassVisitor',
      getProgramParticipants: 'Dashboard/fetchProgramParticipants'
    }),
    /**
     * To set date useful fetch statistic to payload
     */
    setDateVisitor() {
      const currently = new Date(Date.now());
      const today = toDateShort(new Date(Date.now()))
      const weekBeforeToday = toDateShort(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      const monthBeforeToday = toDateShort(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))

      this.landingVisitor.params = {
          kind: 1,
          dateFrom: `${currently.getFullYear()}-01-01`,
          dateTo: `${currently.getFullYear()}-12-31`,
      }

      this.classVisitor.params = {
          dateFrom: `${currently.getFullYear()}-01-01`,
          dateTo: `${currently.getFullYear()}-12-30`,
      }

      // Weekly only
      this.dailyLogin.params = {
          kind: 4,
          dateFrom: weekBeforeToday,
          dateTo: today
      }
    },

    /**
     * Fetching data landing visitor
     */
    async fetchLandingVisitor(){
      this.landingVisitor.isLoading = true;

      await this.getLandingVisitor(this.landingVisitor.params);

      if(!this.landingVisitorState?.status){
          console.error(this.landingVisitorState?.message);
          this.landingVisitor.isLoading = false;
      }else{
          this.landingVisitor.data = this.landingVisitorState?.data;
          this.landingVisitor.isLoading = false;
      }
    },

    /**
     * Fetching data daily login
     */
    async fetchDailyLogin(){
      this.dailyLogin.isLoading = true;

      await this.getDailyLogin(this.dailyLogin.params);

      if(!this.dailyLoginState?.status){
          console.error(this.dailyLoginState?.message);
          this.dailyLogin.isLoading = false;
      }else{
          this.dailyLogin.data = this.dailyLoginState?.data;
          this.dailyLogin.isLoading = false;
      }
    },

    /**
     * Fetching data most visited class
     */
    async fetchClassVisitor(){
      this.classVisitor.isLoading = true;

      await this.getClassVisitor(this.classVisitor.params);

      if(!this.classVisitorState?.status){
          console.error(this.classVisitorState?.message);
          this.classVisitor.isLoading = false;
      }else{
          this.classVisitor.data = this.classVisitorState?.data;
          this.classVisitor.options = this.classVisitorState?.options;
          this.classVisitor.isLoading = false;
      }
    },

    /**
     * Fetching data Program Participants
     */
    async fetchProgramParticipants(){
      this.chartProgramParticipant.isLoading = true;

      await this.getProgramParticipants();

      if(!this.programParticipantState?.status){
          console.error(this.programParticipantState?.message);
          this.chartProgramParticipant.isLoading = false;
      }else{
          this.chartProgramParticipant.data = this.programParticipantState?.data;
          this.chartProgramParticipant.options = this.programParticipantState?.options;
          this.chartProgramParticipant.isLoading = false;
      }
    },

    /**
     * Fetching data Assignment to review
     */
    async fetchAssignmentToReview() {
      this.assignment.isLoading = true;

      const params = {
          page: this.assignment?.pagination?.page,
          perPage: this.assignment?.pagination?.perPage,
      }

      await this.$store.dispatch('Assignments/listReview', params)

      if (!this.assignmentReview?.status) {
          console.error('failed fetch assignment: ', this.assignmentReview?.message);
          this.assignment.isLoading = false;
      } else {
          this.assignment.pagination = this.assignmentReview?.pagination
          let assignmentData = this.assignmentReview?.data

          if (!this.classrooms.isLoadMore) this.assignment.options = assignmentData
          else {
              assignmentData.map((item) => {
                  this.assignment.options.push(item)
              })
          }

          this.assignment.isLoading = false;
      }
    },

    /**
     * Fetch data class active
     */
    async fetchClassActive() {
      if (!this.classrooms.isLoadMore) this.classrooms.isLoading = true;
      else this.classrooms.isLoading = false;

      const params = {
          page: this.classrooms?.pagination?.page,
          perPage: this.classrooms?.pagination?.perPage,
      }

      await this.$store.dispatch('Services/classrooms', params)

      if (!this.servicesState.status) {
          console.error('failed fetch active classroom: ', this.servicesState.message)
          this.classrooms.isLoading = false;
          this.classrooms.isLoadMore = false;
      } else {
          this.classrooms.pagination = this.servicesState.pagination;
          let classroomsData = this.servicesState.classrooms

          if(!this.classrooms.isLoadMore) this.classrooms.data = classroomsData;
          else {
              classroomsData.map((item) => {
                  this.classrooms.data.push(item);
              })
          }

          this.classrooms.isLoading = false;
          this.classrooms.isLoadMore = false;
      }
    },

    /**
     * Fetch data of Top Rankings This Week
     */
    async fetchParticipants(){
      this.participants.isLoading = true;

      await this.getParticipants(this.participants?.selectedFilter?.value);

      if(!this.dashboardState?.status){
          console.error("Failed to get participants", this.dashboardState?.message);
          this.participants.isLoading = false;
      }else{
          this.participants.fields = this.participantsState?.fields;
          this.participants.items = this.participantsState?.items;
          this.participants.isLoading = false;
      }
    },

    /**
     * To handle change page of pagination when infinite scroll in drowndown class
     */
    handleChangePageFilter(){
      this.classrooms.pagination.page += 1;
      this.classrooms.isLoadMore = true;
      this.fetchClassActive();
    },

    /**
     * To handle filter landing visitor, whether filter by monthly, weekly or daily
     * 
     * @param {Object} filter - Object that consist of properti filer landing visitor
     * @param {String} filter.label - name of filter like Monthly, Weekly or Daily
     * @param {Number} filter.value - kind of filter, Monthly is 1, Weekly is 2 and Daily is 3
     */
    filterLoginVisitor(filter) {
      const currently = new Date(Date.now());
      const date = new Date()
      const today = toDateShort(new Date(date))
      const firstDateThisMonth = toDateShort(new Date(date.getFullYear(), date.getMonth(), 1))
      const lastDateThisMonth = toDateShort(new Date(date.getFullYear(), date.getMonth() + 1, 0))
      const weekBeforeToday = toDateShort(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))

      this.landingVisitor.selectedFilter = filter;

      if (filter?.value == 1) {
          this.landingVisitor.params = {
              kind: 1,
              dateFrom: `${currently.getFullYear()}-01-01`,
              dateTo: `${currently.getFullYear()}-12-31`,
          }
      }
      if (filter?.value == 2) {
          this.landingVisitor.params = {
              kind: 1,
              dateFrom: firstDateThisMonth,
              dateTo: lastDateThisMonth
          }
      }
      if (filter?.value == 3) {
          this.landingVisitor.params = {
              kind: 1,
              dateFrom: weekBeforeToday,
              dateTo: today
          }
      } 

      this.fetchLandingVisitor();
    },
  }
}