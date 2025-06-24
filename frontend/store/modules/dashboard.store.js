import { 
    apiGetActiveClass,
    apiGetAssignmentRate,
    apiGetAssignmentMonitor,
    apiGetLatestAssignment,
    apiGetStudentFunnel,
    apiGetWeeklyStudent,
    SAMPLE_RESPONSE,
    apiGetDailyLogin,
    apiGetVisitor,
    apiGetVisitedClass,
    apiGetProgramParticipants,
    apiGetAttendanceStatistics,
} from "@/api/dashboard.api"

import { 
    CHART_PROPS_DAILY_LOGIN,
    CHART_PROPS_FUNNEL,
    CHART_PROPS_MONITOR,
    CHART_PROPS_PROGRAM_PARTICIPANTS,
    CHART_PROPS_SUBMISSION_RATE,
    CHART_PROPS_VISITED_CLASS,
    CHART_PROPS_VISITOR,
    TABLE_COLUMN_ACTIVE_CLASS,
    TABLE_COLUMN_PARTICIPANTS,
    TABLE_COLUMN_SUBMISSIONS,
    CHART_PROPS_ATTENDANCE_PERCENTAGE,
    CHART_PROPS_ATTEND,
    CHART_PROPS_ATTENDANCE_MEET,
} from "@/commons/constants/dashboard"
import { apiGetClassAttendanceRecap, apiGetMeetAttendanceRecap, apiGetPostAttendanceRecap } from "~/api/services.api"
import { apiClassroomStudentsJoin } from "~/api/services.api"
import { apiGetStudents } from "~/api/v2/classroom.api"

import { toDateShort } from "~/commons/utils/."

export default {
    namespaced: true,
    state: () => {
        return {
            activeClass: {},
            participants: {},
            latestSubmission: {},
            submissionRate: {},
            registrarChart: {},
            participantFunnel: {},
            dailyLogin: {status: false, message: "", data: null, options: null, isBusy: false},
            landingVisitor: {status: false, message: "", data: null, options: null, isBusy: false},
            classVisitor: {status: false, message: "", data: null, options: null, isBusy: false},
            programParticipants: {status: false, message: "", data: null, options: null, isBusy: false},
            attendanceClass: {},
            attendanceMeet: {},
            attendancePost: {},
            attendChart: {},
            message: '',
            status: false,
        }
    },
    mutations: {
        SET_RESPONSE: (state, { message, status }) => {
            state.message = message
            state.status = status
        },
        SET_ACTIVE_CLASS: (state, activeClass ) => {
            state.activeClass = activeClass 
        },
        SET_PARTICIPANTS: (state, participants) => {
            state.participants = participants
        },
        SET_PARTICIPANT_FUNNEL: (state, funnel) => {
            state.participantFunnel = funnel
        },
        SET_LATEST_SUBMISSION: (state, latestSubmission ) => {
            state.latestSubmission = latestSubmission
        },
        SET_SUBMISSION_RATE: (state, submissionRate ) => {
            state.submissionRate = submissionRate
        },
        SET_REGISTRAR: (state, registrar) => {
            state.registrarChart = registrar
        },
        SET_DAILY_LOGIN: (state, dailyLogin) => {
            state.dailyLogin = dailyLogin
        },
        SET_LANDING_VISITOR: (state, landingVisitor) => {
            state.landingVisitor = landingVisitor
        },
        SET_CLASS_VISITOR: (state, classVisitor) => {
            state.classVisitor = classVisitor
        },
        SET_PROGRAM_PARTICIPANTS: (state, programParticipants) => {
            state.programParticipants = programParticipants
        },
        SET_ATTENDANCE_CLASS: (state, attendanceClass) => {
            state.attendanceClass = attendanceClass
        },
        SET_ATTENDANCE_MEET: (state, attendanceMeet) => {
            state.attendanceMeet = attendanceMeet
        },
        SET_ATTENDANCE_POST: (state, attendancePost) => {
            state.attendancePost = attendancePost
        },
        SET_ATTENDANCE_CHART: (state, attendChart) => {
            state.attendChart = attendChart
        },
        CLEAR_PARTICIPANTS: (state) => {
            state.participants = {}
        }
        
    },
    actions: {
        fetchActiveClass: async ({ commit }) => {
            try {
                const response = await apiGetActiveClass()

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }
                commit('SET_RESPONSE', resPayload)
                
                const payload = {
                    fields: TABLE_COLUMN_ACTIVE_CLASS,
                    items: response?.data?.data,
                    isBusy: false
                }
                commit('SET_ACTIVE_CLASS', payload)
            } catch (error) {
                commit('SET_RESPONSE', 
                    SAMPLE_RESPONSE['status'] = false
                )
            }
        },

        fetchParticipants: async ({ commit }, classroomId) => {

            try {
                const response = await apiGetStudents(classroomId,null, null, true)

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                const payload = {
                    fields: TABLE_COLUMN_PARTICIPANTS,
                    items: response?.data?.data.items,
                    isBusy: false
                }

                commit('SET_RESPONSE', resPayload)
                commit('SET_PARTICIPANTS', payload)
            } catch (error) {
                commit('SET_RESPONSE', SAMPLE_RESPONSE['status'] = false)
            }
        },

        fetchParticipantFunnel: async ({ commit }, classroomId) => {
            try {
                const response = await apiGetStudentFunnel(1, classroomId)
                const tempData = response?.data?.data;
                const datasets = CHART_PROPS_FUNNEL?.data?.datasets;
                const labels = CHART_PROPS_FUNNEL?.data?.labels;

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }
                commit('SET_RESPONSE', resPayload)

                if (!!tempData) {
                    datasets[0].data = Object.values(tempData) 
                }

                const payload = {
                    data:{
                        labels: labels,
                        datasets: datasets
                    },
                    ...CHART_PROPS_FUNNEL
                }
                commit('SET_PARTICIPANT_FUNNEL', payload)
            } catch (error) {
                commit('SET_RESPONSE', SAMPLE_RESPONSE['status'] = false)
            }
        },

        fetchLatestSubmission: async ({ commit }) => {
            try {
                const response = await apiGetLatestAssignment()

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                const payload = {
                    fields: TABLE_COLUMN_SUBMISSIONS,
                    items: response?.data?.data,
                    isBusy: false
                }

                commit('SET_RESPONSE', resPayload)
                commit('SET_LATEST_SUBMISSION', payload)
            } catch (error) {
                commit('SET_RESPONSE', SAMPLE_RESPONSE['status'] = false)
            }
        },

        fetchSubmissionRate: async ({ commit }, classroomId) => {
            try {
                const response = await apiGetAssignmentRate(1, classroomId)
                const tempData = response?.data?.data
                const datasets = CHART_PROPS_SUBMISSION_RATE?.data?.datasets

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }
                commit('SET_RESPONSE', resPayload)

                if (!!tempData) {
                    datasets[0].data = Object.values(tempData) 
                }

                const payload = {
                    data:{
                        datasets: datasets
                    },
                    ...CHART_PROPS_SUBMISSION_RATE
                }

                commit('SET_SUBMISSION_RATE', payload)
            } catch (error) {
                commit('SET_RESPONSE', SAMPLE_RESPONSE['status'] = false)
            }
        },

        fetchRegistrarChart: async ({ commit }, classroomId) => {
            try {
                const today = toDateShort(new Date())
                const weekBeforeToday = toDateShort(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                const response = await apiGetAssignmentMonitor(weekBeforeToday, today, classroomId)
                const tempData = response?.data?.data;
                let datasets = CHART_PROPS_MONITOR?.data?.datasets;
                let labels = CHART_PROPS_MONITOR?.data?.labels;
                const extractLabel = ({date}) => date;
                const extractSubmitted = ({submitted}) => submitted;

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }
                commit('SET_RESPONSE', resPayload)
                
                if (!!tempData) {
                    labels = tempData.map(extractLabel)
                    datasets[0].data = tempData.map(extractSubmitted)
                }

                const payload = {
                    data:{
                        labels: labels,
                        datasets: datasets
                    },
                    options: CHART_PROPS_MONITOR?.options,
                    isBusy: CHART_PROPS_MONITOR?.isBusy
                }

                commit('SET_REGISTRAR', payload)
            } catch (error) {
                commit('SET_RESPONSE', SAMPLE_RESPONSE['status'] = false)
            }
        },

        fetchDailyLogin: async ({commit}, params) => {
            try {                
                const response = await apiGetVisitor(params?.kind, params?.dateFrom, params?.dateTo)
                const tempData = response?.data?.data;
                let datasets = CHART_PROPS_DAILY_LOGIN?.data?.datasets;
                let labels = CHART_PROPS_DAILY_LOGIN?.data?.labels;
                const extractLabel = ({date}) => date;
                const extractSubmitted = ({uniqueVisitors}) => uniqueVisitors;
                
                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }
                
                if (!!tempData) {
                    labels = tempData.map(extractLabel)
                    datasets[0].data = tempData.map(extractSubmitted)
                }

                const payload = {
                    data:{
                        labels: labels,
                        datasets: datasets
                    },
                    options: CHART_PROPS_DAILY_LOGIN?.options,
                    isBusy: CHART_PROPS_DAILY_LOGIN?.isBusy,
                    ...resPayload,
                }

                commit('SET_DAILY_LOGIN', payload)
            } catch (error) {
                commit('SET_RESPONSE', SAMPLE_RESPONSE['status'] = false)
            }
        },

        fetchVisitor: async ({commit}, params) => {
            try {                
                const response = await apiGetVisitor(params?.kind, params?.dateFrom, params?.dateTo)
                const tempData = response?.data?.data;
                let datasets = CHART_PROPS_VISITOR?.data?.datasets;
                let labels = CHART_PROPS_VISITOR?.data?.labels;
                const extractLabel = ({date}) => date;
                const extractVisitor = ({visitors}) => visitors;
                
                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }
                
                if (!!tempData) {
                    labels = tempData.map(extractLabel)
                    datasets[0].data = tempData.map(extractVisitor)
                }

                const payload = {
                    data:{
                        labels: labels,
                        datasets: datasets
                    },
                    options: CHART_PROPS_VISITOR?.data?.options,
                    isBusy: CHART_PROPS_VISITOR?.data?.isBusy,
                    ...resPayload,
                }

                commit('SET_LANDING_VISITOR', payload)
            } catch (error) {
                commit('SET_RESPONSE', SAMPLE_RESPONSE['status'] = false)
            }
        },
        
        fetchClassVisitor: async ({commit}, params) => {
            try {                
                const response = await apiGetVisitedClass(params?.dateFrom, params?.dateTo)
                const tempData = response?.data?.data;
                let datasets = CHART_PROPS_VISITED_CLASS?.data?.datasets;
                let labels = CHART_PROPS_VISITED_CLASS?.data?.labels;
                const extractLabel = ({className}) => className;
                const extractVisitor = ({uniqueVisitors}) => uniqueVisitors;
                const extractRegistered = ({registered}) => registered;
                
                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }
                
                if (!!tempData) {
                    labels = tempData.map(extractLabel)
                    datasets[0].data = tempData.map(extractVisitor)
                    datasets[0].label = 'Visited'
                    datasets[1].data = tempData.map(extractRegistered)
                    datasets[1].label = 'Registered'
                } else {
                    datasets[0].label = 'Visited'
                    datasets[1].label = 'Registered'
                }

                const payload = {
                    data:{
                        labels: labels,
                        datasets: datasets
                    },
                    options: CHART_PROPS_VISITED_CLASS?.data?.options,
                    isBusy: CHART_PROPS_VISITED_CLASS?.data?.isBusy,
                    ...resPayload,
                }

                commit('SET_CLASS_VISITOR', payload)
            } catch (error) {
                commit('SET_RESPONSE', SAMPLE_RESPONSE['status'] = false)
            }
        },
        
        fetchProgramParticipants: async ({commit}) => {
            try {                
                const response = await apiGetProgramParticipants()
                const tempData = response?.data?.data?.participants;

                let datasets = CHART_PROPS_PROGRAM_PARTICIPANTS?.data?.datasets;
                let labels = CHART_PROPS_PROGRAM_PARTICIPANTS?.data?.labels;
                let counterParticipant = response?.data?.data?.counter;

                const extractLabel = ({name}) => name;
                const extractEnrolled = ({enrolled}) => enrolled;
                const extractActive = ({active}) => active;
                const extractTotal = ({totalStudent}) => totalStudent;
                
                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }
                
                if (!!tempData) {
                    let totalActive = 0;
                    let totalEnrolled = 0;
                    let totalRegistered = 0;

                    labels = tempData.map(extractLabel)

                    datasets[0].data = tempData.map(extractActive)
                    datasets[0].label = 'Active'
                    datasets[1].data = tempData.map(extractEnrolled)
                    datasets[1].label = 'Enrolled'
                    datasets[2].data = tempData.map(extractTotal)
                    datasets[2].label = 'Registered'

                    datasets.map((item, _index) => {
                        if(item.label === "Active") {
                            totalActive = item.data.reduce((a, b) => a + b)
                            item.label = `Active`;
                        }
                        if(item.label === "Enrolled") {
                            totalEnrolled = item.data.reduce((a, b) => a + b)
                            item.label = `Enrolled`;
                        }
                        if(item.label === "Registered") {
                            totalRegistered = item.data.reduce((a, b) => a + b)
                            item.label = `Registered`;
                        }
                    })

                } else {
                    datasets[0].label = 'Enrolled'
                    datasets[1].label = 'Active'
                    datasets[2].label = 'Registered'
                }


                const payload = {
                    data:{
                        labels: labels,
                        datasets: datasets,
                        counter: counterParticipant
                    },
                    options: CHART_PROPS_PROGRAM_PARTICIPANTS?.data?.options,
                    isBusy: CHART_PROPS_PROGRAM_PARTICIPANTS?.data?.isBusy,
                    ...resPayload,
                }

                commit('SET_PROGRAM_PARTICIPANTS', payload)
            } catch (error) {
                console.log({error});

                commit('SET_RESPONSE', SAMPLE_RESPONSE['status'] = false)
            }
        },
        

        // fetchProgramParticipants: async ({commit}) => {
        //     try {                
        //         const response = await apiGetProgramParticipants()
        //         const tempData = response?.data?.data;
        //         let datasets = CHART_PROPS_PROGRAM_PARTICIPANTS?.data?.datasets;
        //         let labels = CHART_PROPS_PROGRAM_PARTICIPANTS?.data?.labels;
        //         let chartOptions = CHART_PROPS_PROGRAM_PARTICIPANTS?.data?.options;
        //         const { participants, counter } = tempData;
        //         const extractLabel = ({name}) => name;
        //         const extractVisitor = ({totalStudent}) => totalStudent;
        //         const resPayload = {
        //             message: response?.data?.message,
        //             status: response?.data?.status
        //         }

        //         commit('SET_RESPONSE', resPayload)

        //         if (!!tempData) {
        //             let greatestValue = [];
        //             let totalActive = 0;
        //             let totalEnrolled = 0;
        //             let totalRegistered = 0;
                    
        //             participants.map((item, index) => {
        //                 greatestValue.push(item.active, item.enrolled, item.not_enrolled);
        //             })

        //             datasets.map((item, index) => {
        //                 participants.map((value, idx) => {
        //                     if(datasets[index].label === "Active"){
        //                         totalActive += value.active;
        //                         datasets[index].data.push(value.active);
        //                     }
        //                     if(datasets[index].label === "Enrolled"){
        //                         totalEnrolled += value.enrolled;
        //                         datasets[index].data.push(value.enrolled);
        //                     }
        //                     if(datasets[index].label === "Registered") {
        //                         totalRegistered += value.totalStudent;
        //                         datasets[index].data.push(value.totalStudent);
        //                     }
        //                 })
        //             })

        //             datasets.map((item, index) => {
        //                 if(datasets[index].label === "Active") datasets[index].label = `Active (${totalActive})`;
        //                 if(datasets[index].label === "Enrolled") datasets[index].label = `Enrolled (${totalEnrolled})`;
        //                 if(datasets[index].label === "Registered") datasets[index].label = `Registered (${totalRegistered})`;
        //             })

        //             greatestValue.sort((a, b) => a - b);
        //             greatestValue = Math.ceil(greatestValue[greatestValue.length - 1] / 5) * 5;
        //             chartOptions.scale.ticks.stepSize = greatestValue / 5;

        //             labels = participants.map((item) => {
        //                 return `${item.name} (${item.totalStudent})`;
        //             });
        //             // datasets[0].data = tempData.map(extractVisitor)
        //         }
        //         const payload = {
        //             data:{
        //                 labels: labels,
        //                 datasets: datasets
        //             },
        //             counter: counter,
        //             options: chartOptions,
        //             isBusy: CHART_PROPS_PROGRAM_PARTICIPANTS?.data?.isBusy
        //         }
        //         commit('SET_PROGRAM_PARTICIPANTS', payload)
        //     } catch (error) {
        //         commit('SET_RESPONSE', SAMPLE_RESPONSE['status'] = false)
        //     }
        // },

        fetchAttendanceClass: async ({ commit }, params) => {
            try {
                const response = await apiGetClassAttendanceRecap(params?.id, null, null, params?.startDate, params?.endDate, null, null)
                const tempData = response?.data?.data
                let datasets = CHART_PROPS_ATTENDANCE_PERCENTAGE?.data?.datasets
                let labels = CHART_PROPS_ATTENDANCE_PERCENTAGE?.data?.labels

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                commit('SET_RESPONSE', resPayload)

                if (!!tempData) {
                    datasets[0].data[0] = tempData?.counter?.absent
                    datasets[0].data[1] = tempData?.counter?.present
                }

                const payload = {
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: CHART_PROPS_ATTENDANCE_PERCENTAGE?.options,
                    isBusy: CHART_PROPS_ATTENDANCE_PERCENTAGE?.isBusy
                }

                const percentage = Math.floor((tempData?.counter?.present / (tempData?.counter?.present + tempData?.counter?.absent)) * 100)

                payload.options.plugins.doughnutlabel.labels[0].text = '0%'
                if (tempData?.counter?.present > 0) {
                    payload.options.plugins.doughnutlabel.labels[0].text = `${percentage}%`
                }

                commit('SET_ATTENDANCE_CLASS', payload)

            } catch (error) {
                commit('SET_RESPONSE', SAMPLE_RESPONSE['status'] = false)
            }
        },

        fetchAttendanceMeet: async ({ commit }, params) => {
            try {
                const response = await apiGetMeetAttendanceRecap(params?.id, null, null, null, null)
                const tempData = response?.data?.data
                let datasets = CHART_PROPS_ATTENDANCE_MEET?.data?.datasets
                let labels = CHART_PROPS_ATTENDANCE_MEET?.data?.labels

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                commit('SET_RESPONSE', resPayload)

                if (!!tempData) {
                    datasets[0].data[0] = tempData?.counter?.absent
                    datasets[0].data[1] = tempData?.counter?.present
                }

                const payload = {
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: CHART_PROPS_ATTENDANCE_MEET?.options,
                    isBusy: CHART_PROPS_ATTENDANCE_MEET?.isBusy
                }

                const percentage = Math.floor((tempData?.counter?.present / (tempData?.counter?.present + tempData?.counter?.absent)) * 100)

                payload.options.plugins.doughnutlabel.labels[0].text = '0%'
                if (tempData?.counter?.present > 0) {
                    payload.options.plugins.doughnutlabel.labels[0].text = `${percentage}%`
                }

                commit('SET_ATTENDANCE_MEET', payload)

            } catch (error) {
                commit('SET_RESPONSE', SAMPLE_RESPONSE['status'] = false)
            }
        },

        fetchAttendancePost: async ({ commit }, params) => {
            try {
                const response = await apiGetPostAttendanceRecap(params?.id, null, null, null, null)
                const tempData = response?.data?.data
                let datasets = CHART_PROPS_ATTENDANCE_MEET?.data?.datasets
                let labels = CHART_PROPS_ATTENDANCE_MEET?.data?.labels

                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                commit('SET_RESPONSE', resPayload)

                if (!!tempData) {
                    datasets[0].data[0] = tempData?.counter?.absent
                    datasets[0].data[1] = tempData?.counter?.present
                }

                const payload = {
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: CHART_PROPS_ATTENDANCE_MEET?.options,
                    isBusy: CHART_PROPS_ATTENDANCE_MEET?.isBusy
                }

                const percentage = Math.floor((tempData?.counter?.present / (tempData?.counter?.present + tempData?.counter?.absent)) * 100)

                payload.options.plugins.doughnutlabel.labels[0].text = '0%'
                if (tempData?.counter?.present > 0) {
                    payload.options.plugins.doughnutlabel.labels[0].text = `${percentage}%`
                }

                commit('SET_ATTENDANCE_POST', payload)

            } catch (error) {
                commit('SET_RESPONSE', SAMPLE_RESPONSE['status'] = false)
            }
        },

        fetchAttendanceChart: async ({ commit }, params) => {
            try {                
                const response = await apiGetAttendanceStatistics(params?.id, params?.type)

                const tempData = response?.data?.data
                let datasets = CHART_PROPS_ATTEND?.data?.datasets
                let labels = CHART_PROPS_ATTEND?.data?.labels
                const extractLabel = ({ key }) => key
                const extractValue = ({ value }) => value
                
                const resPayload = {
                    message: response?.data?.message,
                    status: response?.data?.status
                }

                commit('SET_RESPONSE', resPayload)
                
                if (!!tempData) {
                    labels = tempData.map(extractLabel)
                    datasets[0].data = tempData.map(extractValue)
                }

                const payload = {
                    data:{
                        labels: labels,
                        datasets: datasets
                    },
                    options: CHART_PROPS_ATTEND?.data?.options,
                    isBusy: CHART_PROPS_ATTEND?.data?.isBusy
                }

                commit('SET_ATTENDANCE_CHART', payload)
            } catch (error) {
                commit('SET_RESPONSE', SAMPLE_RESPONSE['status'] = false)
            }
        },

        clearParticipants({ commit }) {
            commit("CLEAR_PARTICIPANTS")
        }
    }
}