import {
  apiApprovePayout,
  apiGetBalance,
  apiGetBanks,
  apiGetClassPayment,
  apiGetPayouts,
  apiPostClassRepay,
  apiRejectPayout,
  apiRequestPayout
} from "@/api/payment.api";

export default {
  namespaced: true,
  state: {
    classPaymentInvoice: null,
    banks: [],
    payouts: null,
    message: "",
    status: false,
    balance: null,
    pagination: {
      page: 1,
      perPage: 10,
      totalItems: 0,
      totalPages: 0,
    },
  },

  mutations: {
    SET_RESPONSE(state, { message, status }) {
      state.message = message;
      state.status = status;
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = pagination
  },
    SET_EVENTS(state, { events }) {
      state.events = events;
    },
    SET_CLASS_PAYMENT_INVOICE(state, events) {
      state.classPaymentInvoice = events;
    },
    SET_PAYOUTS(state, events) {
      state.payouts = events;
    },
    SET_BALANCE(state, balance) {
      state.balance = balance;
    },
    SET_BANKS(state, banks) {
      state.banks = banks;
    },
  },

  actions: {
    async fetchClassPaymentInvoice({ commit }, slug) {
      try {
        const response = await apiGetClassPayment(slug);

        const resPayload = {
          message: response.message,
          status: response.status,
        };

        commit("SET_RESPONSE", resPayload);

        commit("SET_CLASS_PAYMENT_INVOICE", response.data.data);
      } catch (error) {
        console.log("Failed get class payment invoice: ", error);
      }
    },

    async postClassRepay({ commit }, slug) {
      try {
        const response = await apiPostClassRepay(slug);

        const resPayload = {
          message: response.message,
          status: response.status,
        };

        commit("SET_RESPONSE", resPayload);

        commit("SET_CLASS_PAYMENT_INVOICE", response.data.data);
      } catch (error) {
        console.log("Failed post repay class: ", error);
      }
    },

    async getPayouts({ commit }, { page, perPage, status, banks, search }) {
      try {
        const response = await apiGetPayouts(page, perPage, status, banks, search);

        const data = response?.data?.data

        const resPayload = {
          message: response.message,
          status: response.status,
        };

        if (page) {
          const pagination = {
            page: data?.page,
            perPage: data?.perPage,
            totalItems: data?.totalItems,
            totalPages: data?.totalPages,
          }

          commit("SET_PAGINATION", pagination)
        }

        commit("SET_RESPONSE", resPayload);

        commit("SET_PAYOUTS", data?.items);
      } catch (error) {
        console.log("Failed get payouts: ", error);
      }
    },

    async getBalance({ commit }) {
      try {
        const response = await apiGetBalance();

        const resPayload = {
          message: response.message,
          status: response.status,
        };

        commit("SET_RESPONSE", resPayload);

        commit("SET_BALANCE", response.data.data);
      } catch (error) {
        console.log("Failed get payouts: ", error);
      }
    },

    async postApprovePayout({ commit }, payload) {
      try {
        const response = await apiApprovePayout(payload);

        const resPayload = {
          message: response.message,
          status: response.status,
        };

        commit("SET_RESPONSE", resPayload);
      } catch (error) {
        console.log("Failed post approve payout: ", error);
      }
    }, 

    async postRejectPayout({ commit }, payload) {
      try {
        const response = await apiRejectPayout(payload);

        const resPayload = {
          message: response.message,
          status: response.status,
        };

        commit("SET_RESPONSE", resPayload);
      } catch (error) {
        console.log("Failed post reject payout: ", error);
      }
    }, 
    
    async createPayoutRequest({ commit }, payload) {
      try {
        const response = await apiRequestPayout(payload);
  
        const resPayload = {
          message: response.data.message,
          status: response.data.status,
        };
  
        commit("SET_RESPONSE", resPayload);

        return response.data
      } catch (error) {
        console.log("Failed to request payout: ", error);
      }
    },

    async fetchBanks({ commit }) {
      try {
        const response = await apiGetBanks();

        const resPayload = {
          message: response.message,
          status: response.status,
        };

        commit("SET_RESPONSE", resPayload);

        commit("SET_BANKS", response.data.data);
      } catch (error) {
        console.log("Failed to fetch banks: ", error);
      }
    },
  },
};
