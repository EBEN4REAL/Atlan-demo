<template>
  <a-popover
    placement="left"
    v-model:visible="isCompleted"
    overlayClassName="inlinepopover"
    @visibleChange="handleVisibleChange"
    trigger="click"
  >
    <template #content>
      <div class="flex flex-col">
        <div class="">
          <a-radio-group class="w-full px-4 py-3">
            <div class="flex flex-col">
              <a-radio
                v-for="item in List"
                :key="item.id"
                :value="item.id"
                class="mb-1"
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
    </template>
    <div class="px-2 py-1 rounded-lg hover:bg-white hover:border">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Status</p>
      <StatusBadge
        :status="status(item)"
        :showNoStatus="true"
        :showLabel="true"
      ></StatusBadge>
    </div>
  </a-popover>
</template>
              
<script lang="ts">
import { defineComponent, nextTick, ref, watch } from "vue";
import updateDescription from "~/composables/asset/updateDescription";
import { useMagicKeys } from "@vueuse/core";
import StatusBadge from "@common/badge/status/index.vue";
import AssetMixin from "~/mixins/asset";

import { List } from "~/constant/status";

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
    const { execute, isReady, state, description, isCompleted } =
      updateDescription(props.item);

    const handleDescriptionUpdate = () => {
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
        if (isCompleted.value) {
          isCompleted.value = false;
        }
      }
    });
    return {
      handleDescriptionUpdate,
      handleVisibleChange,
      isReady,
      state,
      description,
      isCompleted,
      List,
    };
  },
});
</script>
    

<style lang="less">
.pushtop {
  top: 2px;
}
</style>
    
       
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
            