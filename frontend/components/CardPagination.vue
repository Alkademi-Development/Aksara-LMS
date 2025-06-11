<template>
    <b-card v-if="dPaginate.totalPages > 1" no-body class="bg-primary">
        <b-card-body class="d-flex align-items-center justify-content-between">
            <p class="mb-0 text-white">Halaman <strong class="text-secondary font-weight-bold">{{ dPaginate.page }}</strong> / {{ dPaginate.totalPages }}</p>
            <div>
                <b-button variant="white" size="sm" class="text-primary" :disabled="dPaginate.page > 1 ? false : true" @click="prevPage">Sebelumnya</b-button>
                <b-button variant="white" size="sm" class="text-primary" :disabled="dPaginate.page < dPaginate.totalPages ? false : true" @click="nextPage">Selanjutnya</b-button>
            </div>
        </b-card-body>
    </b-card>
</template>

<script>
export default {
    data() {
        return {
            dPaginate: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            }
        }
    },
    mounted() {
        this.setPagination()
    },
    methods: {
        setPagination() {
            this.dPaginate = this.pagination
        },
        prevPage() {
            this.$emit('pageChange', this.dPaginate.page - 1)
        },
        nextPage() {
            this.$emit('pageChange', this.dPaginate.page + 1)
        }
    },
    watch: {
        pagination() {
            this.setPagination()
        }
    },
    props: {
        pagination: {
            type: Object,
            default: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            }
        },
    }
}
</script>