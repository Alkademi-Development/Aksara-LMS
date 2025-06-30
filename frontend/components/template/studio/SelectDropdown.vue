<template>
  <div class="select-dropdown" ref="dropdown">
    <button
      class="select-dropdown-toggle btn d-flex align-items-center justify-content-between w-100"
      @click="toggleDropdown"
      type="button"
    >
      <span>{{ selectedLabel }}</span>
      <i class="ri-arrow-down-s-line ml-2"></i>
    </button>
    <transition name="fade">
      <div
        v-show="isOpen && options?.length > 0"
        class="select-dropdown-menu shadow"
        :class="[positionMenu]"
        @mousedown.prevent
      >
        <ul class="select-dropdown-list mb-0">
          <li
            v-for="option in options"
            :key="option.value"
            class="select-dropdown-item"
            :class="{ selected: option.value === value }"
            @click="selectOption(option)"
          >
            <span>{{ option.label }}</span>
            <i v-if="option.value === value" class="ri-check-line float-right"></i>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "SelectDropdown",
  props: {
    value: [String, Number],
    options: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    positionMenu: {
      type: String,
      default: "bottom"
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    selectedLabel() {
      const selected = this.options.find(opt => opt.value === this.value);
      return selected ? selected.label : this.label || "Select";
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectOption(option) {
      if (option.value !== this.value) {
        this.$emit("input", option.value);
        this.$emit("change", option.value);
      }
      this.isOpen = false;
    },
    handleClickOutside(e) {
      if (!this.$refs.dropdown.contains(e.target)) {
        this.isOpen = false;
      }
    },
  },
  mounted() {
    document.addEventListener("mousedown", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  },
};
</script>

<style lang="scss" scoped>
.select-dropdown {
  position: relative;
  display: inline-block;

  .select-dropdown-toggle {
    padding: 0.6rem !important;
    min-width: 120px;
    background: #fafafa;
    border: 1px solid #e5e7eb;
    font-weight: 500;
    border-radius: 8px;
    transition: border 0.15s;
    box-shadow: none;
    outline: none;
    span {
      color: #333;
    }
    &:focus, &:active {
      border-color: var(--bs-primary);
    }
  }

  .select-dropdown-menu {
    position: absolute;
    left: 0;
    min-width: 180px;
    background: #fff;
    z-index: 10;
    margin-top: 4px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 8px 32px 0 rgba(60,72,88,.16);
    padding: 10px 0;
    animation: fadeIn .15s;

    &.bottom {
      top: 100%;
    }
    &.top {
      bottom: 110%;
    }
  }

  .select-dropdown-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    padding: 8px 20px 2px 20px;
    margin-bottom: 2px;
  }

  .select-dropdown-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .select-dropdown-item {
    padding: 8px 20px;
    font-size: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #222;
    transition: background .15s,color .15s;
    border-radius: 4px;
    &:hover {
      background: #f5faff;
      color: var(--bs-primary, #2096C4);
    }
    &.selected {
      font-weight: 600;
      color: var(--bs-primary, #2096C4);
      background: #eaf6fb;
    }
    i {
      margin-left: auto;
      font-size: 18px;
    }
  }
}

/* Fade animation for dropdown */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>