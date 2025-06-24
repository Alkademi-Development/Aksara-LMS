export default {
    statusClass(data, state) {
        if (state == 'status') {
            if (data.comingSoon) return 'b-orange'
            else if (data.onRegistration) return 'b-green'
            else if (data.started) return 'b-blue'
            else if (data.ended) return 'b-red'
            else return 'b-orange'
        }
        else if (state == 'name') {
            if (data.comingSoon) return 'Akan Datang'
            else if (data.onRegistration) return 'Pendaftaran Dibuka'
            else if (data.started) return 'Sedang Berlangsung'
            else if (data.ended) return 'Telah Selesai'
            else return 'Segera Dimulai'
        }
    }
}