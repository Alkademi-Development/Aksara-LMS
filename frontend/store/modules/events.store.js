import { 
    apiGetEvents,
    apiGetEventDetail,
    apiGetEventsActive,
    apiJoinEvent,
    apiCreateEvent,
    apiEditEvent,
    getIncomingEvents
 } from '@/api/events.api';

export default {
    namespaced: true,
    state: {
        incomingEvents: [],
        events: [],
        message: '',
        status: false,
    },

    mutations: {
        SET_RESPONSE(state, {message, status}){
            state.message = message;
            state.status = status;
        },
        SET_PAGINATION(state, {pagination}){
            state.pagination = pagination
        },
        SET_EVENTS(state, {events}){
            state.events = events
        },
        SET_INCOMING_EVENTS(state, events){
            state.incomingEvents = events
        }
    },

    actions: {
        async fetchIncomingEvents({commit}, page) {
            try {
                const response = await getIncomingEvents(page)

                const resPayload = {
                    message: response.message,
                    status: response.status
                }

                commit('SET_RESPONSE', resPayload);

                commit('SET_INCOMING_EVENTS', response.data.data);
        
            } catch (error) {
                console.log('Failed get events active: ', error)
            }
        },
        async getEvents({commit}, page) {
            try {
                const response = await apiGetEvents(page)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    events: response.data.data
                }

                commit('SET_EVENTS', payload)

                var data = response.data
                const pagePayload = {
                    pagination: {
                        currentPage: data.page.current_page,
                        perPage: data.data_count.per_page,
                        totalRows: data.data_count.total_data,
                    }
                }

                commit('SET_PAGINATION', pagePayload)

            } catch (error) {
                console.log('Failed get events: ', error)
            }
        },
        async getEventsActive({commit}, page) {
            try {
                const response = await apiGetEventsActive(page)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    events: response.data.data
                }

                commit('SET_EVENTS', payload)

                var data = response.data
                const pagePayload = {
                    pagination: {
                        currentPage: data.page.current_page,
                        perPage: data.data_count.per_page,
                        totalRows: data.data_count.total_data,
                    }
                }

                commit('SET_PAGINATION', pagePayload)

                commit('SET_RESPONSE', resPayload);

                commit('SET_EVENTS', response.data.data);
            } catch (error) {
                console.error("Failed to get Events", error);
            }
        },
        async getEventDetail({commit}, id) {
            try {
                const response = await apiGetEventDetail(id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

                const payload = {
                    events: response.data.data
                }

                commit('SET_EVENTS', payload)

            } catch (error) {
                console.log('Failed get events detail: ', error)
            }
        },
        async joinEvent({commit}, event_id) {
            try {
                const response = await apiJoinEvent(event_id)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                console.log('Failed create event: ', error)
            }
        },
        async createEvent({commit}, {params}) {
            try {
                const response = await apiCreateEvent(params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                console.log('Failed create event: ', error)
            }
        },
        async editEvent({commit}, {id, params}) {
            try {
                const response = await apiEditEvent(id, params)

                const resPayload = {
                    message: response.data.message,
                    status: response.data.status
                }

                commit('SET_RESPONSE', resPayload)

            } catch (error) {
                console.log('Failed edit event: ', error)
            }
        },
    },
}