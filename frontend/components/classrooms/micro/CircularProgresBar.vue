<template>
    <div :class="['circular-progress', containerClass]">
        <svg viewBox="0 0 100 100">
            <circle class="progress-background" cx="50" cy="50" r="40"/>
            <circle class="progress" :stroke-dasharray="circumference" :stroke-dashoffset="offset" cx="50" cy="50" r="40"/>
            <!-- <text x="50" y="50" class="progress-text">{{ Math.floor(value / max * 100) }}%</text> -->
        </svg>
    </div>
</template>
  
<script>
export default {
    props: {
        containerClass: {
            type: String,
            default: '',
            required: false
        },
        value: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        }
    },
    computed: {
        circumference() {
            return 2 * Math.PI * 40;
        },
        offset() {
            return this.circumference * (1 - this.value / this.max);
        }
    }
}
</script>
  
<style scoped>
    .circular-progress {
        display: inline-block;
        width: 18px;
        height: 18px;
    }
    
    .progress-background {
        fill: none;
        stroke: #e6e6e6;
        stroke-width: 15;
    }
    
    .progress {
        fill: none;
        stroke: var(--bs-primary);
        stroke-width: 15;
        stroke-linecap: round;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
        transition: stroke-dashoffset 0.5s ease;
    }
    
    .progress-text {
        fill: #000;
        font-size: 20px;
        text-anchor: middle;
        dominant-baseline: middle;
    }
</style>
  