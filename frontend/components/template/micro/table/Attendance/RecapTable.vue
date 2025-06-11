<template>
    <section class="card border m-0">
        <b-table
            id="datatables"
            head-variant="light"
            responsive
            show-empty
            tdClass="vertical-align: middle"
            :busy="isBusy"
            :fields="fields"
            :items="items"
        >
            <template #cell(no)="data">
                <div class="w-100 text-center">{{ data?.index + 1 + (pagination?.page * 10) - 10 }}</div>
            </template>

            <template #cell(name)="data">
                <span @click="onClickPreviewStudent(data?.item)" :class="`${data?.item?.enrolled ? 'text-primary cursor-pointer' : ''}`">{{ data?.item?.name }}</span>
            </template>

            <template #cell(dateAttend)="data">
                <span>{{ data?.item?.dateAttend }}</span>
            </template>

            <template #cell(email)="data">
                <span>{{ data?.item?.email }}</span>
            </template>

            <template #cell(proofAttendance)="data">
                <div class="d-flex flex-row align-items-center gap-2">
                    <div
                        v-for="(item, idx) of proofAttendItems"
                        :key="idx"
                        :class="`${checkDataProofAttendItem(item?.action, data?.item) ? 'color-primary pointer' : 'color-gray'}`"
                        @click="onDetailProofClick(item.action, data.item)"
                    >
                        <i :class="item.value" style="font-size: 1.175rem"></i>
                    </div>
                </div>
            </template>

            <template #cell(timeIn)="data">
                <span>{{ data?.item?.timeIn }}</span>
            </template>

            <template #cell(timeOut)="data">
                <span>{{ data?.item?.timeOut }}</span>
            </template>

            <!-- <template #cell(info)>
                <span>Hadir</span>
            </template> -->

            <template #cell()="data">
                <template v-if="data.value === 'Hadir'">
                    <span :class="`${isSelectedUser ? '' : 'cursor-pointer'}`" @click="onDateClick(data)">{{ data.value }}</span>
                </template>
                <span v-else class="text-danger">{{ data.value }}</span>
            </template>

            <template #table-busy>
                <div class="my-2 text-center text- i1 primary">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Memuat Data...</strong>
                </div>
            </template>
        </b-table>

        <b-pagination
            v-if="!isBusy"
            align="right"
            v-model="pagination.page"
            :total-rows="pagination.totalItems"
            :per-page="pagination.perPage"
            @change="onUpdatePage"
        ></b-pagination> 
    </section>
</template>

<script>
export default {
    props: {
        isBusy: Boolean,
        fields: {
            type: Array
        },
        items: {
            type: Array,
            default: () => []
        },
        isSelectedUser: {
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
    },
    data() {
        return {
            proofAttendItems: [
                // { value: 'ri-qr-scan-line', action: 'selfie' },
                { value: 'ri-map-pin-2-line', action: 'location' },
                { value: 'ri-edit-box-fill', action: 'signature' },
            ]
        }
    },
    methods: {
        onDateClick(data) {
            if(!this.isSelectedUser) this.$emit('onDateClick', data)
        },
        onDetailProofClick(action, data) {
            const isThereData = this.checkDataProofAttendItem(action, data);
            if (data?.status && isThereData) this.$emit('onPreviewClick', { action, data })
        },
        onUpdatePage(val) {
            this.$emit("fetchData", val);
        },
        onClickPreviewStudent(user){
            if(user?.enrolled) this.$emit("onClickDetailStudent", user?.id);
        },
        checkDataProofAttendItem(type, dataAttend){
            if(type === 'location') return !!dataAttend?.latitude && !!dataAttend?.longitude;
            else if(type === 'signature') return !!dataAttend?.signature;
        }
    }
}
</script>
