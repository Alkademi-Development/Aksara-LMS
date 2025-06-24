<template>
    <section class="pdf-content py-5 bg-white">
        <section class="row no-gutters mb-4">
            <section class="col bg-primary rounded-lg-right mb-3 px-8 py-4">
                <section class="image-container">
                    <img
                        class="h-100"
                        src="@/assets/img/brand/logo-white.png"
                        alt="User Image"
                        ref="userImage"
                        v-if="DOMAIN.DOMAIN == 'alkademi.id'"
                    />
                    <img
                        class="h-100"
                        :src="!!logoLight ? logoLight : '@/assets/img/brand/logo-white.png'"
                        alt="User Image"
                        ref="userImage"
                        v-else
                    />
                </section>
            </section>
            <section class="col-auto px-4 text-center">
                <h3 class="title">SERTIFIKAT</h3>
                <div class="row no-gutters align-items-center">
                    <hr class="col title-line m-0">
                    <p class="col-auto subtitle px-2 mb-0">APRESIASI</p>
                    <hr class="col title-line m-0">
                </div>
            </section>
            <section class="col-1 bg-primary px-4 py-4 rounded-lg-left"></section>
        </section>

        <section class="content-wrapper justify-content-center">
            <section class="text-center">
                <p class="subtitle-2">SERTIFIKAT INI DI BERIKAN KEPADA</p>
            </section>

            <section>
                <hr class="divider">

                <section class="text-center">
                    <h1 class="name" :style="detailCertificate?.raport?.Name?.length > 39 ? 'font-weight: 200; font-size: 40px; line-height: 60px;' : detailCertificate?.raport?.Name?.length > 29 ? 'font-weight: 250; font-size: 56px; line-height: 80px;' : 'font-weight: 400; font-size: 96px; line-height: 120px;'">
                        {{ detailCertificate?.raport?.Name | lowercase}}
                    </h1>
                </section>

                <hr class="divider">
            </section>

            <section class="text-center mb-5">
                <p v-if="detailCertificate?.raport?.ClassSlug === 'liga-smk-challenge-1---slicing-brawl'" class="description mx-auto">
                    Atas partisipasinya sebagai peserta dalam kegiatan {{ detailCertificate?.raport?.Program }} Fase Slicing Brawl yang dilaksanakan pada 5 Desember 2023
                </p>
                <p v-else-if="detailCertificate?.raport?.ClassSlug === 'liga-smk---coding-clash'" class="description mx-auto">
                    Atas partisipasinya sebagai peserta dalam kegiatan {{ detailCertificate?.raport?.Program }} Fase Coding Clash yang dilaksanakan pada 9 Desember 2023
                </p>
                <p v-else-if="detailCertificate?.raport?.ClassSlug === 'liga-smk---hacker-glory'" class="description mx-auto">
                    Atas partisipasinya sebagai peserta dalam kegiatan {{ detailCertificate?.raport?.Program }} Fase Hacker Glory yang dilaksanakan pada periode waktu 11 - 17 Desember 2023
                </p>
                <p v-else-if="detailCertificate?.raport?.ClassSlug === 'magang-alkademi'" class="description mx-auto">
                    Atas partisipasinya sebagai peserta dalam kegiatan Magang Universitas Pendidikan Indonesia di Alkademi yang dilaksanakan pada periode waktu {{ detailCertificate?.raport?.Start }} - {{ detailCertificate?.raport?.End }}
                </p>
                <p v-else class="description mx-auto">
                    Atas partisipasinya sebagai peserta dalam kegiatan {{ detailCertificate?.raport?.Class }} {{ !detailCertificate?.raport?.ClassAlwaysOpen ? `yang dilaksanakan pada periode waktu ${detailCertificate?.raport?.Start} - ${detailCertificate?.raport?.End}` : '' }}
                    <!-- Atas partisipasinya sebagai peserta dalam kegiatan Pelatihan {{ detailCertificate?.raport?.Program }} {{ title }} yang dilaksanakan pada periode waktu {{ detailCertificate?.raport?.Start }} - {{ detailCertificate?.raport?.End }} -->
                </p>
            </section>
            <section class="row">
                <section class="col signature text-start mx-auto">
                    <VueQRCodeComponent
                        :text="detailCertificate?.raport?.Url"
                        :size="size"
                        error-level="L"
                    />
                </section>
                <section class="col signature text-center mx-auto">
                    <p class="signature-date">Bandung, {{ detailCertificate?.raport?.ClassAlwaysOpen ? detailCertificate?.raport?.Release : detailCertificate?.raport?.End }}</p>

                    <img v-if="DOMAIN?.DOMAIN === 'smkcoding.id' || DOMAIN?.DOMAIN === 'alkademi.id'" class="signature-image" src="@/assets/img/ttd-kanghelmi.png" :alt="`${detailCertificate?.raport?.Signatures?.[0]?.name} signature`">
                    <div v-else class="mb-6"></div>

                    <p class="signature-name">{{ detailCertificate?.raport?.Signatures?.[0]?.name }}</p>
                    <hr class="signature-divider my-2">
                    <p class="signature-job">{{ detailCertificate?.raport?.Signatures?.[0]?.job }}</p>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
import VueQRCodeComponent from 'vue-qrcode-component'
import { mapState } from 'vuex';

import DOMAIN from "@/api/app-token";
import sassSettings from '~/store/global/sass-settings';

export default {
    props: {
        detailCertificate: {
			type: Object,
			default: () => {}
		},
    },
    data() {
        return {
            DOMAIN,
            logoLight: '',
            title: '',
            size: 125,
        }
    },
    components: {
        VueQRCodeComponent
    },
    filters: {
        lowercase: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.toLowerCase()
        },
    },
    computed: {
        tableFields: () => {
            const fields = [
                {
                    key: 'subject',
                    label: 'Materi'
                },
                {
                    key: 'score',
                    label: 'Nilai'
                }
            ]
            return fields;
        },
        tableItems() {
            const items = []

            const modules = this.detailCertificate?.raport?.Modules

            if (!!modules) {
                modules.forEach(item => {
                    const payload = {
                        topic: item?.Topic,
                        description: item?.Description,
                        score: item?.Score
                    }

                    items.push(payload)
                });
            }
            return items
        },
        ...mapState({
            saasState: (state) => state.Sass,
        }),
    },
    mounted() {
        const dataSettings = this.saasState.settings

        if (!!dataSettings) {
            this.logoLight = dataSettings?.logo_light ?? null
            this.title = dataSettings?.title ?? null
        }

        this.$nextTick(() => {
            setTimeout(() => {
                this.$emit("domRendered");
            }, 1000);
        });
    },
    methods: {
    }
};
</script>

<style lang="scss" scoped>
.pdf-content {
    width: 100%;
    min-height: 792px;
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    .border-card {
        border: 2px solid var(--bs-primary)
    }

    .image-container {
        height: 62px;
        overflow: hidden;
        text-align: right;
    }

    .content-wrapper {
        min-width: 760px;
        display: flex;
        flex-direction: column;
    }


    .title {
        font-family: 'Crimson Pro';
        font-style: normal;
        font-weight: 400;
        font-size: 62px;
        line-height: 69px;
    }

    .title-line {
        border: 1px solid #000000;
    }

    .subtitle {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 900;
        font-size: 16px;
        line-height: 19px;
    }

    .subtitle-2 {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        letter-spacing: 0.2em;
    }

    .name {
        font-family: 'Allura';
        font-style: normal;


        text-transform: capitalize;
    }

    .description {
        max-width: 680px;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        text-align: center;
    }

    .signature {
        max-width: 220px;

        .signature-image {
            height: 92px;
            overflow: hidden;
            text-align: right;

            margin-left: -84px;
            margin-bottom: -12px;
        }

        .signature-name, .signature-date, .signature-job {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 10px;
        }

        .signature-divider {
            border: 1px solid #000000;
        }
    }

    .table-description {
        white-space: break-spaces;
        max-width: 100%;
        font-size: 12px !important;

        ::v-deep p {
            font-size: 14px;
            margin-bottom: 0;
        }
    }

    .divider {
        background-color: var(--bs-primary);
        height: 1.5px;
    }

    .raport-date {
        font-size: 18px;
        font-weight: 500;
    }

    .fixed-foot {
        // position: absolute;
        // left: 0;
        // bottom: 0;
        width: 100%;
    }

    .rounded-lg-right {
        border-radius: 0px 25px 25px 0px !important;
    }

    .rounded-lg-left {
        border-radius: 25px 0px 0px 25px !important;
    }

}
</style>