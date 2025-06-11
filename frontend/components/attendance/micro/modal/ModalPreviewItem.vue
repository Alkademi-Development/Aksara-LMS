<template>
    <b-modal 
        v-model="isModalOpen"
        size="sm"
        centered
        hide-header
        hide-footer
    >
        <template v-if="item?.action != 'location'">
            <div class="rounded" style="overflow: hidden">
                <b-img-lazy
                    :src="item?.action === 'selfie' ? item?.data?.selfie : item?.data?.signature"
                    :alt="item?.action"
                    fluid
                    blank
                    blank-color="#bbb"
                    center
                    class="signature-img"
                />
            </div>

        </template>

        <template v-if="item?.action == 'location'">
            <MapsPreview
                :center="[item?.data?.latitude, item?.data?.longitude]"
                :markerLatLng="[item?.data?.latitude, item?.data?.longitude]"
            />
            <div class="mt-3 d-flex flex-row align-items-center gap-2 mx-auto" style="width: max-content">
                <i class="ri-map-pin-2-fill" style="font-size: 1.25rem"></i>
                {{ address }}
            </div>
        </template>
    </b-modal>
</template>

<script>
import MapsPreview from '@/components/attendance/micro/MapsPreview.vue'
import axios from 'axios'

export default {
    components: {
        MapsPreview,
    },
    props: {
        onOpenModal: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            isModalOpen: false,
            address: ''
        }
    },
    watch: {
        onOpenModal() {
            if (this.item?.action == 'location') {
                this.getLocationName(this.item?.data?.latitude, this.item?.data?.longitude)
            }

            this.isModalOpen = this.onOpenModal
        },
        isModalOpen() {
            if (!this.isModalOpen) this.$emit('openModal')
        },
    },
    methods: {
        async getLocationName(lat, lng) {
            const response = await axios.get(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=PointAddress&location=${lng},${lat}`)

            const data = response.data

            this.address = data?.address?.Address
        },
    },
}
</script>

<style scoped>
.signature-img{
    width: 100%;
    aspect-ratio: 21 / 9;
}
</style>


