<template>
  <div>
    <a-popover
      placement="left"
      v-model:visible="isCompleted"
      overlayClassName="inlinepopover"
      trigger="click"
    >
      <template #content>
        <div class="flex flex-col" style="width: 300px">
          <div class="">
            <a-radio-group class="w-full py-3" v-model:value="statusId">
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
            @click="handleUpdate"
            :loading="!state && isReady"
            >Update</a-button
          >
        </div>
      </template>
      <div class="px-2 py-1 rounded-lg hover:bg-gray-50 hover:border">
        <p class="mb-0 text-sm tracking-wide text-gray-400">Status</p>
        <StatusBadge
          :key="item.guid"
          :statusId="item?.attributes?.assetStatus"
          :statusMessage="item?.attributes?.assetStatusMessage"
          :statusUpdateAt="item?.attributes?.assetStatusUpdateAt"
          :statusUpdateBy="item?.attributes?.assetStatusUpdateBy"
          :showNoStatus="true"
          :showLabel="true"
        ></StatusBadge>
      </div>
    </a-popover>
    <div v-if="item?.attributes?.assetStatusMessage" class="px-2 mt-1">
      <p
        class="mb-0 text-xs font-semibold text-gray-500"
        v-html="statusMessage"
        v-linkified
      ></p>
    </div>
  </div>
</template>
              
<script lang="ts">
import { defineComponent, nextTick, ref, watch } from "vue";
import { useMagicKeys } from "@vueuse/core";
import StatusBadge from "@common/badge/status/index.vue";
import AssetMixin from "~/mixins/asset";

import { List } from "~/constant/status";
import updateStatus from "~/composables/asset/updateStatus";

export default defineComponent({
  components: { StatusBadge },
  mixins: [AssetMixin],
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
      handleCancel,
      execute,
      isReady,
      state,
      statusId,
      statusMessage,
      isCompleted,
    } = updateStatus(props.item);

    const handleUpdate = () => {
      execute();
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
      isReady,
      state,
      statusId,
      statusMessage,
      isCompleted,
      List,
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
            