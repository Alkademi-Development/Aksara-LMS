<template>
    <!-- Header -->
    <div class="header bg-primary pt-5 pb-8">
        <div class="container-fluid">
            <div class="header-body">
                <div :class="['row align-items-center py-4', centerForm ? 'justify-content-center' : '']">
                    <div :class="['col col-12 col-md-8']">
                        <h1 class="text-white d-inline-block mb-0">{{ title }}</h1>
                        <p class="text-white mb-0">{{ description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['title', 'description', 'centerForm'],
}
</script>

<style>

</style>