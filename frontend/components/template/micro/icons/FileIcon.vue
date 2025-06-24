<template>
  <svg :width="width" viewBox="0 0 202 229" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M29 114H164C168.418 114 172 117.582 172 122V192C172 196.418 168.418 200 164 200H29V114Z" fill="#CAD1D8"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M142 0H43C35.268 0 29 6.26807 29 14V215C29 222.732 35.268 229 43 229H188C195.732 229 202 222.732 202 215V57H156C148.268 57 142 50.7319 142 43V0Z" fill="#E2E5E7"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M156 57H202L142 0V43C142 50.7319 148.268 57 156 57Z" fill="#B0B7BD"/>
    <path d="M202 97L156 57H202V97Z" fill="#CAD1D8"/>
    <template v-if="label">
      <path d="M29 114H164C168.418 114 172 117.582 172 122V192C172 196.418 168.418 200 164 200H29V114Z" fill="#CAD1D8"/>
      <rect y="107" width="172" height="86" rx="8" :fill="bgLabel"/>
      <text x="43%" y="165" font-family="Inter" font-size="40" fill="white" font-weight="bold" text-anchor="middle">{{ label }}</text>
    </template>
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: "70"
    },
    label: {
      type: String,
      default: ""
    },
    bgLabel: {
      type: String,
      default: "#F15642" // red
    }
  }
}
</script>
