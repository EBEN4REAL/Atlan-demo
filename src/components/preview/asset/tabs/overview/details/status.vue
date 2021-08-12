<template>
  <div>
    <a-popover
      v-model:visible="isCompleted"
      placement="left"
      overlay-class-name="inlinepopover"
      trigger="click"
    >
      <template #content>
        <div class="flex flex-col" style="width: 300px">
          <div class="">
            <a-radio-group v-model:value="statusId" class="w-full py-3">
              <div class="flex flex-col">
                <a-radio
                  v-for="item in List"
                  :key="item.id"
                  :value="item.id"
                  class="px-4 mb-1"
                >
                  <span class="align-middle">
                    <fa
                      :icon="item.icon"
                      :class="item.iconClass"
                      class="mr-1 pushtop"
                    ></fa
                    >{{ item.label }}
                  </span>
                </a-radio>
              </div>
            </a-radio-group>
          </div>
        </div>
        <div class="mt-1 border-t border-gray-100">
          <a-textarea
            v-model:value="statusMessage"
            placeholder="message"
            class=""
            :class="$style.borderless"
          ></a-textarea>
        </div>
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
        ref="animationPoint"
        class="px-2 py-1 transition duration-500 ease-in-out rounded-lg  hover:bg-gray-50 hover:border"
      >
        <p class="mb-0 text-sm tracking-wide text-gray">Status</p>
        <StatusBadge
          :key="item.guid"
          :status-id="item?.attributes?.assetStatus"
          :status-message="item?.attributes?.assetStatusMessage"
          :status-updated-at="item?.attributes?.assetStatusUpdatedAt"
          :status-updated-by="item?.attributes?.assetStatusUpdatedBy"
          :show-no-status="true"
          :show-label="true"
        ></StatusBadge>
      </div>
    </a-popover>
    <div v-if="item?.attributes?.assetStatusMessage" class="px-2 mt-1">
      <p
        v-linkified
        class="mb-0 text-xs font-semibold text-gray-500"
        v-html="statusMessage"
      ></p>
    </div>
  </div>
</template>
              
<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from "vue";
import { useMagicKeys } from "@vueuse/core";
import StatusBadge from "@common/badge/status/index.vue";

import { List } from "~/constant/status";
import updateStatus from "~/composables/asset/updateStatus";
import confetti from "~/utils/confetti";

export default defineComponent({
  components: { StatusBadge },

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
    // const isLoading = ref(false);

    const {
      handleCancel,
      update,
      isReady,
      state,
      statusId,
      statusMessage,
      isCompleted,
      isLoading,
    } = updateStatus(props.item);

    const animationPoint = ref(null);

    const handleUpdate = () => {
      update();
    };

    watch(isReady, () => {
      if (isReady.value) {
        if (statusId.value === "verified") {
          const config = {
            angle: 45,
            startVelocity: 10,
            spread: 100,
            elementCount: 50,
            colors: ["#2251cc", "#2251cc", "#82b54b", "#e94a3f", "#faa040"],
            width: "0.3rem",
            height: "0.3rem",
          };
          confetti(animationPoint.value, config);
        }
      }
    });

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

      isReady,
      state,
      statusId,
      statusMessage,
      isCompleted,
      List,
      animationPoint,
      isLoading,
    };
  },
});
</script>
    

    
       
<style lang="less" module>
.borderless {
  @apply border-none shadow-none px-4 !important;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  &:global(.ant-input-affix-wrapper-focused) {
    @apply border-none shadow-none;
  }
}
</style>
            