<template>
    <div ref="infiniteSentinel"></div>
</template>

<script>
import intersectionObserver from 'intersection-observer';

export default {
  data() {
    return {
      items: []
    };
  },
  mounted() {
    this.setupIntersectionObserver();
  },
  methods: {
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      };

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            this.$emit("triggerLoadMore")
          }
        },
        options
      );

      observer.observe(this.$refs.infiniteSentinel);
    },
  },
};
</script>