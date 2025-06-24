import servicesClients from "./servicesClients"

const SAMPLE_FUNEL = {
    data: {
        labels: [ 
            ['Participants', 'Registered'], 
            'Submitted', 
            'Non-Zero', 
            ['Overall ≥ 70%', 'perfomance'], 
        ],
        datasets: [ 
            { 
                borderColor: '#5e72e4',
                backgroundColor: 'rgb(94, 114, 228, .5)',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: true,
                tension: 0.1
            } 
        ],
    },
    options: {
        responsive: true,
        legend: {
            display: false,
        },
        scales: {
            x: {
                ticks: {
                    color: 'blue',
                }
            }
        }
    },
    height: 400,
    isBusy: false
}

const SAMPLE_TEST = {
    fields: [
        {   
            key: "testName", 
            label: 'Test Name',
            thStyle: 'width: 70%'
        },
        {   
            key: "invited", 
            label: 'Invited',
            thStyle: 'width: 10%'
        },
        {   
            key: "notSubmitted", 
            label: 'Not Submitted',
            thStyle: 'width: 10%'
        },
        {   
            key: "submitted", 
            label: 'Submitted',
            thStyle: 'width: 10%'
        },
    ],
    items: [
        { 
            testName: 'Test Engineer', 
            testDetail: {
                duration: 90,
                questionsCount: 15,
                status: 'On going',
                startDate: '6 Nov 2022, 09:00',
                endDate: '1 Feb 9999, 00:00',
            },
            invited: 101, 
            notSubmitted: 36, 
            submitted: 65
        },
        { 
            testName: 'Backend Engineer', 
            testDetail: {
                duration: 150,
                questionsCount: 3,
                status: 'On going',
                startDate: '5 Nov 2022, 09:00',
                endDate: '1 Feb 9999, 00:00',
            },
            invited: 56, 
            notSubmitted: 30, 
            submitted: 26
        },
    ],
    isBusy: false
}

const SAMPLE_PARTICIPANTS = {
    fields: [
        {   
            key: "index", 
            label: 'No',
            thStyle: 'width: 5%'
        },
        {   
            key: "name", 
            label: 'Name',
            thStyle: 'width: 45%'
        },
        {   
            key: "score", 
            label: 'Overal Score',
            thStyle: 'width: 5%'
        },
        {   
            key: "testName", 
            label: 'Test name',
            thStyle: 'width: 45%'
        },
    ],
    items: [
        { name: 'Participant 1', score: '14', testName: 'Test Engineer'},
        { name: 'Participant 2', score: '14', testName: 'Test Engineer'},
        { name: 'Participant 3', score: '12', testName: 'Test Engineer'},
        { name: 'Participant 4', score: '11', testName: 'Test Engineer'},
        { name: 'Participant 5', score: '11', testName: 'Test Engineer'},
    ],
    isBusy: false
}

const SAMPLE_SUBMISSION = {
    fields: [
        {   
            key: "index", 
            label: 'No',
            thStyle: 'width: 10%'
        },
        {   
            key: "name", 
            label: 'Name',
            thStyle: 'width: 30%'
        },
        {   
            key: "submissionDate", 
            label: 'Submission Date',
            thStyle: 'width: 30%'
        },
        {   
            key: "testName", 
            label: 'Test name',
            thStyle: 'width: 30%'
        },
    ],
    items: [
        { name: 'Participant 1', submissionDate: '30 Nov 2022, 10:00', testName: 'Test Engineer'},
        { name: 'Participant 2', submissionDate: '30 Nov 2022, 10:00', testName: 'Test Engineer'},
        { name: 'Participant 3', submissionDate: '30 Nov 2022, 10:00', testName: 'Test Engineer'},
        { name: 'Participant 4', submissionDate: '30 Nov 2022, 10:00', testName: 'Test Engineer'},
        { name: 'Participant 5', submissionDate: '30 Nov 2022, 10:00', testName: 'Test Engineer'},
    ],
    isBusy: false
}

const SAMPLE_SUBMISSION_RATE = {
    data: {
        labels: [ 
            'Taken', 
            'Not Taken', 
        ],
        datasets: [ 
            { 
                backgroundColor: '#5e72e4',
                data: [ 150, 0 ] 
            } 
        ],
    },
    options: {
        responsive: true,
        legend: {
            display: true,
            position: 'right'
        },
    },
    isBusy: false
}

const SAMPLE_REGISTRAR = {
    data: {
        labels: [ 
            '23/11', 
            '24/11', 
            '25/11', 
            '26/11', 
            '27/11', 
            '28/11', 
            '29/11', 
            '30/11', 
        ],
        datasets: [ 
            { 
                backgroundColor: '#5e72e4',
                data: [ 4, 6, 4, 2, 1, 3, 0, 1 ] 
            } 
        ],
    },
    options: {
        responsive: true,
        legend: {
            display: false,
        },
    },
    isBusy: false
}

const SAMPLE_RESPONSE = {
    message: '',
    status: true
}

const BASE_URL = process.env.servicesApi

const apiGetStudentFunnel = (month, classroomId) => {
    
    const url = `v1/statistics/students/funnel`

    const _month = !!month ? `month=${month}` : ''
    const _classroomId = !!classroomId ? `&classroomId=${classroomId}` : ''

    const params = '?' + _month + _classroomId

    return servicesClients.get(BASE_URL + url + params)
}

const apiGetAssignmentRate = (month, classroomId) => {
    
    const url = `v1/statistics/assignment/rate`

    const _month = !!month ? `month=${month}` : ''
    const _classroomId = !!classroomId ? `&classroomId=${classroomId}` : ''

    const params = '?' + _month + _classroomId

    return servicesClients.get(BASE_URL + url + params)
}

const apiGetAssignmentMonitor = (start, end, classroomId) => {
    
    const url = `v1/statistics/assignment/monitor`

    const _start = !!start ? `start=${start}` : ''
    const _end = !!end ? `&end=${end}` : ''
    const _classroomId = !!classroomId ? `&classroomId=${classroomId}` : ''

    const params = '?' + _start + _end + _classroomId

    return servicesClients.get(BASE_URL + url + params)
}

const apiGetWeeklyStudent = (classroomId) => {

    const url = `v1/statistics/student/top/weekly`
    
    const _classroomId = !!classroomId ? `&classroomId=${classroomId}` : ''

    const params = '?' + _classroomId

    return servicesClients.get(BASE_URL + url + params)
}

const apiGetActiveClass = () => servicesClients.get(BASE_URL + `v1/statistics/class/active/latest`)

const apiGetLatestAssignment = () => servicesClients.get(BASE_URL + `v1/statistics/assignments/latest`)

const apiGetDailyLogin = () => servicesClients.get(BASE_URL + `v1/statistics/login/daily`)

const apiGetVisitor = (kind, fromDate, toDate) => servicesClients.get(BASE_URL + `v1/statistics/visitors?kind=${kind}&from=${fromDate}&to=${toDate}`)

const apiGetVisitedClass = (fromDate, toDate) => servicesClients.get(BASE_URL + `v1/statistics/class/visitors?from=${fromDate}&to=${toDate}`)

const apiGetProgramParticipants = () => servicesClients.get(BASE_URL + '/v1/statistics/program/participants')

const apiGetAttendanceStatistics = (id, type) => servicesClients.get(BASE_URL + `v1/statistics/attendances?classId=${id}&type=${type}`)

export {
    apiGetActiveClass,
    apiGetAssignmentRate,
    apiGetAssignmentMonitor,
    apiGetDailyLogin,
    apiGetLatestAssignment,
    apiGetStudentFunnel,
    apiGetWeeklyStudent,
    apiGetVisitor,
    apiGetVisitedClass,
    apiGetProgramParticipants,
    apiGetAttendanceStatistics,
    SAMPLE_FUNEL,
    SAMPLE_PARTICIPANTS,
    SAMPLE_REGISTRAR,
    SAMPLE_RESPONSE,
    SAMPLE_SUBMISSION,
    SAMPLE_SUBMISSION_RATE,
    SAMPLE_TEST,
}