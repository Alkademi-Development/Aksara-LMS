<template>
    <section class="pdf-content p-4 bg-white rounded d-flex flex-column justify-content-between">
        <section>
            <section class="w-100 d-flex flex-row align-items-center justify-content-between bg-primary rounded mb-3 px-4 py-3">
                <h3 class="title text-white">RAPOR SISWA</h3>
                <section class="image-container">
                    <img
                        class="h-100"
                        src="@/assets/img/brand/logo-white.png"
                        alt="User Image"
                        ref="userImage"
                    />
                </section>
            </section>
    
            <section class="row no-gutters mb-3">
                <section class="col-5 border-card profile-container bg-white py-3 px-4 rounded mr-3">
                    <section 
                        class="b-avatar badge-primary rounded-circle mb-2" 
                        style="width: 7rem; height: 7rem;"
                    >
                        <span class="b-avatar-img rounded-circle">
                            <!-- <img 
                                :src="detailRaport?.raport?.Photo" 
                                :alt="detailRaport?.raport?.Name"
                            > -->
                            <b-avatar 
                                size="8rem"
                                variant="primary" 
                                :src="detailRaport?.raport?.Photo"
                                :text="!!detailRaport?.raport?.Photo ? '' : detailRaport?.raport?.Name?.[0]"
                            >
                            </b-avatar>
                        </span>
                    </section>
                    
                    <div class="d-flex flex-column justify-content-start">
                        <h4>{{ detailRaport?.raport?.Name }}</h4>
                        <span>{{ detailRaport?.raport?.City }}</span>
                    </div>
                </section>
                
                <section class="col">
                    <section class="bg-white rounded mb-2 border-card">
                        <div class="py-3 px-4 bg-primary d-flex flex-row justify-content-between align-items-center">
                            <h5 class="text-white">
                                {{ detailRaport?.raport?.Program?.toUpperCase() }}
                            </h5>
                        </div> 
                        <div class="info-container py-3 px-4 rounded-bottom bg-white">
                            <div class="info-item row">
                                <span class="col-5 title">Lama Pelatihan</span>
                                <span>:</span>
                                <span class="col value">{{ detailRaport?.raport?.LongTime }}</span>
                            </div>
                            <div class="info-item row">
                                <span class="col-5 title">Tugas Dikerjakan</span>
                                <span>:</span>
                                <span class="col value">
                                    {{ detailRaport?.raport?.TaskSubmitted }}
                                    / 
                                    {{ detailRaport?.raport?.Modules != null ? detailRaport?.raport?.Modules.length : 0 }} (Tugas)</span>
                            </div>
                            <div class="info-item row mb-0">
                                <span class="col-5 title">Skor</span>
                                <span>:</span>
                                <span class="col value">
                                    {{ detailRaport?.raport?.AverageScore }}
                                    / 
                                    100</span>
                            </div>
                        </div>
                    </section>
                    
                    <section :class="`py-2 text-center rounded ${detailRaport?.raport?.Passed === 'Tidak' ? 'bg-danger' : 'bg-success'}`">
                        <h5 class="text-white">
                            {{ detailRaport?.raport?.Passed === 'Tidak' ? 'TIDAK LULUS' : 'LULUS' }}
                        </h5>
                    </section>
                    
                </section>
    
            </section> 
    
            <section class="mb-6">
                <section class="bg-white rounded mb-2">
                    <div class="row mb-2 no-gutters">
                        <div class="col py-3 px-4 bg-primary rounded mr-2">
                            <h4 class="text-white">KOMPETENSI SISWA</h4>
                        </div>
                        <div class="col-1 text-center py-3 bg-primary rounded ">
                            <h4 class="text-white">{{ detailRaport?.raport?.AverageScore }}</h4>
                        </div>
                    </div>
                    
                    <template v-if="detailRaport?.raport?.Modules?.length > 0">
                        <div 
                            class="row mb-2 no-gutters" 
                            v-for="(module, index) in detailRaport?.raport?.Modules" 
                            :key="index"
                        >
                            <div class="col py-2 px-4 border-card rounded mr-2 ">
                                <h6 class="text-muted">Materi &bull; {{ module?.Module ?? '-' }}</h6>
                                <h5 class="font-weight bold">{{ module?.Topic ?? '-' }}</h5>
                            </div>
                            <div class="col-1 text-center py-2 border-card rounded d-flex justify-content-center align-items-center">
                                <h5 class="font-weight bold">{{ module?.Score ?? '0' }}</h5>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div 
                            class="row no-gutters"
                        >
                            <h5 class="text-center w-100 mt-2">Belum Ada Tugas</h5>
                        </div>
                    </template>
                </section>
    
            </section>
        </section>

        <section class="fixed-foot px-4">
            <div class="w-100 d-flex justify-content-center">
                <div class="d-flex flex-column align-items-center justify-content-center">
                    <h4 class="raport-date mb-3">{{ detailRaport?.raport?.Now }}</h4>
                    <img 
                        id='barcode' 
                        class="font-weight-bold mb-3"
                        :src="`https://api.qrserver.com/v1/create-qr-code/?data=${detailRaport?.raport?.Url}&amp;size=100x100`" 
                        alt="" 
                        title="HELLO" 
                        width="86" 
                        height="86" 
                    />
                    <!-- <section class="image-container">
                        <img
                            class="h-100"
                            :src="detailRaport?.raport?.Photo"
                            alt="User Image"
                            ref="userImage"
                        />
                    </section> -->
                </div>
                <!-- <div 
                    class="signature-container"
                    v-for="(signature, index) in detailRaport?.raport?.Signatures" 
                    :key="index"
                >   
                    <div class="signature-image-container">
                        <img
                            class="h-100"
                            :src="signature?.signature"
                            alt="User Image"
                            ref="userImage"
                        />
                    </div>
                    <hr class="signature-divider">
                    <h4 class="signature-name">{{ signature?.name }}</h4>
                    <h5 class="signature-job">{{ signature?.job }}</h5>
                </div> -->
            </div>            
        </section>
    </section>
</template>

<script>
export default {
    props: {
        detailRaport: {
			type: Object,
			default: () => {}
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

            const modules = this.detailRaport?.raport?.Modules

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
        }
    },
    mounted() {
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
  min-height: 1100px;
  position: relative;

    .border-card {
        border: 2px solid var(--bs-primary)
    }
    .profile-container {
        
        .profile-image-container {
            height: 118px;
            overflow: hidden;
        }
    }

    .image-container {
        height: 32px;
        overflow: hidden;
    }

    .info-container {
        .info-item {
            margin-bottom: 8px;

            .title {
                font-weight: 600;
                font-size: 14px;
            }

            .value {
                font-weight: 600;
                font-size: 14px;
            }
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

    .signature-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .signature-image-container {
            height: 138px;
            margin-bottom: -30px;
        }

        .signature-divider {
            background-color: var(--bs-primary);
            width: 100%;
            height: 1.5px;
            margin: 0 0 12px 0 ;
        }
        
        .signature-job {
            font-weight: 500;
        }
    }

    
    .fixed-foot {
        // position: absolute;
        // left: 0;
        // bottom: 0;
        width: 100%;
    }

}
</style>