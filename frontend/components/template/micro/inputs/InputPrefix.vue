<template>
  <div class="d-flex wrapper-input">
    <div class="wrapper-prefix">
      <i :class="`${iconPrefix} prefix-icon`"></i>
    </div>
    <input
      :class="`input-field ${disabled ? 'input-field--disabled' : ''}`"
      :placeholder="placeholder"
      :id="id"
      :type="type"
      :value="value"
      :disabled="disabled"
      @input="event => $emit('onChange', event?.target?.value)"
    />
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    iconPrefix: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    id: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  }
}
</script>


<style scoped lang="scss">
.wrapper-input{
  border: .5px solid var(--bs-primary);
  border-radius: 6px;
  overflow: hidden;

  .wrapper-prefix{
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bs-primary);
  
    .prefix-icon{
      font-size: 18px;
      color: white;
    }
  }
  
  .input-field{
    border: none;
    outline: none;
    width: 100%;
    padding: 8px;
    font-size: 12px;
    color: black;
    font-weight: 500;

    &::-webkit-input-placeholder{
      color: rgba(0, 0, 0, 0.40);
    }

    &.input-field--disabled{
      cursor: not-allowed;
    }
  }
}

</style>