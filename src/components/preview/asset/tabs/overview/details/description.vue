<template>
  <a-popover
    placement="left"
    v-model:visible="isCompleted"
    overlayClassName="inlinepopover"
    @visibleChange="handleVisibleChange"
    trigger="click"
  >
    <template #content>
      <a-textarea
        v-model:value="description"
        autofocus
        placeholder="Description"
        :class="$style.borderless"
        :rows="10"
        style="width: 300px"
      >
      </a-textarea>
      <div class="flex justify-end p-2 space-x-2 border-t border-gray-100">
        <a-button size="small" @click="handleCancel">Cancel</a-button>
        <a-button
          type="primary"
          size="small"
          @click="handleUpdate"
          :loading="!state && isReady"
          >Update</a-button
        >
      </div>
    </template>
    <div class="px-2 py-1 rounded-lg hover:bg-white hover:border">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Description</p>
      <p class="mb-0 text-gray-900" v-if="description">
        {{ description }}
      </p>
      <p class="mb-0 text-gray-500" v-else>No description available</p>
    </div>
  </a-popover>
</template>
              
<script lang="ts">
import { defineComponent, nextTick, ref, watch } from "vue";
import updateDescription from "~/composables/asset/updateDescription";
import { useMagicKeys } from "@vueuse/core";

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  setup(props) {
    const { handleCancel, execute, isReady, state, description, isCompleted } =
      updateDescription(props.item);

    const handleUpdate = () => {
      execute();
    };

    const descriptionInput = ref();
    const handleVisibleChange = () => {
      if (descriptionInput?.value) {
        nextTick(() => {
          descriptionInput?.value?.$el?.focus();
        });
      }
    };

    const keys = useMagicKeys();
    const esc = keys["Escape"];

    watch(esc, (v) => {
      if (v) {
        handleCancel();
      }
    });
    return {
      handleUpdate,
      handleCancel,
      handleVisibleChange,
      isReady,
      state,
      description,
      isCompleted,
    };
  },
});
</script>
    
    
       
  <style lang="less" module>
.borderless {
  @apply border-none shadow-none p-4 !important;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  &:global(.ant-input-affix-wrapper-focused) {
    @apply border-none shadow-none;
  }
}
</style>
            