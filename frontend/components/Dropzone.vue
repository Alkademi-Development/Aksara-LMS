
<template>
	<div>
		<div :class="`d-flex align-items-center ${label ? 'justify-content-between' : 'justify-content-end'} mb-2`">
			<label :for="`input-dz-${dropzoneId}`" class="m-0">{{label}}</label>
			<div>
				<template v-if="isUploading">
					<b-spinner label="Uploading" small variant="primary"></b-spinner>
				</template>
				<template v-else>
					<b-button
						v-if="value"
						variant="no-styles"
						size="sm"
						class="text-primary"
						@click="modalPreview(value)"
						>Preview</b-button
					>
				</template>
				<b-button
					v-if="value && !isContentImage"
					variant="no-styles"
					size="sm"
					class="text-danger"
					@click="changeFile(value)"
					>Ganti</b-button
				>
				<b-button v-if="withRemove && value && !disabled" variant="primary" size="sm" class="btn-no-styles text-danger" @click="changeFile(value)">Hapus</b-button>
			</div>
		</div>
		<div
			v-show="!disabled && isContentImage"
			class="dropzone dropzone-single"
			:id="`custom-dz-${dropzoneId}`"
		>
			<div class="fallback">
				<div class="custom-file">
					<input
						type="file"
						class="custom-file-input"
						:id="`input-dz-${dropzoneId}`"
					/>
				</div>
			</div>
			<div class="dz-preview-single" :id="`${dropzoneId}-preview`">
				<div class="dz-preview-cover">
					<img
						class="dz-preview-img"
						src=""
						alt="..."
						data-dz-thumbnail
						style="max-width: 100%"
					/>
				</div>
			</div>
		</div>
		<b-form-input
			v-show="disabled || !isContentImage"
			:value="value"
			type="url"
			disabled
		></b-form-input>
		<small v-if="description">{{ description }}</small>
		<!-- Modal -->
		<b-modal
			v-model="isModalPreview"
			title="Preview"
			hide-footer
			centered
			size="lg"
			:body-class="noBodyPreview ? 'p-0' : ''"
		>
			<img :src="dataPreview" class="w-100" alt="image-preview" />
		</b-modal>
	</div>
</template>
<script>
export default {
	props: {
		dropzoneId: String,
		filedir: String,
		value: String,
		description: String,
		acceptedFiles: {
			type: String,
			default: "image/*",
		},
		label: {
			type: String,
			default: "",
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		noBodyPreview: {
			type: Boolean,
			default: true,
		},
		withRemove: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			currentFile: undefined,
			dropzone: null,
			zone: null,
			isModalPreview: false,
			dataPreview: null,
			isContentImage: true,
			isUploading: false,
		};
	},
	created() {
		this.isImageUrl(this.value);
	},
	mounted() {
		this.dropzone = $(`#custom-dz-${this.dropzoneId}`);
		const $dropzonePreview = $(`#${this.dropzoneId}-preview`);
		Dropzone.autoDiscover = false;

		const multiple = false;
		const preview = this.dropzone.find($dropzonePreview);
		const filedir = this.filedir// + "/" + Date.now().toString();
		const ctx = this;

		// Init options
		const options = {
			url: process?.env?.baseUrlDrive + 'v1/upload',
			thumbnailWidth: null,
			thumbnailHeight: null,
			previewsContainer: preview.get(0),
			previewTemplate: preview.html(),
			maxFiles: 1,
			acceptedFiles: this.acceptedFiles,
			init: function () {
				let zone = this;
				ctx.zone = zone;
				this.on("addedfile", function (file) {
					if (!multiple && ctx.currentFile) {
						this.removeFile(ctx.currentFile);
					}

					ctx.currentFile = file;
					const content = file?.type;

					if (ctx?.acceptedFiles?.includes("application") && ctx?.acceptedFiles?.includes("image")) {
                        // console.log("IMAGE & APPLICATION");
                        if (content?.includes("image")) ctx.isContentImage = true;
                        else if (content?.includes("application")) ctx.isContentImage = false;
                        else ctx.isContentImage = true
                    } else if (ctx?.acceptedFiles?.includes("application") && ctx?.acceptedFiles?.includes("image")) {
                        if (content?.includes("application")) ctx.isContentImage = false;
                        else ctx.isContentImage = true;
                    } else if (ctx?.acceptedFiles?.includes("image")) {
                        ctx.isContentImage = true;
                    } else {
                        ctx.isContentImage = true;
						ctx.zone.removeAllFiles();
						ctx.$emit("remove");
						ctx.currentFile = null;
                    }

				});

				this.on('error', () => {
					ctx.isContentImage = true;
				})

				this.on("sending", function (file, xhr, formData) {
					formData.append("filename", filedir + "/" + Date.now().toString());

					ctx.isUploading = true
					ctx.$emit('isUploading', ctx.isUploading)
				});

				this.on("success", function (file, response) {
					let data = "https://drive.alkademi.id/v1/" + response.data;
					ctx.$emit("input", data);

					ctx.isUploading = false
					ctx.$emit('isUploading', ctx.isUploading)
				});
			},
		};

		preview.html("");
		this.dropzone.dropzone(options);

		const uploadButton = document.querySelector(
			`#custom-dz-${this.dropzoneId} .dz-button`
		);

		const titleContent = document.createElement("h5");
		const descriptionContent = document.createElement("span");

		uploadButton.textContent = ``;
		titleContent.innerText = "Tarik dan lepaskan file di sini";
		descriptionContent.innerText = "atau klik untuk upload";

		uploadButton.appendChild(titleContent);
		uploadButton.appendChild(descriptionContent);
	},
	methods: {
		isImageUrl(url) {
			if (url) {
				const imageExtensionRegex =
					/\.(jpeg|jpg|gif|png|svg|bmp|ico|webp)$/i;
				const validImg = imageExtensionRegex.test(url);
				if (validImg) this.isContentImage = true;
				else this.isContentImage = false;
			}
		},
		modalPreview(data) {
			if (!this.isContentImage) return window?.open(data, "_blank");
			this.isModalPreview = true;
			this.dataPreview = data;
		},
		changeFile(data) {
			this.$emit("remove");
			this.isContentImage = true;
			this.zone.removeAllFiles();
		},
	},
	watch: {
		value() {
			if (this.value == null || !this.value) {
				this.zone.removeAllFiles();
			}
		},
	},
};
</script>

<style scoped>
.dropzone {
	border: none !important;
	padding: 0 !important;
	width: 100%;
}
</style>