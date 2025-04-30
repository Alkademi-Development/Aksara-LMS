<template>
  <section>
    <NuxtLayout>
      <NuxtLoadingIndicator :throttle="0" />
      <NuxtPage />
    </NuxtLayout>
  </section>
</template>

<script setup>

// Atur metadata di <head>
useSeoMeta({
  title: 'Dashboard | Alkademi',
});

// const route = useRoute();

// watch(
//   [route],
//   async () => {

//     // Atur metadata di <head>
//     useSeoMeta({
//       title: 'Dashboard | Alkademi',
//     });
//   },
//   {
//     immediate: true,
//   }
// );

</script>
