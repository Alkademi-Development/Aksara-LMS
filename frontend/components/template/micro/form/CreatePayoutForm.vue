<template>
  <b-form @submit.prevent="onClickSubmitPayout" @reset="onResetForm" class="row" name="create-transaction">
    <div v-if="!isLoaded" class="col-lg-12 card-wrapper">
      <b-card no-body>
        <div class="text-center card-body">
          <b-spinner label="Loading..."></b-spinner>
        </div>
      </b-card>
    </div>

    <div v-if="isLoaded" class="col-lg-12 card-wrapper">
      <b-card class="border" no-body>
        <b-card-header class="border-0 pb-0">
          <h5 class="mb-0 d-inline-block" style="font-size: 18px">Transaksi Baru</h5>
        </b-card-header>

        <div class="card-body">
          <b-alert v-model="onEvent.show" :variant="onEvent.variant" dismissible>
            {{ onEvent.message }}
          </b-alert>

          <b-row>
            <b-col v-for="(input, index) in field_forms" :key="index" cols="12">
              <b-form-group :label="input.label" :label-for="input.name" :description="input.description">
                <b-form-input v-if="input.type === 'text' || input.type === 'email' || input.type === 'number'"
                  v-model="input.value" :id="input.name" :type="input.type" :placeholder="input.placeholder"
                  :required="input.required" :min="input.min" />

                  <b-form-input
                    v-if="input.type === 'currency'"
                    id="amount"
                    type="text"
                    v-model="displayValue"
                    @input="onInput"
                    @blur="formatValue"
                  />

                <b-form-select v-if="input.type === 'select'" v-model="input.value" :id="input.name"
                  :options="input.options" :placeholder="input.placeholder" :required="input.required" />
              </b-form-group>
            </b-col>
          </b-row>
        </div>
      </b-card>
    </div>

    <div v-if="isLoaded" class="col-lg-12 card-wrapper">
      <div class="card border">
        <div class="card-body d-flex justify-content-between align-items-center">
          <span class="color-primary">Pastikan semua data sudah benar karena akan dilakukan proses validasi
            administrasi.</span>
          <div class="d-flex">
            <b-button type="reset" :disabled="isSubmit" variant="danger">Reset</b-button>
            <b-button type="submit" :disabled="isSubmit" variant="primary">Buat Payout</b-button>
          </div>
        </div>
      </div>
    </div>

    <b-modal id="modalPublish" v-model="showModalConfirmation" size="md" centered hide-header hide-footer body-class="p-0">
      <template v-if="confirmationModalStatus === 'loading'">
        <div class="modal-process centered ">
          <i class="loading-icon ri-loader-2-line"></i>
          <h3 class="modal-title mb-0">Memproses Transaksi</h3>
        </div>
      </template>

      <template v-else-if="confirmationModalStatus === 'success'">
        <div class="modal-process centered p-4">
          <i class="success-icon ri-check-line"></i>
          <h3 class="modal-title mb-0">Transaksi Berhasil</h3>
          <p class="text-center">Transaksi berhasil dibuat, lihat riwayat transaksi untuk mengetahui proses status transaksi.</p>
          <button class="btn btn-primary px-4 py-2" @click="onClickHistoryTransaction">Lihat Riwayat Transaksi</button>
        </div>
      </template>

      <template v-else-if="confirmationModalStatus === 'failed'">
        <div class="modal-process centered p-4">
          <i class="danger-icon ri-close-line"></i>
          <h3 class="modal-title mb-0">Transaksi Gagal</h3>
          <p class="text-center">Transaksi gagal dibuat, {{ onEvent.message }}.</p>
          <button class="btn btn-primary px-4 py-2" @click="showModalConfirmation = false" >Kembali</button>
        </div>
      </template>

      <ModalConfirmation
        v-else-if="confirmationModalStatus === 'confirm'"
        title="Pengajuan Transaksi Payout"
        description="Pastikan semua transaksi sudah sesuai. Transaksi payout ini akan diajukan ke Admin untuk proses pencairan oleh sistem."
        btnYesVariant="primary"
        btnNoVariant="outline-primary"
        btnYesTitle="Ya, lanjutkan"
        btnNoTitle="Pastikan kembali"
        :isLoading="false"
        @actionYes="onSubmitForm"
        @actionNo="showModalConfirmation = false"
        centered
      />
    </b-modal>
  </b-form>
</template>


<script>
import { mapActions, mapState } from 'vuex';
import fieldForm from '@/store/global/createPayout';
import ModalConfirmation from '../modal/ModalConfirmation.vue';

export default {
  layout: 'dashboard',
  components: {
    ModalConfirmation
  },
  data() {
    return {
      confirmationModalStatus: 'confirm',
      showModalConfirmation: false,
      
      isLoaded: true,
      isSubmit: false,
      onEvent: {
        message: '',
        show: false,
        variant: ''
      },
      field_forms: [],

      displayValue: '', // The value displayed in the input
      rawValue: null,   // The raw numerical value
    };
  },
  computed: {
    ...mapState({
      banks: (state) => state.Payment.banks
    })
  },
  methods: {
    ...mapActions({
      setActiveTab: 'Layouts/setActiveTab',
      allSettings: 'Sass/allSettings',
      fetchBanks: 'Payment/fetchBanks',
      createPayoutRequest: 'Payment/createPayoutRequest'
    }),

    onInput(event) {
      const input = event;

      // Strip out non-digit characters except for decimal points
      const numericValue = input.replace(/[^\d.]/g, '');

      // Limit to two decimal places
      const parts = numericValue.split('.');
      if (parts.length > 2) {
        parts.pop(); // Remove extra decimal parts
      }
      let formattedValue = parts.join('.');

      if (parts[1]) {
        formattedValue = `${parts[0]}.${parts[1].slice(0, 2)}`; // Limit to two decimal places
      }

      this.rawValue = parseFloat(formattedValue) || 0;
      this.displayValue = formattedValue;
    },
    formatValue() {
      // Format as currency when the input loses focus
      const options = {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      };
      this.displayValue = new Intl.NumberFormat('id-ID', options).format(this.rawValue);
    },

    onClickHistoryTransaction() {
      this.showModalConfirmation = false

      this.$router.push('/dashboard/finances')
    },

    onClickSuccessSubmit() {
      this.showModalConfirmation = false
      this.$router.replace(`/dashboard/finance`)
    },

    onClickSubmitPayout() {
      this.confirmationModalStatus = 'confirm'
      this.showModalConfirmation = true
    },  

    async onSubmitForm() {
      try {
        this.onEvent = {};
        this.confirmationModalStatus = 'loading';

        // Check for required fields
        const invalidFields = this.field_forms.filter(field => {
          if (field.required) {
            // Special validation for select type with a placeholder value
            if (field.type === "select" && (field.value === "" || field.value === 0)) {
              return true;
            }
            return !field.value;
          }
          return false;
        });

        if (invalidFields.length) {
          this.onEvent = {
            message: 'Please fill all required fields, including selecting a valid bank.',
            show: true,
            variant: 'danger'
          };
          this.confirmationModalStatus = 'failed';
          return;
        }

        // Initialize payload
        let payload = {
          beneficiary_name: '',
          beneficiary_account: '',
          beneficiary_bank: '',
          beneficiary_email: '',
          amount: 0
        };

        // Populate payload fields
        this.field_forms.forEach((item) => {
          if (item.name === 'amount') {
            console.log(this.rawValue);
            
            payload[item.name] = Number(this.rawValue) || 0;
          } else {
            payload[item.name] = item?.value ?? null;
          }
        });

        // Submit the request
        const response = await this.createPayoutRequest(payload);

        if (response.data?.status) {
          this.onEvent = {
            message: 'Berhasil membuat permintaan payout',
            show: true,
            variant: 'success'
          };
          this.confirmationModalStatus = 'success';

          this.onResetForm()
        } else {
          this.onEvent = {
            message: response?.message,
            show: true,
            variant: 'danger'
          };
          this.confirmationModalStatus = 'failed';
        }
      } catch (error) {
        alert(error);
      }
    },

    onResetForm() {
      // Reset all fields to initial state
      this.field_forms.forEach(field => (field.value = ''));
      this.displayValue = ''
      this.rawValue = null
      
    },
    async setBanks() {
      const bank_arr = await this.banks;

      if (bank_arr) {
        this.field_forms = this.field_forms.map(item => {
          if (item.name === 'beneficiary_bank') {
            return {
              ...item,
              options: [
                { value: 0, text: "Pilih bank tujuan Anda" },
                ...bank_arr.map(bank => ({
                  value: bank.channel_code,
                  text: bank.channel_name
                }))
              ]
            };
          }
          return item;
        });
      }
    }
  },
  async mounted() {
    this.isLoaded = false;
    this.field_forms = JSON.parse(JSON.stringify(fieldForm.inputPayout));
    
    await this.fetchBanks()
    await this.setBanks();
    this.isLoaded = true;
  },
  destroyed() {
    this.onResetForm()
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/utilities/_colors.scss';

.box-button ::v-deep {
  margin: 0;
  gap: 12px;
}

.modal-process {
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .loading-icon {
    font-size: 72px;
    color: $primary;
    animation: spin 3s linear infinite;
  }

  .success-icon {
    font-size: 72px;
    color: $success;
  }

  .danger-icon {
    font-size: 72px;
    color: $danger;
  }

  h3 {
    font-size: 24px;
  }

  p {
    font-size: 16px;
    font-weight: 500
  }
}
</style>