<template>
  <div :key="statusId">
    <div class="flex items-center align-middle">
      <div class="mr-1">
        <fa :class="iconClass" :icon="icon" class="pushtop" />
      </div>
      <p class="mb-0 text-gray-700" v-if="showLabel">
        {{ label }}
      </p>
    </div>

    <p
      class="mt-1 mb-0 text-xs leading-none text-gray-500"
      v-if="showLabel && statusId"
    >
      {{ dayjs().from(statusUpdatedAt, true) }}
      ago by
      {{ statusUpdatedBy }}
    </p>
  </div>
</template>



<script lang="ts">
import dayjs from "dayjs";
import { defineComponent } from "vue";
import { List } from "~/constant/status";
import { Checkbox } from "~/types";

export default defineComponent({
  props: {
    statusId: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    statusMessage: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    statusUpdatedBy: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    statusUpdatedAt: {
      type: Date,
      required: false,
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
      dayjs,
      List,
    };
  },
  emits: ["change"],
  mounted() {},
  computed: {
    statusObject(): Checkbox {
      let found = List.find((item) => item.id === this.statusId);
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