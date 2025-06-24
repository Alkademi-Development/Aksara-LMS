<template>
  <div>

        <!-- Header -->
        <ContentHeader title="Statistik" />

        <!-- Page content -->
        <div class="container-fluid mt--6">
            
            <!-- Content Begin -->
            <div class="row">
                <b-card no-body>
                    <b-card-header>
                        <b-card-title>
                            Statistik Kelas
                        </b-card-title>
                    </b-card-header>
                </b-card>
            </div>

            <!-- Footer -->
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import Footer from "@/components/template/dashboard/Footer"

export default {
    layout: 'dashboard',
    components: {
        ContentHeader,
        Footer,
    },
}
</script>

<style>

</style>