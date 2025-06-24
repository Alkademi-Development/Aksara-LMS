<template>
	<section id="review-table">

		<b-table
			id="datatables"
			:class="tableClass"
			head-variant="light"
			responsive
			show-empty
			tdClass="vetical-align: middle"
			:fields="fields"
			:items="items"
			:busy="isBusy"
			empty-text="Belum ada peserta"
			:tbody-tr-class="rowClass"
		>
			<template #cell(no)="data">
				<div class="w-100 text-center">
					{{
						pagination?.page == 1
						? data?.index + 1
						: data?.index + (pagination?.page == 2 ? pagination?.page * 5 + 1 : (pagination?.page - 1) * 10 + 1 )
					}}
				</div>
			</template>

			<template #cell(name)="data">
				<span
					class="name-link pointer"
					@click="onUserClick(data)"
                >{{ data?.item?.userName }}</span>
			</template>

			<template #cell(submitted_at)="data">
				<span v-if="data?.item?.submitted_at">{{ toDateTimes(data?.item?.submitted_at) }}</span>
			</template>

			<template #cell(task)="data">
				<template v-if="data?.item?.submitted_at">
					<a v-if="(data?.item?.type == 'link' ||data?.item?.type == 'file') && data?.item?.link" class="btn btn-outline-primary btn-sm rounded-pill" :href="data?.item?.link" target="_blank">Buka Tugas</a>
					<div v-else-if="(data?.item?.type == 'link' ||data?.item?.type == 'file') && !data?.item?.link" v-b-tooltip.hover title="Link tugas tidak ditemukan." class="btn-assignment--disable btn btn-outline-primary btn-sm rounded-pill">Buka Tugas</div>
					<b-button v-else variant="outline-primary" size="sm" pill @click="openTask(data?.item)">Buka Tugas</b-button>
				</template>
			</template>

			<template #cell(score)="data">
				<button class="btn btn-no-styles btn-small btn-score" @click="onClickBtnScore(data?.item)">
					<span>{{ data?.item?.score }}</span>
					<i class="ri-pencil-line"></i>
				</button>
			</template>

			<template #cell(scored)="data">
				<div class="w-100 text-center">
					<i v-if="data?.item?.scored" class="ri-checkbox-circle-fill text-success"></i>
					<i v-else class="ri-checkbox-circle-line"></i>
				</div>
			</template>

			<template #table-busy>
				<div class="d-flex align-items-center justify-content-center my-2">
					<b-spinner small class="mr-2"></b-spinner>
					<strong>Memuat Data...</strong>
				</div>
			</template>

		</b-table>

		<b-pagination
            v-if="!isBusy && pagination?.totalPages > 1"
            class="mt-4 mb-0 justify-content-end"
            v-model="pagination.page"
            :total-rows="pagination.totalItems"
            :per-page="pagination.perPage"
            @change="onUpdatePage"
        ></b-pagination>

	</section>
</template>

<script>
import { toDateTimes, toEncrypt } from "@/commons/utils"
import appToken from '~/api/app-token'

export default {
	props: {
        rowClass: {
            type: String,
            default: "",
        },
        tableClass: {
            type: String,
            default: "pb-4 m-0",
        },
		isBusy: {
            type: Boolean,
            default: false,
        },
		fields: {
			type: Array,
            default: () => []
		},
		items: {
			type: Array,
			default: () => []
		},
		pagination: {
			type: Object,
			default: {
                page: 1,
                perPage: 10,
                totalItems: 1,
                totalPages: 1,
            },
		}
	},
	methods: {
		toDateTimes,

		onClickBtnScore(data) { this.$emit('onClickBtnScore', data) },

		async openTask(data) {
			const id = data?.externalId
            const responseId = "&responseId=" + id
            const redirectLms = "&redirectTo=" + window.location.href

            var urlTarget = ''
            if (data?.type == 'studio') urlTarget = process.env.editorURL + `compiler?&metronomId=${id}` + redirectLms
            if (data?.type == 'form') urlTarget = process.env.formURL + "/preview?" + responseId + redirectLms

            const baseUrl = process.env.alkademiAuth;
            const redirect = "&redirectTo=" + urlTarget;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
			const code = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`
            const url = `${baseUrl}/check?${redirect}${lmsId}${code}${generatedToken}`;
			if(data?.type == 'form' && data?.scored == 0) this.$emit('onFormOpened', id)

            this.$emit('onRefresh')
            window.open(url, '_blank')
        },

		onUpdatePage(page) {
			this.$emit('onChangePagination', page)
		},
		onUserClick(data) {
			localStorage.setItem('userId', toEncrypt(data?.item?.userId))
			this.$router.push({
				path: `/dashboard/students/${(data?.item?.userName.toLowerCase().replace(/\s/g, '-'))}`,
			})
		},
	},
};
</script>

<style lang="scss">
@import "@/assets/scss/components/micro/table/review-table.scss";
</style>