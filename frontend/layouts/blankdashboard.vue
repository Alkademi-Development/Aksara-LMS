<template>
    <Nuxt />
</template>

<script>
export default {
    mounted() {
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());

		gtag('config', 'G-8H1TCBHYM9');
	},
}
</script>