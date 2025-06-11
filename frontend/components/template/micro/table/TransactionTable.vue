<template>
  <div class="wrapper-table-statistic">
    <div class="wrapper-table-statistic--table">
      <b-table borderless :items="items" show-empty :fields="fields" responsive :busy="isLoading"
        class="rounded mb-0 bg-white">
        <template #head()="data">
          <div class="header-table--statistic">
            <input
              v-if="data?.field?.key === 'checkbox'"
              type="checkbox"
              @change="toggleSelectAll"
              :checked="selectedItems?.length === items?.length && items?.length > 0"
            />
            <div class="label">{{ data?.label }}</div>
          </div>
        </template>
        <template #cell(checkbox)="data">
          <input
            type="checkbox"
            @change="toggleSelection(data.item.uuid)"
            :checked="selectedItems.includes(data.item.uuid)"
          />
        </template>
        <template #cell(amount)="data">
          <span v-if="data?.item?.amount">{{ formatRupiah(data?.item?.amount) }}</span>
          <i v-else class="ri-subtract-fill" style="font-weight: 500"></i>
        </template>
        <template #cell(beneficiary_bank)="data">
          <div v-if="data?.item?.beneficiary_bank || data?.item?.beneficiary_account" class="d-flex flex-column gap-1">
            <span v-if="data?.item?.beneficiary_bank">Bank {{ data?.item?.beneficiary_bank }}</span>
            <span v-if="data?.item?.beneficiary_account">****&nbsp;{{ trimAccountBankNumber(data?.item?.beneficiary_account) }}</span>
          </div>
          <i v-else class="ri-subtract-fill" style="font-weight: 500"></i>
        </template>
        <template #cell(status)="data">
          <div
            @click="onClickOpenModalNotes(data?.item?.notes)"
            v-if="data?.item?.status === 'rejected'"
            v-b-popover.hover.top="{ 
              title: 'Klik untuk melihat catatan', 
              containerClass: 'scrollable-popover' 
            }"            
            class="py-1 px-2 rounded-pill" 
            :style="`width:fit-content;background-color: ${getStatusBadge(data?.item?.status)?.backgroundColor}; color: ${getStatusBadge(data?.item?.status)?.color}; cursor: pointer;`" 
          >{{ getStatusBadge(data?.item?.status)?.icon }}&nbsp;<span :style="`color: ${getStatusBadge(data?.item?.status)?.color}; text-decoration:underline`">{{ getStatusBadge(data?.item?.status)?.text }}</span></div>
          <span
            v-else-if="data?.item?.status"
            class="py-1 px-2 rounded-pill" 
            :style="`background-color: ${getStatusBadge(data?.item?.status)?.backgroundColor}; color: ${getStatusBadge(data?.item?.status)?.color}`" 
          >{{ getStatusBadge(data?.item?.status)?.icon }} {{ getStatusBadge(data?.item?.status)?.text }}</span>
          <i v-else class="ri-subtract-fill" style="font-weight: 500"></i>
        </template>
        <template #cell(created_at)="data">
          <span v-if="data?.item?.created_at">{{ formatDate(data?.item?.created_at) }}</span>
          <i v-else class="ri-subtract-fill" style="font-weight: 500"></i>
        </template>
        <template #cell(action)="data">
          <button :disabled="selectedItems.length > 0" class="btn btn-outline-primary py-2 px-3" @click="$emit('onReject', data?.item?.uuid)">TOLAK</button>
          <button :disabled="selectedItems.length > 0" class="btn btn-primary py-2 px-3" @click="$emit('onAccept', data?.item?.uuid)">TERIMA</button>
        </template>
        <template #table-busy>
          <div class="text-center text-danger">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
        <template #empty>
          <p class="empty-state my-2">Belum ada permintaan transaksi</p>
        </template>
      </b-table>
      <b-pagination
        v-if="!isLoading"
        align="right"
        v-model="pagination.page"
        :total-rows="pagination.totalItems"
        :per-page="pagination.perPage"
        @change="onUpdatePage"
      ></b-pagination>
    </div>

    <b-modal id="modalPublish" v-model="showModalNotes" size="md" centered hide-header hide-footer body-class="p-0">
      <template>
        <div class="modal-process centered p-4">
          <i class="warning-icon ri-error-warning-line"></i>
          <h3 class="modal-title mb-0">Catatan dari Admin</h3>
          <p class="text-center">{{ showNotes }}</p>
          <button class="btn btn-primary px-4 py-2" @click="onClickCloseModalNotes">Tutup</button>
        </div>
      </template>
    </b-modal>
</div>
</template>

<script>
import { formatRupiah } from '~/commons/utils';

export default {
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object,
      default: () => {}
    },
    clearSelectionTrigger: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      selectedItems: [],

      showModalNotes: false,
      showNotes: ''
    }
  },
  watch: {
    clearSelectionTrigger(newVal) {
      if (newVal) {
        this.clearSelectedItems();
      }
    }
  },
  computed: {
    fieldsWithCheckbox() {
      return [{ key: 'checkbox', label: '' }, ...this.fields];
    }
  },
  methods: {
    formatRupiah,

    onClickOpenModalNotes(value) {
      this.showModalNotes = true
      this.showNotes = value
    },

    onClickCloseModalNotes() {
      this.showModalNotes = false
      this.showNotes = ''
    },

    onUpdatePage(page, perPage = 10) {
      this.$emit('onChangePage', { page, perPage })
    },

    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedItems = this.items.map((item) => item.uuid);
      } else {
        this.selectedItems = [];
      }

      this.$emit('toggle-selection', this.selectedItems);
    },

    toggleSelection(uuid) {
      if (this.selectedItems.includes(uuid)) {
        this.selectedItems = this.selectedItems.filter((id) => id !== uuid);
      } else {
        this.selectedItems.push(uuid);
      }

      this.$emit('toggle-selection', this.selectedItems)
    },

    clearSelectedItems() {
      this.selectedItems = [];
      this.$emit('toggle-selection', this.selectedItems);
    },

    getStatusBadge(status) {
      const statusMap = {
        requested: {
          icon: '📝',
          backgroundColor: '#F0F4FF',
          color: '#3F51B5',
          text: 'Diajukan'
        },
        approved: {
          icon: '✅',
          backgroundColor: '#E6FFFA',
          color: '#2B9E6A',
          text: 'Disetujui Admin'
        },
        queued: {
          icon: '⏳',
          backgroundColor: '#FFFDE7',
          color: '#C79100',
          text: 'Dalam Antrean Sistem'
        },
        processed: {
          icon: '🏦',
          backgroundColor: '#FFF3E0',
          color: '#E65100',
          text: 'Dalam Proses Pencairan oleh Bank Tujuan'
        },
        completed: {
          icon: '🎉',
          backgroundColor: '#E8F5E9',
          color: '#388E3C',
          text: 'Berhasil Dicairkan'
        },
        failed: {
          icon: '❌',
          backgroundColor: '#FFEBEE',
          color: '#D32F2F',
          text: 'Gagal (Lihat Notes untuk Detailnya)'
        },
        rejected: {
          icon: '🚫',
          backgroundColor: '#FBE9E7',
          color: '#BF360C',
          text: 'Ditolak (Lihat Notesnya!)'
        }
      };

      return statusMap[status] || {
        icon: '❓',
        backgroundColor: '#E0E0E0',
        color: '#616161',
        text: 'Status Tidak Dikenal'
      };
    },

    trimAccountBankNumber(account) {
      if (!account) return "";
      const length = account.length;
      if (length > 4) {
        return account.slice(-4); // Keep only the last 4 digits
      }
      return account; // Return as is if length is 4 or less
    },

    formatDate(isoString) {
      if (!isoString) return "";

      // Convert ISO string to Date object
      const date = new Date(isoString);

      // Get the components
      const day = date.getDate(); // Day of the month
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()]; // Month name (short)
      const year = date.getFullYear(); // Year
      const hours = date.getHours().toString().padStart(2, "0"); // Hours (2-digit)
      const minutes = date.getMinutes().toString().padStart(2, "0"); // Minutes (2-digit)

      // Combine the components
      return `${day} ${month} ${year}, ${hours}:${minutes}`;
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/utilities/_colors.scss';

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

  .warning-icon {
    font-size: 72px;
    color: $yellow;
  }

  h3 {
    font-size: 24px;
  }

  p {
    font-size: 16px;
    font-weight: 500
  }
}

.scrollable-popover {
  max-height: 200px; /* Set the desired max height */
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: hidden; /* Prevent horizontal scrolling */
}

::v-deep .b-table{
  thead{
    tr{
      border-bottom: 1px solid rgba(0, 0, 0, .05) !important;
    }

    th{
      font-weight: 600;
      color: rgb(0, 0, 0);
      text-transform: capitalize;
      letter-spacing: normal;
    }
  }

  td{
    color: rgb(0, 0, 0);
  }

  tr{
    border: none !important;
  }
}

.wrapper-table-statistic--table{
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, .1);
}

.header-table--statistic{
  display: flex;
  align-items: center;
  gap: 10px;

  .label, .icon-sorting{
    font-weight: 600;
    text-transform: capitalize;
    letter-spacing: normal;
  }

  .label{
    color: rgb(0, 0, 0);
  }

  .icon-sorting{
    width: auto;
    height: auto;
    cursor: pointer;
    color: #B3B3B3;

    &.active{
      color: rgb(0, 0, 0);
    }
  }
}

.empty-state{
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: rgba(0,0,0,.65);
}

.statistic-pagination{
  margin: 24px 24px 24px 0px !important;
}
</style>