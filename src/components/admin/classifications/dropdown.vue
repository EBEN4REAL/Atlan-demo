<template>
  <a-dropdown>
    <fa
      icon="fal ellipsis-v"
      @click.prevent
      class="text-4xl ant-dropdown-link text-grey-600"
    />

    <template #overlay>
      <a-menu>
        <a-menu-item
          v-for="(option, index) in options"
          class="flex items-center"
          :key="index"
        >
          <div
            class="flex justify-between item-center"
            @click="() => handleMenuItemClick({ index, ...option })"
          >
            <fa
              v-if="option.icon"
              :icon="getIconClass(option)"
              class="mr-2 text-left"
            />
            <span class="text-left">{{ option.title }}</span>
          </div>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";

export default defineComponent({
  name: "Dropdown",
  props: {
    /**
     * Options - List of all the items in the dropdown
     * { title: string, icon: string, iconType: string, handleClick: Function }
     */
    options: {
      type: Array,
      default: () => [],
    },
    /**
     * Should the dropdown be aligned to the right
     */
    right: {
      type: Boolean,
      default: false,
    },
    /**
     * Should the dropdown arrow be shown
     */
    isArrow: {
      type: Boolean,
      default: true,
    },
    split: {
      type: Boolean,
      default: false,
    },
    dropup: {
      type: Boolean,
      default: false,
    },
    toggleText: {
      type: String,
      default: "Toggle Dropdown",
    },
    size: {
      type: String,
      default: null,
    },
    variant: {
      type: String,
      default: null,
    },
    menuClass: {
      type: [String, Array],
      default: null,
    },
    toggleTag: {
      type: String,
      default: "button",
    },
    toggleClass: {
      type: [String, Array],
      default: null,
    },
    offset: {
      type: [String, Number],
      default: null,
    },
    noCaret: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "menu",
    },
    optionValue: {
      type: Object,
      default: () => {},
    },
    boundary: {
      // String: `scrollParent`, `window` or `viewport`
      // Object: HTML Element reference
      type: [String, Object],
      default: "scrollParent",
    },
    isShownEventToBeHandled: {
      type: Boolean,
      default: false,
    },
    isHiddenEventToBeHandled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const open = ref(false);
    console.log("dropdwon");

    const isShownEventToBeHandled = computed(
      () => props.isShownEventToBeHandled
    );
    const isHiddenEventToBeHandled = computed(
      () => props.isHiddenEventToBeHandled
    );
    const { options } = props;

    const handleMenuItemClick = (option) => {
      option.handleClick();
      console.log(option);
    };

    /**
     * Toggles the dropdown
     */
    const toggleDropdown = () => {
      open.value = !open.value;
    };
    const handleDropdownShown = () => {
      if (isShownEventToBeHandled) {
        context.emit("handleDropdownShown");
      }
    };
    const handleDropdownHidden = () => {
      if (isHiddenEventToBeHandled) {
        context.emit("handleDropdownHidden");
      }
    };
    /**
     * Closes the dropdown
     */
    const closeDropdown = () => {
      open.value = false;
    };
    /**
     * Returns icon class based on icon and icon type
     */
    const getIconClass = (option) => {
      if (option && option.icon) {
        switch (option.iconType) {
          case "at":
            return `at at-${option.icon}`;

          case "fal":
            return `fal ${option.icon}`;

          case "far":
            return `far ${option.icon}`;

          case "fas":
            return `fas ${option.icon}`;

          case "fa":
            return `fa ${option.icon}`;

          case "fab":
            return `fab ${option.icon}`;
          default:
            return `far ${option.icon}`;
        }
      } else {
        return "";
      }
    };

    return {
      options,
      toggleDropdown,
      handleDropdownShown,
      handleDropdownHidden,
      closeDropdown,
      getIconClass,
      handleMenuItemClick,
      open,
    };
  },
  methods: {},
});
</script>

<style lang="less" scoped></style>
