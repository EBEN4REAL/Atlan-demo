<template>
  <a-popover
    v-model:visible="isCompleted"
    placement="left"
    overlay-class-name="inlinepopover"
    trigger="click"
    @visibleChange="handleVisibleChange"
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
          :loading="isLoading"
          @click="handleUpdate"
          >Update</a-button
        >
      </div>
    </template>
    <div
      class="px-2 py-1 transition duration-500 ease-in-out rounded-lg  hover:bg-gray-50 hover:border"
    >
      <p class="mb-0 text-sm tracking-wide text-gray">Description</p>
      <p v-if="description" class="mb-0 text-gray-900">
        {{ description }}
      </p>
      <p v-else class="mb-0 text-gray-500">No description available</p>
    </div>
  </a-popover>
</template>
              
<script lang="ts">
import { defineComponent, nextTick, ref, watch } from "vue";
import { useMagicKeys } from "@vueuse/core";
import updateDescription from "~/composables/asset/updateDescription";

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
    const {
      isLoading,
      update,
      handleCancel,

      isReady,
      state,
      description,
      isCompleted,
    } = updateDescription(props.item);

    const handleUpdate = () => {
      update();
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
    const esc = keys.Escape;

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
      isLoading,
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
            