export default {
    inputLogoForm: [
        // { name: "title", value: "", label: "Judul *", type: "text", placeholder: "", required: true },
        { name: "logo_dark", value: "", label: "Dark Logo*", type: "file", acceptedFile: "image/*", description: "* Upload file dengan ekstensi .jpg / .png / .svg / .webp", placeholder: "", required: true },
        { name: "logo_light", value: "", label: "Light Logo *", type: "file", acceptedFile: "image/*", description: "* Upload file dengan ekstensi .jpg / .png / .svg / .webp", placeholder: "", required: true },
        { name: "favicon", value: "", label: "Favicon (logo pada address bar) *", type: "file", acceptedFile: "image/*", description: "* Upload file dengan ekstensi .jpg / .png / .svg / .webp", placeholder: "", required: true },
    ],

    inputMetaForm: [
        // { name: "image", value: "", label: "Logo *", type: "file", acceptedFile: "image/*", description: "* Upload file dengan ekstensi .jpg / .png / .svg / .webp", placeholder: "", required: true },
        { name: "name", value: "", label: "Judul Halaman *", type: "text", placeholder: "", required: true },
        { name: "description", value: "", label: "Deskripsi *", type: "textarea", placeholder: "", required: true },
        { name: "keywords", value: "", label: "Kata Kunci Pencarian *", type: "textarea", placeholder: "", description: "* Pisahkan setiap kalimat dengan tanda koma. Contoh: alkademi, pelatihan pemrograman, belajar pemrograman", required: true },
        { name: "robot_index", value: "", label: "Meta Robot Index", type: "radio", placeholder: "", required: true, options: ["index", "noindex"] },
        { name: "robot_follow", value: "", label: "Meta Robot Follow", type: "radio", placeholder: "", required: true, options: ["follow", "nofollow"] },
    ],
    
    inputCssForm: [
        // { name: "isCustomAuth", value: "", label: "Aktifasi Brand Autentikasi", type: "checkbox", placeholder: "", required: false },
        { name: "clr_primary", value: "", label: "Warna Primary *", type: "color", placeholder: "", required: true },
        { name: "clr_secondary", value: "", label: "Warna Secondary *", type: "color", placeholder: "", required: true },
        // { name: "clr_info", value: "", label: "Info *", type: "color", placeholder: "", required: true },
        // { name: "clr_success", value: "", label: "Success *", type: "color", placeholder: "", required: true },
        // { name: "clr_warning", value: "", label: "Warning *", type: "color", placeholder: "", required: true },
        // { name: "clr_danger", value: "", label: "Danger *", type: "color", placeholder: "", required: true },
        // { name: "clr_dark", value: "", label: "Dark *", type: "color", placeholder: "", required: true },
        // { name: "clr_light", value: "", label: "Light *", type: "color", placeholder: "", required: true },
        { name: "ft_primary", value: "", label: "Font Primary *", type: "select", placeholder: "", required: true },
        { name: "ft_secondary", value: "", label: "Font Secondary *", type: "select", placeholder: "", required: true },
    ],

    inputClassForm: [
        { name: "isLevelingCase", value: "", label: "Fase Kelas", type: "checkbox", plac: "", required: false },
    ],

    inputOtherForm: [
        { name: "helpdesk", value: "", label: "Link Helpdesk", type: "url", description: "* Tambahkan link grup (Whatsapp / Telegram)", required: false },
    ],

    inputZoomPlatform: [
        { name: "accountId", value: "", label: "Account ID *", type: "text", required: true },
        { name: "userId", value: "", label: "User ID *", type: "text", required: true },
        { name: "clientId", value: "", label: "Client ID *", type: "text", required: true },
        { name: "clientSecret", value: "", label: "Client Secret *", type: "text", required: true },
    ],

    inputGmeetPlatform: [
        { name: "credential", value: "", label: "Upload Credential *", type: "file", placeholder: "Tekan untuk pilih atau tarik dan lepaskan file disini...", description: "* Upload credential dengan format file .json", acceptedFile: ".json", required: true },
        { name: "access_token", value: "", label: "Access Token", placeholder: "Upload credential untuk mendapatkan value", type: "text", disabled: true, required: true },
        { name: "refresh_token", value: "", label: "Refresh Token", placeholder: "Upload credential untuk mendapatkan value", type: "text", disabled: true, required: true },
        { name: "client_id", value: "", label: "Cliend ID", placeholder: "Upload credential untuk mendapatkan value", type: "text", disabled: true, required: true },
        { name: "client_secret", value: "", label: "Client Secret", placeholder: "Upload credential untuk mendapatkan value", type: "text", disabled: true, required: true },
    ],
}