<template>
    <section id="class-overview">
        <template v-if="isComponentLoaded && isLoaded">
            <b-alert
                class="alert__cta d-flex flex-column flex-sm-row align-items-start align-items-sm-center mb-4"
                variant="success"
                :show="classOverview?.registered && classOverview?.kind === 'event'"
            >
                Anda telah terdaftar dan bisa mulai mengikuti seluruh kegiatan yang tersedia.
            </b-alert>
            <b-alert
            class="alert__cta d-flex flex-column flex-sm-row align-items-start align-items-sm-center mb-4"
            variant="primary"
            :show="classOverview?.registered && classOverview?.userState === -1">
                Anda sudah terdaftar pada kelas ini, silahkan lanjutkan pembayaran dan mulai belajar!
            </b-alert>
        </template>

        <b-row v-if="isComponentLoaded && isLoaded">

            <b-col cols="12" lg="8">

                <b-card v-if="classOverview?.logo" class="border card-logo">
                    <b-img :src="classOverview?.logo" class="img-logo"></b-img>
                </b-card>

                <div class="d-flex d-lg-none" v-if="userKind == 'student'">
                    <template v-if="classOverview?.registered">
                        <b-button
                            v-if="!classOverview?.userState"
                            variant="primary"
                            class="btn-action-add mb-4"
                            block
                            @click="btnPretestClick()"
                        >Lihat Pretest</b-button>
                        <b-button
                            v-else-if="classOverview?.type !== 'test' && classOverview?.classState > -1"
                            variant="primary"
                            class="btn-action-add mb-4"
                            block
                            @click="setActiveTab('courses')"
                        >Mulai Belajar</b-button>
                        <b-button
                            v-else-if="classOverview?.type === 'test'"
                            variant="primary"
                            class="btn-action-add mb-4"
                            block
                            @click="setActiveTab('assignments')"
                        >Kerjakan Tes</b-button>
                        <template v-if="classOverview.userState == -1">
                            <div class="card border w-100">
                                <div class="card-body py-4">
                                    <div class="mb-4">
                                        <h4 class="mb-4">Total pembayaran</h4>

                                        <div class="d-flex flex-row justify-content-between items-center">
                                            <b-skeleton class="w-100" v-if="isPaymentLoading" />
                                            <template v-else>
                                                <p class="font-weight-500 mb-2">Harga kelas</p>
                                                <p class="font-weight-600 mb-2">{{ formatRupiah(detailPayment?.amount) }}</p>
                                            </template>
                                        </div>

                                        <div class="d-flex flex-row justify-content-between items-center">
                                            <b-skeleton class="w-100" v-if="isPaymentLoading" />
                                            <template v-else>
                                                <p class="font-weight-500 mb-0">VAT</p>
                                                <p class="font-weight-600 mb-0">{{ formatRupiah(detailPayment?.vat) }}</p>
                                            </template>
                                        </div>

                                        <hr class="my-2">

                                        <div class="d-flex flex-row justify-content-between items-center">
                                            <b-skeleton class="w-100" v-if="isPaymentLoading" />
                                            <template v-else>
                                                <p class="font-weight-500 mb-2">Total harga</p>
                                                <p class="font-weight-600 color-primary mb-2">{{ formatRupiah(detailPayment?.total) }}</p>
                                            </template>
                                        </div>
                                    </div>

                                    <b-skeleton v-if="isPaymentLoading" class="w-100" />

                                    <template v-else>
                                        <b-button
                                            variant="primary"
                                            class="btn-action-add mb-2"
                                            block
                                            @click="onClickPayClass()"
                                        >{{ countdownPayment?.isExpired ? 'Bayar ulang' : 'Bayar Sekarang' }}</b-button>

                                        <p :class="[countdownPayment?.isExpired ? 'text-danger' : 'text-primary', 'font-weight-500']">
                                            {{ countdownPayment?.message }}
                                        </p>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </template>
                    <template v-else>
                        <b-button
                            v-if="comingSoon"
                            variant="outline-primary"
                            class="btn-action-add mb-4"
                            block
                            disabled
                        >Pendaftaran Belum Dibuka</b-button>
                        <b-button
                            v-else-if="!onRegistration"
                            variant="outline-primary"
                            class="btn-action-add mb-4"
                            block
                            disabled
                        >Pendaftaran Ditutup</b-button>
                        <b-button
                            v-else-if="quotaFull"
                            variant="outline-primary"
                            class="btn-action-add mb-4"
                            block
                            disabled
                        >Kuota Penuh</b-button>
                        <b-button
                            v-else-if="classOverview?.price > 0"
                            variant="primary"
                            class="btn-action-add mb-4"
                            block
                            @click="btnClassClick()"
                        >Daftar dan Bayar Sekarang</b-button>
                        <b-button
                            v-else
                            variant="primary"
                            class="btn-action-add mb-4"
                            block
                            @click="btnClassClick()"
                        >Daftar Sekarang</b-button>
                    </template>
                </div>
                <!-- <div class="d-block d-lg-none">
                    <template v-if="classOverview?.attendanceId == 0 && (userKind == 'admin' || userKind == 'superadmin' || userKind == 'mentor') && !classEnded">
                        <b-button
                            variant="primary"
                            class="btn-action-add mb-4"
                            @click="attendanceAction(classOverview, 'create')"
                            block>Buat Absen</b-button>
                    </template>

                    <template v-if="classOverview?.attendanceId != 0 && (userKind == 'admin' || userKind == 'superadmin' || userKind == 'mentor')">
                        <b-button
                            variant="outline-primary"
                            class="btn-action-add mb-4"
                            @click="attendanceAction(classOverview, 'recap')"
                            block>Rekap Absensi</b-button>
                    </template>

                    <template v-if="classStarted && !classEnded && classOverview?.userState">
                        <template v-if="classOverview?.attendanceId != 0 && userKind == 'student' && classOverview?.registered && attendanceStatus?.value == 0">
                            <b-button
                                variant="primary"
                                class="btn-action-add mb-4"
                                @click="attendanceAction(classOverview, 'attendIn')"
                                block>Absen Masuk</b-button>
                        </template>

                        <template v-if="classOverview?.attendanceId != 0 && userKind == 'student' && classOverview?.registered && attendanceStatus?.value == 1 && attendanceStatus?.status == 0">
                            <b-button
                                variant="primary"
                                class="btn-action-add mb-4"
                                @click="attendanceAction(classOverview, 'attendIn')"
                                block>Absen Keluar</b-button>
                        </template>

                        <template v-if="classOverview?.attendanceId != 0 && userKind == 'student' && classOverview?.registered && attendanceStatus?.value == 1 && attendanceStatus?.status == 1">
                            <b-button
                                variant="primary"
                                class="btn-action-add mb-4"
                                @click="attendanceAction(classOverview, 'attendIn')"
                                block>Lihat Absen</b-button>
                        </template>
                    </template>

                    <template v-if="classOverview?.attendanceId != 0 && (userKind == 'admin' || userKind == 'superadmin' || userKind == 'mentor') && !classEnded">
                        <b-card class="border card-group">
                            <b-row>
                                <b-col cols="12" md="4" class="position-relative cursor-pointer" @click="onGenerateQR">
                                    <VueQRCodeComponent
                                        v-if="!isQRBusy"
                                        :text="urlQR"
                                        :size="sizeQR"
                                        error-level="L"
                                        color="#666666"
                                    />
                                    <div class="view-qr d-flex justify-content-center align-items-center">
                                        <span><i class="ri-eye-fill"></i></span>
                                    </div>
                                </b-col>
                                <b-col cols="12" md="8">
                                    <h5 class="mb-1 d-flex align-items-center flex-row gap-1 cursor-pointer" @click="onGenerateQR">
                                        Generate QR Code
                                        <i class="ri-refresh-line"></i>
                                    </h5>
                                    <p style="font-size: 12px">Gunakan QR Code untuk memudahkan peserta melakukan absensi</p>
                                </b-col>
                                <b-col cols="12">
                                    <div hidden>
                                        <VueQRCodeComponent
                                            ref="qrVariant"
                                            :text="urlQR"
                                            :size="800"
                                            error-level="L"
                                        />
                                    </div>
                                    <b-button
                                        variant="primary"
                                        class="btn-action mt-3"
                                        block
                                        @click="onDownloadQR"
                                    >Download QR</b-button>
                                </b-col>
                            </b-row>
                        </b-card>
                    </template>
                </div> -->

                <h4 class="mb-4">Tentang</h4>

                <b-row v-if="!classOverview?.alwaysOpen">
                    <b-col cols="12" md="6">
                        <b-card class="card-cities border border-green">
                            <h6>Pendaftaran</h6>
                            <p>{{ beautifyDate(classOverview?.registrationStart, 'd-m') }} - {{ beautifyDate(classOverview?.registrationEnd) }}</p>
                        </b-card>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-card class="card-cities border border-blue">
                            <h6>Pelaksanaan</h6>
                            <p>{{ beautifyDate(classOverview?.start, 'd-m') }} - {{ beautifyDate(classOverview?.end) }}</p>
                        </b-card>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12" :md="classOverview?.heldCity?.length && classOverview?.heldCity?.length != 0 ? 6 : 12">
                        <b-card class="card-cities border">
                            <h6>Pendaftaran Dibuka Untuk</h6>
                            <div class="cities-container">
                                <template v-for="(item, index) in classOverview?.registrarCity">
                                    <span :key="index" v-if="index < 5" class="badge-gray">{{ item?.name }}</span>
                                </template>
                                <span v-if="classOverview?.registrarCity.length > 5" class="badge-gray pointer" @click="selectedObjectTags('Pendaftaran Dibuka untuk', classOverview?.registrarCity)">Lihat Selengkapnya</span>
                            </div>
                        </b-card>
                    </b-col>
                    <b-col v-if="classOverview?.heldCity?.length && classOverview?.heldCity?.length != 0" cols="12" md="6">
                        <b-card class="card-cities border">
                            <h6>Dilaksanakan di</h6>
                            <div class="cities-container">
                                <template v-for="(item, index) in classOverview?.heldCity">
                                    <span :key="index" v-if="index < 5" class="badge-gray">{{ item?.name }}</span>
                                </template>
                                <span v-if="classOverview?.heldCity.length > 5" class="badge-gray pointer" @click="selectedObjectTags('Dilaksanakan di', classOverview?.heldCity)">Lihat Selengkapnya</span>
                            </div>
                        </b-card>
                    </b-col>
                </b-row>

                <b-row v-if="classOverview?.schools?.length > 0">
                    <b-col cols="12">
                        <b-card class="card-cities border">
                            <h6>Sekolah Yang Terdaftar</h6>
                            <div class="cities-container">
                                <template v-for="(item, index) in classOverview?.schools">
                                    <span :key="index" v-if="index < 10" class="badge-gray">{{ item?.name }}</span>
                                </template>
                                <span v-if="classOverview?.schools.length > 10" class="badge-gray pointer" @click="selectedObjectTags('Sekolah Yang Terdaftar', classOverview?.schools)">Lihat Selengkapnya</span>
                            </div>
                        </b-card>
                    </b-col>
                </b-row>

                <b-card no-body class="border card-description">
                    <div class="card-body p-4" v-html="classOverview?.description"></div>
                    <div v-if="classOverview.tagList.length > 0" class="tags-container px-4 pb-4">
                        <template v-for="(item, index) in classOverview?.tagList">
                            <span :key="index" v-if="index < 10" class="badge-gray">#{{ item.trim() }}</span>
                        </template>
                        <span v-if="classOverview?.tagList.length > 10" class="badge-gray bg-primary btn pointer" @click="selectedObjectTags('Hashtag', classOverview?.tagList)">Lihat Selengkapnya</span>
                    </div>
                </b-card>

                <template v-if="classEvents?.length > 0">
                    <h4 class="mb-4">Daftar Kegiatan</h4>
                    <!-- <b-row> -->
                        <b-col
                            cols="8"
                            v-for="(event, idx) in classEvents"
                            :key="idx"
                        >
                        <div id="event">
                            <b-card class="event-card border" body-class="d-flex flex-column justify-content-between">
                                <section>
                                    <div class="header">
                                        <div class="title-container d-flex flex-row align-items-center justify-content-between">
                                            <span @click="onDetailClickEvent(event)" class="title h5 cursor-pointer">{{ event?.title }}</span>
                                        </div>
                                        <span class="description">{{ event?.description }}</span>
                                    </div>
                                    <div class="content">
                                        <div class="d-flex flex-row align-items-center">
                                            <div class="date d-flex flex-row align-items-start">
                                                <i class="ri-calendar-check-fill text-primary"></i>
                                                <span class="mb-0" style="font-weight: 700;">
                                                    {{ toDateTimes(event?.datetime) }}
                                                    {{ !!event?.endDate ? '-' : '' }}
                                                    {{ !!event?.endDate ? toDateTimes(event?.endDate) : '' }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="d-flex flex-row align-items-center">
                                            <div class="location d-flex flex-row align-items-start">
                                                <i v-if="event?.type === 'online'" class="ri-cast-line text-primary"></i>
                                                <i v-else class="ri-map-pin-2-line text-primary"></i>
                                                <div class="desc" style="font-weight: 700;">
                                                    {{ event?.type === 'online' ? event?.type : event?.type === 'offline' && !!event?.place ? event?.place : event?.type === 'gmeet' ? 'Google Meet' : event?.type === 'zoom' ? 'Zoom Meeting' : event?.place || event?.type }}
                                                    <br v-if="event?.type === 'offline'">
                                                    <span>{{ event?.address}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <div class="footer">
                                    <template v-if="event?.isEnd">
                                        <span class="text-danger" style="font-size: 12px;">*Kegiatan telah berakhir</span>
                                    </template>
                                    <template v-if="!event?.isEnd">
                                        <a class="btn btn-text-primary" :href="event?.content" target="_blank">
                                            Ikut Kegiatan
                                            <i class="ri-arrow-drop-right-line"></i>
                                        </a>
                                    </template>
                                </div>
                            </b-card>
                            </div>
                        </b-col>
                    <!-- </b-row> -->
                </template>
            </b-col>

            <!-- Right Content -->
            <b-col cols="12" lg="4">

                <b-card class="border card-group" v-if="classOverview?.price > 0">
                    <h4 class="mb-0">Harga Kelas</h4>
                    <h5 class="text-primary">{{ formatRupiah(classOverview?.price) }}</h5>
                </b-card>
                <template v-if="userKind == 'student' || isStepProcess">
                    <template>
                        <div class="d-none d-lg-flex">
                            <template v-if="classOverview?.registered">
                                <b-button
                                    v-if="!classOverview?.userState"
                                    variant="primary"
                                    class="btn-action-add mb-4"
                                    block
                                    @click="btnPretestClick()"
                                >Lihat Pretest</b-button>
                                <b-button
                                    v-else-if="classOverview?.type !== 'test' && classOverview.userState > -1"
                                    variant="primary"
                                    class="btn-action-add mb-4"
                                    block
                                    @click="setActiveTab('courses')"
                                >Mulai Belajar</b-button>
                                <b-button
                                    v-else-if="classOverview?.type === 'test' && classOverview.userState == -1"
                                    variant="primary"
                                    class="btn-action-add mb-4"
                                    block
                                    @click="setActiveTab('assignments')"
                                >Kerjakan Tes</b-button>
                                <template v-if="classOverview.userState == -1">
                                    <div class="card border w-100">
                                        <div class="card-body py-4">
                                            <div class="mb-4">
                                                <h4 class="mb-4">Total pembayaran</h4>

                                                <div class="d-flex flex-row justify-content-between items-center">
                                                    <b-skeleton class="w-100" v-if="isPaymentLoading" />
                                                    <template v-else>
                                                        <p class="font-weight-500 mb-2">Harga kelas</p>
                                                        <p class="font-weight-600 mb-2">{{ formatRupiah(detailPayment?.amount) }}</p>
                                                    </template>
                                                </div>

                                                <div class="d-flex flex-row justify-content-between items-center">
                                                    <b-skeleton class="w-100" v-if="isPaymentLoading" />
                                                    <template v-else>
                                                        <p class="font-weight-500 mb-0">VAT</p>
                                                        <p class="font-weight-600 mb-0">{{ formatRupiah(detailPayment?.vat) }}</p>
                                                    </template>
                                                </div>

                                                <hr class="my-2">

                                                <div class="d-flex flex-row justify-content-between items-center">
                                                    <b-skeleton class="w-100" v-if="isPaymentLoading" />
                                                    <template v-else>
                                                        <p class="font-weight-500 mb-2">Total harga</p>
                                                        <p class="font-weight-600 color-primary mb-2">{{ formatRupiah(detailPayment?.total) }}</p>
                                                    </template>
                                                </div>
                                            </div>

                                            <b-skeleton v-if="isPaymentLoading" class="w-100" />

                                            <template v-else>
                                                <b-button
                                                    variant="primary"
                                                    class="btn-action-add mb-2"
                                                    block
                                                    @click="onClickPayClass()"
                                                >{{ countdownPayment?.isExpired ? 'Bayar ulang' : 'Bayar Sekarang' }}</b-button>

                                                <p :class="[countdownPayment?.isExpired ? 'text-danger' : 'text-primary', 'font-weight-500']">
                                                    {{ countdownPayment?.message }}
                                                </p>
                                            </template>
                                        </div>
                                    </div>
                                </template>
                            </template>
                            <template v-else>
                                <b-button
                                    v-if="comingSoon"
                                    variant="outline-primary"
                                    class="btn-action-add mb-4"
                                    block
                                    disabled
                                >Pendaftaran Belum Dibuka</b-button>
                                <b-button
                                    v-else-if="!onRegistration"
                                    variant="outline-primary"
                                    class="btn-action-add mb-4"
                                    block
                                    disabled
                                >Pendaftaran Ditutup</b-button>
                                <b-button
                                    v-else-if="quotaFull"
                                    variant="outline-primary"
                                    class="btn-action-add mb-4"
                                    block
                                    disabled
                                >Kuota Penuh</b-button>
                                <div class="card border w-100" v-else>
                                    <div class="card-body py-4">
                                        <h3 class="font-weight-600 mb-4">{{ classOverview?.price > 0 ? formatRupiah(classOverview?.price) : 'Gratis' }}</h3>

                                        <b-skeleton v-if="isPaymentLoading" class="w-100" />

                                        <template v-else>
                                            <b-button
                                                variant="primary"
                                                class="btn-action-add"
                                                block
                                                @click="btnClassClick()"
                                            >Daftar Sekarang</b-button>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </template>
                </template>

                <template v-else>
                    <b-btn
                        id="btn-start-class"
                        v-if="classOverview?.state === 'draft'"
                        class="btn-action-add w-100 mb-4 w-100"
                        variant="primary"
                        @click="togglePublishClass"
                    >
                        Terbitkan Kelas
                    </b-btn>

                    <!-- <ButtonDropdownFilter
                        v-if="!classOverview?.hasPretest"
                        class="w-100"
                        toggleClass="btn-action-add w-100 mb-4"
                        menuClass="w-100"
                        variant="primary"
                        text="Tambah Pretest / Posttest"
                        :noDefaultValue="true"
                        :items="addPretestMenu"
                        @onChange="selectedMenuPretest"
                        id="btn-add-pretest"/> -->

                    <!-- <template v-if="!classOverview?.hasPretest && classOverview?.state === 'draft'">
                        <b-button
                            variant="primary"
                            class="btn-action-add mb-4"
                            @click="selectedMenuPretest({ value: 'pretest' })"
                            block>Tambah Pretest</b-button>
                    </template> -->

                    <b-button
                        v-if="classOverview?.hasPretest"
                        variant="primary"
                        class="btn-action-add mb-4"
                        block
                        @click="btnPretestClick()"
                    >Lihat Pretest</b-button>

                    <b-button
                        v-if="classOverview?.hasPretest && classOverview?.pretest && classOverview?.state === 'release'"
                        variant="outline-primary"
                        class="btn-action-add mb-4"
                        @click="isPublishPretest = true"
                        block>Terbitkan Pengumuman</b-button>
                </template>

                <!-- <template v-if="!classOverview?.alwaysOpen">
                    <div class="d-none d-lg-block">
                        <template v-if="classOverview?.attendanceId == 0 && (userKind == 'admin' || userKind == 'superadmin' || userKind == 'mentor') && !classEnded">
                            <b-button
                                variant="primary"
                                class="btn-action-add mb-4"
                                @click="attendanceAction(classOverview, 'create')"
                                block>Buat Absen</b-button>
                        </template>

                        <template v-if="classOverview?.attendanceId != 0 && (userKind == 'admin' || userKind == 'superadmin' || userKind == 'mentor')">
                            <b-button
                                variant="outline-primary"
                                class="btn-action-add mb-4"
                                @click="attendanceAction(classOverview, 'recap')"
                                block>Rekap Absensi</b-button>
                        </template>

                        <template v-if="classStarted && !classEnded && classOverview?.userState">
                            <template v-if="classOverview?.attendanceId != 0 && userKind == 'student' && classOverview?.registered && attendanceStatus?.value == 0">
                                <b-button
                                    variant="primary"
                                    class="btn-action-add mb-4"
                                    @click="attendanceAction(classOverview, 'attendIn')"
                                    block>Absen Masuk</b-button>
                            </template>

                            <template v-if="classOverview?.attendanceId != 0 && userKind == 'student' && classOverview?.registered && attendanceStatus?.value == 1 && attendanceStatus?.status == 0">
                                <b-button
                                    variant="primary"
                                    class="btn-action-add mb-4"
                                    @click="attendanceAction(classOverview, 'attendIn')"
                                    block>Absen Keluar</b-button>
                            </template>

                            <template v-if="classOverview?.attendanceId != 0 && userKind == 'student' && classOverview?.registered && attendanceStatus?.value == 1 && attendanceStatus?.status == 1">
                                <b-button
                                    variant="primary"
                                    class="btn-action-add mb-4"
                                    @click="attendanceAction(classOverview, 'attendIn')"
                                    block>Lihat Absen</b-button>
                            </template>
                        </template>

                        <template v-if="classOverview?.attendanceId != 0 && (userKind == 'admin' || userKind == 'superadmin' || userKind == 'mentor') && !classEnded">
                            <b-card class="border card-group">
                                <div class="d-flex align-items-center justify-content-between box-title">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h4 class="mb-0">QR Code</h4>
                                    </div>

                                    <b-button
                                        variant="primary"
                                        class="btn-action"
                                        pill
                                        style="font-size: .875rem"
                                        @click="onGenerateQR"
                                    >Buat</b-button>
                                </div>
                            </b-card>
                            <b-card class="border card-group">
                                <b-row>
                                    <b-col cols="12" md="4" class="position-relative cursor-pointer" @click="onGenerateQR">
                                        <VueQRCodeComponent
                                            v-if="!isQRBusy"
                                            :text="urlQR"
                                            :size="sizeQR"
                                            error-level="L"
                                            color="#666666"
                                        />
                                        <div class="view-qr d-flex justify-content-center align-items-center">
                                            <span><i class="ri-eye-fill"></i></span>
                                        </div>
                                    </b-col>
                                    <b-col cols="12" md="8">
                                        <h5 class="mb-1 d-flex align-items-center flex-row gap-1 cursor-pointer" @click="onGenerateQR">
                                            Generate QR Code
                                            <i class="ri-refresh-line"></i>
                                        </h5>
                                        <p style="font-size: 12px">Gunakan QR Code untuk memudahkan peserta melakukan absensi</p>
                                    </b-col>
                                    <b-col cols="12">
                                        <div hidden>
                                            <VueQRCodeComponent
                                                ref="qrVariant"
                                                :text="urlQR"
                                                :size="800"
                                                error-level="L"
                                            />
                                        </div>
                                        <b-button
                                            variant="primary"
                                            class="btn-action mt-3"
                                            block
                                            @click="onDownloadQR"
                                        >Download QR</b-button>
                                    </b-col>
                                </b-row>
                            </b-card>
                        </template>
                    </div>
                </template> -->

                <template v-if="(userKind != 'student' || classOverview?.registered) && classOverview?.discussionLink">
                    <!-- <a
                        :href="classOverview?.discussionLink"
                        target="_blank"
                        class="btn btn-primary btn-block btn-action-add mb-4"
                    >Forum Diskusi</a> -->

                    <!-- <b-card class="border card-group">
                        <div class="d-flex align-items-center justify-content-between box-title">
                            <div class="d-flex align-items-center justify-content-between">
                                <h4 class="mb-0">Forum Diskusi</h4>
                            </div>

                            <a
                                :href="classOverview?.discussionLink"
                                target="_blank"
                                class="btn btn-primary rounded-pill btn-join"
                            >Gabung</a>
                        </div>
                    </b-card> -->
                </template>

                <b-card v-if="(userKind == 'student' && inputGrup) || userKind != 'student'" class="border card-group">
                    <div class="d-flex align-items-center justify-content-between box-title">
                        <div class="d-flex align-items-center justify-content-between">
                            <h4 class="mb-0">Gabung grup diskusi</h4>
                            <i v-if="userKind == 'student' && !classOverview?.registered" class="ri-git-repository-private-line ml-3"></i>
                        </div>

                        <a
                            v-if="userKind == 'student' && classOverview?.registered && inputGrup"
                            :href="inputGrup"
                            target="_blank"
                            class="btn btn-primary rounded-pill btn-join"
                        >Gabung</a>
                    </div>

                    <template v-if="userKind != 'student'">
                        <div v-if="!isFormGroup && !isLoadGroupLink" class="d-flex align-items-center">

                            <a v-if="inputGrup" :href="inputGrup" class="link-group text-limit limit-1 mr-2" target="_blank">{{ inputGrup }}</a>
                            <a v-else href="#" class="text-limit limit-1 mr-2" @click="toggleFormGroup">Tambahkan Link Grup</a>

                            <b-button class="btn-no-styles btn-pencil" @click="toggleFormGroup">
                                <i class="ri-pencil-line"></i>
                            </b-button>

                        </div>

                        <b-form v-else-if="isFormGroup && !isLoadGroupLink" @submit="submitGroupLink" class="d-flex align-items-center">
                            <b-input-group size="md">

                                <b-form-input ref="inputGrup" v-model="inputGrup" type="url" placeholder="Tambahkan Link Grup..." class="input-grup" required @blur="blurInput"></b-form-input>

                                <b-button size="sm" class="btn-no-styles" type="submit" hidden>
                                    <i class="fas fa-file"></i>
                                </b-button>

                            </b-input-group>
                        </b-form>

                        <b-skeleton v-else width="100%"></b-skeleton>
                    </template>

                </b-card>

                <template v-if="isMentorLoaded">
                    <b-card v-if="(listMentor?.length != 0 && userKind == 'student') || userKind != 'student'" class="border card-users">

                        <div class="d-flex align-items-center justify-content-between box-title">
                            <h4 class="mb-0">Mentor</h4>
                            <b-button
                                v-if="userKind == 'admin' || userKind == 'superadmin' || userKind === 'lead_region'"
                                variant="outline-primary"
                                size="sm"
                                @click="isAddMentor = true">
                                <i class="fas fa-plus mr-3"></i>Tambah Mentor
                            </b-button>
                        </div>

                        <div v-for="(item, index) in listMentor" :key="index" class="box-users">

                            <div class="box-img">
                                <div class="img-container">
                                    <img v-if="item?.photo" :src="item?.photo" alt="Profile Mentor" class="img-profile">
                                    <h5 v-else class="name">{{ item?.name.charAt(0) }}</h5>
                                </div>
                            </div>

                            <div class="box-profile">
                                <h5 :class="`text-limit ${ item?.job ? 'limit-1' : '' }`">{{ item?.name }}</h5>
                                <p v-if="item?.job" class="text-limit limit-1">{{ item?.job }}</p>
                            </div>

                            <button
                                v-if="userKind == 'admin' || userKind == 'superadmin' || userKind === 'lead_region'"
                                class="btn-remove btn-no-styles"
                                @click="toggleRemoveMentor(item)">
                                <i class="ri-delete-bin-7-line text-danger"></i>
                            </button>

                        </div>

                    </b-card>
                </template>

                <b-card v-else class="border card-users">

                    <div class="d-flex align-items-center justify-content-between box-title">
                        <b-skeleton width="50%"></b-skeleton>
                    </div>

                    <div class="box-users">

                        <div class="box-img">
                            <b-skeleton type="avatar"></b-skeleton>
                        </div>

                        <div class="box-profile">
                            <b-skeleton width="100%"></b-skeleton>
                            <b-skeleton width="100%"></b-skeleton>
                        </div>

                    </div>

                </b-card>


                <b-card v-if="classOverview?.preClass?.id && classOverview?.preClass?.id !== -1" class="border preclass-wrapper">
                    <h4 class="" style="margin-bottom: 12px">Prasyarat Kelas</h4>
                    <div class="box-body">
                        <nuxt-link :to="`/dashboard/classroom/${classOverview?.preClass?.slug}`">
                            <span class="badge-gray">{{ classOverview?.preClass?.name }}</span>
                        </nuxt-link>
                    </div>
                </b-card>

            </b-col>

        </b-row>

        <!-- Loading State -->
        <b-row v-else>
            <b-col cols="12" lg="8">

                <b-card class="border card-logo">
                    <b-skeleton-img no-aspect height="150px"></b-skeleton-img>
                </b-card>

                <b-row>
                    <b-col cols="12" md="6">
                        <b-card class="border">
                            <b-skeleton width="50%"></b-skeleton>
                            <b-skeleton width="80%"></b-skeleton>
                        </b-card>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-card class="border">
                            <b-skeleton width="50%"></b-skeleton>
                            <b-skeleton width="80%"></b-skeleton>
                        </b-card>
                    </b-col>
                </b-row>

                <b-card class="border" body-class="p-4">
                    <b-skeleton width="100%" class="mb-3"></b-skeleton>
                    <b-skeleton width="50%"></b-skeleton>
                    <b-skeleton width="80%"></b-skeleton>
                    <b-skeleton width="40%"></b-skeleton>
                </b-card>

            </b-col>
        </b-row>

        <ModalGenerateQR
            :url="urlQR"
            :onOpenModal="isShowQR"
            @openModal="onGenerateQR"
        />

        <b-modal v-model="isShowTags" size="md" centered hide-header hide-footer body-class="p-0">
            <ModalShowTags
                :selectedTags="selectedTags"
            />
        </b-modal>

        <b-modal v-model="isConfirmPrestest" size="md" centered hide-header hide-footer body-class="p-0">
            <ModalConfirmation
                :title="modalData?.title"
                :description="modalData?.description"
                :btnYesVariant="modalData?.btnYesVariant"
                @actionYes="$router.push(`/dashboard/classroom/${ classOverview?.id }/pretest/create?fromOverview=true`)"
                @actionNo="isConfirmPrestest = false"/>
        </b-modal>
        <b-modal v-model="isPrestestDenied" size="md" centered hide-header hide-footer body-class="p-0">
            <ModalConfirmation
                :title="modalDataPretestDenied?.title"
                :description="modalDataPretestDenied?.description"
                btnYesHide
                :btnNoVariant="modalDataPretestDenied?.btnNoVariant"
                :btnNoTitle="modalDataPretestDenied?.btnNoTitle"
                @actionNo="isPrestestDenied = false"/>
        </b-modal>
        <b-modal v-model="isPublishPretest" size="md" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc body-class="p-0">
            <ModalConfirmation
                title="Anda Yakin Akan Menerbitkan Pengumuman <strong>Pretest</strong> ?"
                btnYesVariant="primary"
                btnNoVariant="outline-gray"
                withForm
                @onSubmitForm="onPublishPretest"
                @actionNo="isPublishPretest = false"/>
        </b-modal>
        <b-modal v-model="isConfirmRemoveMentor" size="md" centered hide-header hide-footer body-class="p-0">
            <ModalConfirmation
                title="Peringatan!"
                :description="`<p class='text-break'>Apakah anda yakin akan menghapus <strong>${ selectedToRemove?.name }</strong>?</p>`"
                btnYesVariant="danger"
                @actionYes="removeMentor"
                @actionNo="toggleRemoveMentor(null)"/>
        </b-modal>
        <b-modal v-model="isConfirmEnroll" size="md" centered hide-header hide-footer body-class="p-0">
            <ModalConfirmation
                title="Konfirmasi Pendaftaran!"
                :description="`<p class='text-break'>Apakah anda yakin akan mendaftar di kelas <strong>${ classOverview?.name }</strong>?</p>`"
                btnYesVariant="primary"
                btnNoVariant="danger"
                :btnYesTitle="`${modalLoading ? 'Proses mendaftar kelas...' : 'Ya, Saya Yakin'}`"
                :btnYesDisabled="modalLoading"
                :btnNoHide="modalLoading"
                :footerMessage="classOverview?.level > 1 ? `<p class='danger-message'>*Kamu harus mengikuti <span class='text-primary'>Kelas Persiapan</span> dulu nih` : ''"
                @actionYes="btnModalAction(true)"
                @actionNo="btnModalAction(false)"/>
        </b-modal>

        <b-modal v-model="isCannotRegister" size="md" centered hide-header hide-footer body-class="p-0">
            <ModalConfirmation
                title="Maaf, Kamu Belum Bisa Mendaftar di Kelas ini :("
                :description="registErrMessage"
                btnYesVariant="primary"
                btnYesTitle="OK"
                :btnNoHide="true"
                @actionYes="isCannotRegister = false"/>
        </b-modal>

        <b-modal v-model="finishPreparationClass" size="md" centered hide-header hide-footer body-class="p-0">
            <ModalConfirmation
                title="Maaf, Kamu Belum Bisa Mendaftar di Kelas ini :("
                :description="
                    `<p class='text-break'>
                        Kamu harus menyelesaikan
                        <span class='text-danger'>Kelas ${classOverview?.level === 3 ? 'Online' : classOverview?.level === 2 ? 'Persiapan' : ''}</span>
                        dulu
                    </p>`
                "
                btnYesVariant="danger"
                btnYesTitle="Oke, Aku Selesaikan"
                :btnYesDisabled="modalLoading"
                btnNoHide
                @actionYes="btnModalFinishPreparationClass()"
            />
        </b-modal>
        <b-modal v-model="isAddMentor" size="lg" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc>
            <ModalInviteUsers
                :classroomId="classOverview?.id"
                :classroomSlug="classOverview?.slug"
                @actionNo="isAddMentor = false"
                @actionYes="fetchListMentor"/>
        </b-modal>

        <b-modal v-model="isModalConfirm" size="sm" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc body-class="p-0">
            <ModalConfirmation
                :title="modalConfirmData?.title"
                :description="modalConfirmData?.description"
                :btnYesVariant="modalConfirmData?.btnYesVariant"
                :btnYesTitle="modalConfirmData?.btnYesTitle"
                :centered="true"
                :btnNoHide="isModalConfirmProcessDenied"
                :btnYesDisabled="isModalConfirmProcess"
                @actionYes="modalConfirmData?.type === 'dismis' ? isModalConfirm = false : publishClass()"
                @actionNo="isModalConfirm = false"/>
        </b-modal>
    </section>
</template>

<script>
import { mapActions, mapState } from "vuex"
import moment from 'moment'
import VueQRCodeComponent from 'vue-qrcode-component'
import { toDate, toEncrypt, toDateTimes, formatRupiah } from "@/commons/utils/."

import customFunction from "@/store/customFunction.js"
import ButtonDropdownFilter from "@/components/template/micro/buttons/ButtonDropdownFilter.vue";
import ModalConfirmation from "~/components/template/micro/modal/ModalConfirmation.vue";
import ModalInviteUsers from "~/components/template/micro/modal/ModalInviteUsers.vue";
import ModalShowTags from "~/components/template/micro/modal/ModalShowTags.vue";
import ModalGenerateQR from "~/components/classrooms/micro/modal/ModalGenerateQR.vue";
import appToken from '~/api/app-token'

const UPDATE_GROUPLINK = 'updateGroupLink'

export default {
    props: {
        isComponentLoaded: {
            type: Boolean,
            default: false
        },
        classCode: {
            type: String,
            default: '',
        },
        detailOverview: {
            type: Object,
            default: {},
        },
        isStepProcess: {
            type: Boolean,
            default: false
        }
    },

    components: { ButtonDropdownFilter, ModalConfirmation, ModalInviteUsers, ModalShowTags, ModalGenerateQR, VueQRCodeComponent },

    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            meetState: (state) => state.Meets,
            sassState: (state) => state.Sass,
            attendanceStatus: (state) => state.Services?.attendanceStatus,
            paymentState: (state) => state.Payment,
            enrollResult: state => state.Services?.enrollResult
        })
    },

    data() {
        return {
            userKind: localStorage.getItem('user_kind'),
            alertMessage: "",

            classEvents: [],
            isLoaded: false,
            isMentorLoaded: false,
            isTestCase: false,
            isFormGroup: false,
            isLoadGroupLink: false,
            isConfirmPrestest: false,
            isPrestestDenied: false,
            isConfirmRemoveMentor: false,
            isAddMentor: false,
            isPublishPretest: false,
            isShowTags: false,
            isShowQR: false,

            screenWidth: 0,
            urlQR: '',
            sizeQR: 80,
            isQRBusy: true,

            isModalConfirmProcessDenied: false,
            isModalConfirmProcess: false,
            isModalConfirm: false,

            isCannotRegister: false,
            registErrMessage: "",
            classSlug : "",
            selectedTags: null,
            alertStatus: false,
            modalLoading: false,
            isConfirmEnroll: false,
            quotaPercentage: "0%",
            quotaFull: false,
            onRegistration: false,
            comingSoon: false,
            classStarted: false,
            classEnded: false,

            classOverview: null,
            classSyllabus: null,
            requirementFields: null,
            finishPreparationClass: false,

            actionSelected: null,
            inputGrup: null,
            listMentor: [],
            selectedToRemove: null,
            actionOptions: [
                {
                    label: "Tambah Prestest",
                    value: "pretest"
                },
                {
                    label: "Tambah Posttest",
                    value: "posttest"
                }
            ],

            addPretestMenu: [
                {
                    value: 'pretest',
                    label: 'Pretest'
                },
                {
                    value: 'posttest',
                    label: 'Posttest'
                },
            ],

            modalConfirmData: {
                title: "",
                description: '',
                btnYesTitle: "Ya, Saya Yakin",
                btnYesVariant: "primary",
                type: ""
            },

            modalData: {
                title: "Anda Yakin Menambahkan <strong>Pretest</strong> di Kelas ini?",
                description: "<p>Perhatikan Hal di Bawah ini :</p><ul><li>Pastikan kelas dalam status “<strong>Draft</strong>”</li><li>Anda hanya bisa membuat <strong>satu</strong> pretest tiap kelas</li></ul>",
                btnYesVariant: "primary"
            },
            modalDataPretestDenied: {
                title: "Maaf, Anda Tidak Dapat Menambahkan Pretest",
                description: "<p>Perhatikan Hal di Bawah ini :</p><ul><li>Anda tidak dapat menambahkan pretest ketika kelas berlangsung</li></ul>",
                btnNoVariant: "danger",
                btnNoTitle: "Oke",
            },

            prerequisiteClass: null,
            isPreClassLoaded: false,

            detailPayment: null,
            isClassPaid: false,
            isPaymentLoading: false,

            countdownPayment: null
        }
    },

    mounted() {
        this.isTestCase = this.sassState.isTestCase
        this.checkComponentLoaded()
        this.handleResize()
    },

    watch: {
        isComponentLoaded() {
            this.checkComponentLoaded()
        },
        screenWidth() {
            this.isQRBusy = true

            if (this.screenWidth <= 480) {
                this.sizeQR = this.screenWidth - 100
            } else {
                this.sizeQR = 80
            }

            setTimeout(() => {
                this.isQRBusy = false
            }, 100)
        }
    },

    methods: {
        ...mapActions({
            getMeets: 'Meets/getMeetsV2',
            publishClassroom: "Services/classroomRelease",
            getAttendanceStatus: "Services/getClassAttendanceStatus",
            setActiveTab: 'Layouts/setActiveTab',
            fetchClassPaymentInvoice: 'Payment/fetchClassPaymentInvoice',
            postClassRepay: 'Payment/postClassRepay'
        }),
        onDetailClickEvent(event) {
            localStorage.setItem('eventId', toEncrypt(event.id))
            localStorage.setItem('classId', toEncrypt(this.classOverview.id))
            this.$router.push(`/dashboard/classroom/${this.classOverview.slug}/event/${event?.slug}`)
        },
        toDateTimes,
        toDate,
        formatRupiah,

        /**
            * Calculate time remaining or expiration status
            * @param {string} created_at - ISO date string of creation time
            * @param {number} hours - Number of hours for countdown
            * @returns {Object} Countdown details
        */
        calculateCountdown(created_at, hours) {
            // Parse the created_at date
            const createdDate = new Date(created_at);

            // Calculate the target date by adding specified hours to creation date
            const targetDate = new Date(createdDate.getTime() + (hours * 60 * 60 * 1000));

            // Get current time
            const now = new Date();

            // Calculate time difference
            const timeDiff = targetDate.getTime() - now.getTime();

            // Check if expired
            if (timeDiff <= 0) {
                return {
                    isExpired: true,
                    status: 'Expired',
                    message: 'Pembayaran telah kadaluwarsa. Silahkan tekan tombol bayar ulang untuk memproses ulang pembayaran.',
                    remainingTime: null,
                    progress: 100
                };
            }

            // Calculate remaining time
            const remainingHours = Math.floor(timeDiff / (1000 * 60 * 60));
            const remainingMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const remainingSeconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            // Calculate progress percentage
            const totalDuration = hours * 60 * 60 * 1000;
            const elapsedTime = totalDuration - timeDiff;
            const progress = Math.min(Math.max((elapsedTime / totalDuration) * 100, 0), 100);

            return {
                isExpired: false,
                status: 'Active',
                remainingTime: {
                    hours: this.padZero(remainingHours),
                    minutes: this.padZero(remainingMinutes),
                    seconds: this.padZero(remainingSeconds)
                },
                totalSeconds: Math.floor(timeDiff / 1000),
                progress: Math.round(progress),
                message: `Lakukan pembayaran sebelum ${remainingHours}:${remainingMinutes}`
            };
        },

        /**
         * Pad single digit numbers with a leading zero
         * @param {number} num - Number to pad
         * @returns {string} Padded number
         */
        padZero(num) {
            return num.toString().padStart(2, '0');
        },

        handleVisibilityChange(){
            // When page visible to user
            if(document.visibilityState === 'visible') this.onClickCheckPaymentStatus()
        },

        async initiatePaymentChecker(){
            // track user activity when leaving and entering the application
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
        },

        async onClickPayClass() {
            if (this.detailPayment) {
                if (this.countdownPayment?.isExpired) {
                    await this.onClassRepay()
                } else {
                    window.open(this.detailPayment.payment_link, '_blank')
                }
            } else {
                alert('Tidak ada pembayaran yang ditemukan')
            }
        },

        async onClickCheckPaymentStatus() {
            await this.getClassPayment()
            await this.getClassroomOverview()
        },

        async onClassRepay() {
            this.isPaymentLoading = true

            try {
                const class_slug = this.$route.params.classroom

                if (class_slug) {
                    await this.postClassRepay(class_slug)

                    if(!this.paymentState.status) {
                        console.error('Failed fetch class payment', this.paymentState.message)
                        this.setEvent(this.paymentState.message, false)
                    } else {
                        this.detailPayment = this.paymentState.classPaymentInvoice

                        console.log('Payment detail:', this.detailPayment)

                        this.countdownPayment = this.calculateCountdown(this.detailPayment?.created_at, this.detailPayment?.expiry)

                        return this.detailPayment
                    }
                }
            } catch (error) {
                return this.setEvent(error, false)
            } finally {
                this.isPaymentLoading = false
            }
        },

        async getClassPayment() {
            this.isPaymentLoading = true

            try {
                const class_slug = this.$route.params.classroom

                if (class_slug) {
                    await this.fetchClassPaymentInvoice(class_slug)

                    if(!this.paymentState.status) {
                        console.error('Failed fetch class payment', this.paymentState.message)
                        this.setEvent(this.paymentState.message, false)
                    } else {
                        this.detailPayment = this.paymentState.classPaymentInvoice

                        this.countdownPayment = this.calculateCountdown(this.detailPayment?.created_at, this.detailPayment?.expiry)

                        return this.detailPayment
                    }
                }
            } catch (error) {
                return this.setEvent(error, false)
            } finally {
                this.isPaymentLoading = false
            }
        },

        togglePublishClass() {
            this.modalConfirmData.description = `<h5>Anda Yakin Akan Menerbitkan Kelas <span class='text-primary' style='font-size: inherit;'>${ this.classOverview?.name }</span> ini?<h5>`
            this.modalConfirmData.type = ''
            this.isModalConfirmProcessDenied = false
            this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
            this.isModalConfirm = !this.isModalConfirm
        },

        publishClass() {
            this.isModalConfirmProcess = true
            this.isModalConfirmProcessDenied = true
            this.modalConfirmData.btnYesTitle = `Loading...`
            this.modalConfirmData.description = `<h5>Anda Yakin Akan Menerbitkan Kelas <span class='text-primary' style='font-size: inherit;'>${ this.classOverview?.name }</span> ini?<h5>`

            this.publishClassroom(this.classOverview?.id).then(() => {
                if (this.servicesState?.status) {
                    this.$router.go(-1)
                } else {
                    this.modalConfirmData.description += `<p class='text-danger mt-5'>Maaf gagal menerbitkan kelas: ${ this.servicesState?.message }</p><p>* Pastikan semua data yang dibutuhkan untuk membuat kelas sudah terisi!</p>`
                    this.modalConfirmData.type = 'dismis'
                }
                this.isModalConfirmProcess = false
                this.modalConfirmData.btnYesTitle = `Oke`
            })
        },

        async getListMeets() {
            await this.getMeets(this.classOverview.slug).then(() => {
                this.classEvents = this.meetState?.meets || []; // Ensure classEvents is updated with fetched data
                this.isEventLoaded = true;

            }).catch(error => {
                console.error('Failed to fetch meets:', error);
            });
        },

        checkComponentLoaded(){
            this.classOverview = this.detailOverview
            if (this.isComponentLoaded && this.classOverview) {
                this.processingDataOverview();

                if (this.classOverview.kind === "event") {
                    this.getListMeets();
                }
            } else if (this.isComponentLoaded && !this.classOverview) {
                this.getClassroomOverview();

                if (this.classOverview?.kind === "event") {
                    this.getListMeets();
                }
            } else {
                this.isLoaded = false;
            }

            // Activate payment checker when student is registered and not yet paid
            if (this.classOverview) {
                if (this.classOverview?.registered && this.classOverview?.userState === -1) {
                    this.getClassPayment()
                    this.initiatePaymentChecker()
                }
            }
        },

        async getClassroomOverview(state = null){

            if (state == UPDATE_GROUPLINK) this.isLoadGroupLink = true
            else {
                this.isLoaded = false
                this.isAddMentor = false
            }

            await this.$store.dispatch('Services/classroomOverview', this.classCode);

            if(!this.servicesState.status) {

                console.error('Failed fetch classroom overview', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)

                this.isLoaded = false

            } else {
                if (state == UPDATE_GROUPLINK) {
                    this.classOverview.groupLink = this.servicesState?.data?.groupLink ?? null
                    this.inputGrup = (this.classOverview?.groupLink && this.classOverview?.groupLink != '#') ? this.classOverview?.groupLink : null
                    this.isLoadGroupLink = false
                    this.isFormGroup = false
                    return
                }

                this.classOverview = this.servicesState.data

                this.processingDataOverview();
            }
        },

        async fetchListMentor() {
            this.isMentorLoaded = false
            this.isAddMentor = false

            const params = {
                classroomSlug: this.classOverview?.slug,
                joined: true
            }

            await this.$store.dispatch('Services/classroomMentors', params);

            if(!this.servicesState.status) {

                console.error('Failed fetch classroom mentor', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)

                this.isMentorLoaded = false

            } else {

                this.isMentorLoaded = true
                this.listMentor = this.servicesState?.data ?? []

            }
        },

        processingDataOverview(){
            // Class Requirements
            const classRequirement = this.classOverview.requirementFields ?? []
            let requirements = {}

            classRequirement.map((fields) => {
                requirements[`${fields}`] = null
            })

            if (classRequirement.length == 0) this.requirementFields = null
            else this.requirementFields = requirements
            // Tags Class
            if (this.classOverview.tags && this.classOverview.tags != '') {

                var array = this.classOverview.tags.split(',')
                this.classOverview.tagList = []

                array.map((data) => {
                    if (data.trim() != '') this.classOverview.tagList.push(data)
                })

            } else {

                this.classOverview.tagList = []

            }

            // Generate QR Attendance
            this.generateQR()

            // Coming Soon
            this.comingSoon = this.classOverview.classState.comingSoon

            // Close Registration
            this.onRegistration = this.classOverview.classState.onRegistration

            // Class Started
            this.classStarted = this.classOverview.classState.started

            // Class Ended
            this.classEnded = this.classOverview.classState.ended

            // Quota Full
            if (this.classOverview.quota == this.classOverview.totalStudent) this.quotaFull = true

            // Set Quota Percentage
            this.quotaPercentage = (this.classOverview.totalStudent / this.classOverview.quota * 100) + "%"

            // Url Grup
            this.inputGrup = (this.classOverview?.groupLink && this.classOverview?.groupLink != '#') ? this.classOverview?.groupLink : null

            // Attendance Status
            if (this.classOverview?.attendanceId && this.userKind === 'student') {
                this.getAttendanceStatus(this.classOverview?.id)
            }

            this.isLoaded = true;

            this.fetchListMentor();
        },

        async removeMentor() {
            this.isMentorLoaded = false

            const params = {
                classroomId: this.classOverview?.id,
                userId: this.selectedToRemove?.id
            }

            await this.$store.dispatch('Services/classroomRemoveMentor', params);

            if(!this.servicesState.status) {

                console.error('Failed remove mentor from classroom', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)

                this.isMentorLoaded = false

            } else {

                this.isConfirmRemoveMentor = false
                this.fetchListMentor()

            }
        },

        async getClassroomSyllabus() {

            await this.$store.dispatch('Services/classroomSyllabus', this.classOverview.id);

            if(!this.servicesState.status) {

                console.error('Failed fetch classroom overview', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.isLoaded = false

            } else {

                this.isLoaded = true
                this.classSyllabus = this.servicesState.data

            }

        },

        btnClassClick(){
            if (this.isStepProcess) return

            let res = 'classroom'

            if (this.userKind == 'student') {

                if (this.isTestCase) res = 'tes/assignments'

                if (this.classOverview.registered) this.$router.push(`/dashboard/${res}/${this.classOverview.id}`);
                else {
                    this.isLoaded = true

                    if (this.classOverview?.meetLevels) {
                        if (this.requirementFields != null) this.$router.push(`/dashboard/classroom/requirements/${this.classOverview.slug}`)
                        else this.isConfirmEnroll = true
                    }else {
                        this.finishPreparationClass = true
                    }


                }

            } else {

                if (this.isTestCase) res = 'tes'
                this.$router.push(`/dashboard/${res}/${this.classOverview.id}`);

            }

        },

        btnModalFinishPreparationClass() {
            this.finishPreparationClass = false

            this.$router.push('/dashboard/')
        },

        btnModalAction(action) {

            if (action) this.enrollClass(this.classOverview?.code)
            else this.isConfirmEnroll = !this.isConfirmEnroll

        },

        async enrollClass(code) {
            this.modalLoading = true
            const params = { code: code }

            await this.$store.dispatch('Services/classroomEnroll', params)

            console.log(this.enrollResult, " enroll result")

            if (!this.servicesState.status) {

                console.error('failed to enroll classroom: ', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)

                this.modalLoading = false;
                this.isConfirmEnroll = !this.isConfirmEnroll
                this.registErrMessage = this.servicesState.message
                const errPreClassMessage = "kelas prasyarat";
                if(this.classOverview?.preClass && this.registErrMessage.toLowerCase().includes(errPreClassMessage.toLowerCase())){
                    this.registErrMessage = `<p>Anda belum menyelesaikan kelas prasyarat <a class='nav-prasyarat' href='/dashboard/classroom/${this.classOverview?.preClass?.slug}' style='color: var(--bs-primary); font-size: 14px;'>${this.classOverview?.preClass?.name}!</a></p>`
                }else if (this.classOverview?.schools?.length > 0) {
                    this.registErrMessage = "<p>Sekolahmu belum terdaftar di program ini!<br>Untuk mengikuti program ini, hubungi Admin SMK Coding melalui : <br><br>WhatsApp <a href='https://wa.me/6282131362595' target='_blank'>admin</a><br>Instagram <a href='https://instagram.com/smkcoding.id' target='_blank'>@smkcoding.id</a>, atau<br>Email <a href='mailto:admin@smkcoding.id'>admin@smkcoding.id</a></p>"
                }else{
                    this.registErrMessage = `<p>${this.registErrMessage}</p>`;
                }
                this.isCannotRegister = true

            } else {

                setTimeout(() => {

                    this.modalLoading = false
                    this.btnModalAction(false)
                    // this.getClassroomOverview()

                    this.$emit('fetchOverview')

                    console.log(this.classOverview, " class overview")

                    if(this.classOverview?.userState === -1){
                        this.setActiveTab('overview')
                    } else {
                        let tab = "overview"
                        if(this.classOverview?.type !== 'tes' && this.classOverview?.price === 0) tab = "courses"

                        this.setActiveTab(tab)
                    }

                    let res = 'classroom'

                    if (this.isTestCase) res = 'tes/assignments'
                    // else if (!this.classOverview.userState) res = 'classroom/assignments'

                    console.log(this.servicesState)
                    if(this.classOverview?.price > 0 ) {
                        console.log(this.enrollResult?.data?.payment_link)

                        window.open(this.enrollResult?.data?.payment_link, '_blank')
                    } else {
                        this.$router.push(`/dashboard/${res}/${this.classOverview.id}`)
                    }

                }, 1000);

            }

        },

        async submitGroupLink(event) {
            event.preventDefault()

            this.isLoadGroupLink = true
            const params = { groupLink: this.inputGrup }
            const payloads = {
                classroomId: this.classOverview?.id,
                params: params
            }

            await this.$store.dispatch('Services/editClassroom', payloads)

            if (!this.servicesState?.status) console.error(`Failed edit grouplink: ${this.servicesState?.message}`)
            else {
                this.getClassroomOverview(UPDATE_GROUPLINK)
            }
        },

        async onPublishPretest({event, inputForm}) {
            event.preventDefault()
            const params = {
                classroomId: this.classOverview?.id,
                minScore: parseInt(inputForm)
            }

            await this.$store.dispatch('Services/classroomPublishPretest', params);

            if (!this.servicesState.status) {

                console.error('failed publish pretest', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isPublishPretest = false

            } else {
                this.isPublishPretest = false
                this.getClassroomOverview()
            }
        },

        blurInput() {
            this.isFormGroup = false
            this.inputGrup = (this.classOverview?.groupLink && this.classOverview?.groupLink != '#') ? this.classOverview?.groupLink : null
        },

        toggleRemoveMentor(item) {
            this.isConfirmRemoveMentor = !this.isConfirmRemoveMentor
            if (this.isConfirmRemoveMentor) this.selectedToRemove = item
            else this.selectedToRemove = null
        },

        toggleFormGroup() {
            this.isFormGroup = !this.isFormGroup
            setTimeout(() => {
                if (this.isFormGroup) this.$refs['inputGrup']?.focus()
            }, 100);
        },

        setEvent(message, status) {
            this.alertMessage = message
            this.alertStatus = status
        },

        beautifyDate(date, format) {
            // moment.locale('id');
            return moment(date).format(format === 'd-m' ? 'DD MMM hh:mm A' :'DD MMM YYYY hh:mm A')
        },

        generateStatusBadge(data, state) {
            return customFunction.statusClass(data,state)
        },

        selectedMenuPretest(data) {
            localStorage.setItem('classId', toEncrypt(this.classOverview?.id))

            if (data?.value === 'pretest') {
                if (this.classOverview?.state === 'release') this.isPrestestDenied = true
                else this.isConfirmPrestest = true
            }
        },
        selectedObjectTags(title, data){
            this.isShowTags = true;
            this.selectedTags = {
                title: title,
                tags: data,
            }
        },
        async attendanceAction(classOverview, action) {
            localStorage.setItem('classId', toEncrypt(classOverview?.id))
            localStorage.setItem('attendanceMode', toEncrypt(classOverview?.mode))

            if (action == 'create') {
                localStorage.setItem('startDate', toEncrypt(classOverview?.start))
                localStorage.setItem('endDate', toEncrypt(classOverview?.end))
                this.$router.push(`/dashboard/classroom/${classOverview?.slug}/attendance/create`)
            }

            if (action == 'edit') {
                localStorage.setItem('attendanceId', toEncrypt(classOverview?.attendanceId))
                this.$router.push(`/dashboard/classroom/${classOverview?.slug}/attendance/edit`)
            }

            if (action == 'recap') {
                localStorage.setItem('attendanceId', toEncrypt(classOverview?.attendanceId))
                this.$router.push(`/dashboard/classroom/${classOverview?.slug}/attendance/recap`)
            }

            if (action == 'attendIn') {
                const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=800,height=500,left=200,top=200`

                // const urlTarget = process?.env?.attendanceURL

                // const attendanceId = `&attendanceId=${toEncrypt(classOverview?.attendanceId)}`
                // const code = `&code=${await appToken?.getCode()}`
                // const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`

                // const url = `${urlTarget}?${attendanceId}${code}${generatedToken}&token=${token}`

                // const handle =  window.open(url, 'Absen Masuk', params)
                // if (!handle) window.open(url, 'Absen Masuk')

                // Redirect to auth
                const attendanceId = `&attendanceId=${toEncrypt(classOverview?.attendanceId)}`
                const redirectLms = "&redirectTo=" + window.location.href

                const urlTarget = `${process?.env?.attendanceURL}${attendanceId}` + redirectLms;

                const baseUrl = process.env.alkademiAuth;
                const redirect = "&redirectTo=" + urlTarget;
                const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
                const codeToken = `&code=${await appToken?.getCode()}`
                const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`
                const url = `${baseUrl}/check?${redirect}${lmsId}${codeToken}${generatedToken}`;
                const handle =  window.open(url, 'Absen Masuk', params)
                if (!handle) window.open(url, 'Absen Masuk')
            }

            if (action == 'atendOut') {}
        },
        btnPretestClick() {
            localStorage.setItem('classId', toEncrypt(this.classOverview?.id))

            this.$router.push(`/dashboard/classroom/${ this.classOverview?.slug }/pretest`)
        },
        async generateQR() {
            // const baseUrl = process.env.attendanceURL
            // const attendanceId = `&attendanceId=${toEncrypt(this.classOverview?.attendanceId)}`
            // const code = `&code=${await appToken?.getCode()}`
            // const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`
            // const source = `&source=${toEncrypt('guest')}`

            // this.urlQR = `${baseUrl}?${attendanceId}${code}${generatedToken}${source}`

            // Redirect to auth
            const attendanceId = `&attendanceId=${toEncrypt(this.classOverview?.attendanceId)}`
            const redirectLms = "&redirectTo=" + window.location.href

            const urlTarget = `${process?.env?.attendanceURL}${attendanceId}` + redirectLms;

            const baseUrl = process.env.alkademiAuth;
            const redirect = "&redirectTo=" + urlTarget;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
            const codeToken = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`
            this.urlQR = `${baseUrl}/check?${redirect}${lmsId}${codeToken}${generatedToken}`;
        },
        async onGenerateQR() {
            await this.generateQR()
            this.isShowQR = !this.isShowQR
        },
        handleResize() {
            this.screenWidth = window.innerWidth;
        },
        async onDownloadQR() {
            await this.generateQR()

            const qrVariant = this.$refs?.qrVariant
            const canvasQR = await qrVariant?.qrCode?._oDrawing?._elCanvas
            const tempQR = new Image
            tempQR.src = await canvasQR.toDataURL('image/png')

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            canvas.width = 850
            canvas.height = 850

            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(tempQR, 25, 25)

            const download = document.createElement('a')
            const name = Date.now()

            download.download = name
            download.href = canvas.toDataURL('image/png')
            download.click()
            download.remove()
        },
        async fetchClassroomDetail(){
            this.isPreClassLoaded = false;

            const preClassId = this.classOverview?.preClassId;

            await this.$store.dispatch('Services/classroomDetail', {id: preClassId, isPreClass: true});

            if(!this.servicesState.status) {
                console.error('Failed fetch classroom detail', this.servicesState.message)
                // this.setEvent(this.servicesState.message, false)
                this.isPreClassLoaded = true;
            } else {
                this.prerequisiteClass = this.servicesState.detailPreClass;
                this.isPreClassLoaded = true;
            }
        },
    },
    created() {
        window.addEventListener('resize', this.handleResize)
    },
    beforeDestroy() {
        // Remove event listener to prevent memory leaks
        document.removeEventListener('visibilitychange', this.handleVisibilityChange)

    },
    destroyed() {
        window.addEventListener('resize', this.handleResize)
    },
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/components/classroom/overview.scss';
    @import '/assets/scss/components/micro/buttons.scss';

    #event ::v-deep {
        .event-card {
            min-height: 260px;

            .header {

                margin-bottom: 24px;

                .title-container {
                    margin-bottom: 12px;

                    .title {
                        font-weight: 500;
                        font-size: 18px;
                        line-height: 22px;

                        color: #000000;
                    }

                }

                .description {
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 17px;

                    color: rgba(0, 0, 0, 0.5);

                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            }

            .content {
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 12px;

                i {
                    margin-right: 6px;
                }

                span {
                    font-size: 12px;
                }

                .date, .time {
                    margin-right: 12px;

                    span {
                        color: rgba(0, 0, 0, 0.65);
                    }

                }

                .location {

                    color: #000000;

                    .desc {
                        font-size: 12px;
                        text-transform: capitalize;
                    }

                    span {
                        color: rgba(0, 0, 0, 0.65);
                    }
                }
            }

            .footer {
                padding: 0;

                .btn {
                    font-size: 14px;
                    text-transform: capitalize;
                    padding-bottom: 0;

                    i {
                        margin-left: 8px;
                    }
                }
            }

            .action-container {

                .action {
                    line-height: 16px;
                    padding: 4px;
                    margin-left: 8px;
                    cursor: pointer;

                    i {
                        font-size: 14px;
                    }
                }

            }

            &:hover {

                .action {
                    z-index: 99;
                    transition: ease-in-out 0.5s !important;

                    &:hover {
                        transform: translateY(-4px);
                    }
                }
            }
        }
    }

    #btn-add-pretest ::v-deep {
        button {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 22px;
            text-transform: capitalize;
            gap: 24px;
        }
    }

    .tags-container .bg-primary {
        color: $white !important;
    }

    .view-qr {
        position: absolute;
        width: 80px;
        height: 80px;
        top: 2px;
        left: 12px;

        @media screen and (max-width: 480px) {
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        span {
            background-color: rgba($color: #fff, $alpha: 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 8px;
            width: 35px;
            height: 35px;
            border-radius: 100%;

            @media screen and (max-width: 480px) {
                width: 75px;
                height: 75px;
            }

            i {
                font-size: 20px;
                color: #3d3e66;

                @media screen and (max-width: 480px) {
                    font-size: 48px;
                }
            }
        }
    }
</style>