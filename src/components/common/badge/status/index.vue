<template>
  <a-popover placement="right">
    <template #content>
      <div class="flex items-center">
        <div>
          <fa :class="iconClass" :icon="icon" />
        </div>
        <p class="mb-0">
          {{ label }}
        </p>
      </div>
      <!-- <p class="text-xs mb-0 line-height-1 text-gray-500">
        {{ updatedAtRelative }} ago by
        {{ updatedBy }}
      </p> -->
      <!-- <div v-if="message">
        <a-divider class="mt-2 mb-1" />
        <p class="mb-0 text-gray-500 text-xs">Message</p>
        <p class="mb-0 text-xs">
          {{ message }}
        </p>
      </div> -->
    </template>
    <div class="mb-0 flex items-center">
      <fa :class="iconClass" :icon="icon" class="top-0" />
      <span class="text-gray-500 tracking-wider ml-1" v-if="showLabel">
        {{ label }}</span
      >
    </div>
  </a-popover>
</template>



<script lang="ts">
import { defineComponent } from "vue";
import { List } from "~/constant/status";
import { Checkbox, CheckboxArray } from "~/types";

export default defineComponent({
  props: {
    status: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    showLabel: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    showNoStatus: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      List,
    };
  },
  emits: ["change"],
  mounted() {},
  computed: {
    statusObject(): Checkbox {
      let found = List.find((item) => item.id === this.status);
      if (this.showNoStatus && !found) {
        found = List.find((item) => item.id === "is_null");
      }
      return found;
    },
    icon(): string {
      return this.statusObject?.icon;
    },
    iconClass(): string {
      return this.statusObject?.iconClass;
    },
    label(): string {
      return this.statusObject?.label;
    },
  },
});
</script>