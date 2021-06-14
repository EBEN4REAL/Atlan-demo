<template>
  <div class="px-2">
    <a-popover
      placement="left"
      overlayClassName="inlinepopover"
      trigger="click"
    >
      <template #content>
        <a-textarea
          v-model:value="description"
          placeholder="Description"
          :class="$style.borderless"
          :rows="10"
          style="width: 300px"
        >
        </a-textarea>
        <div class="flex justify-end p-2 border-t border-gray-100">
          <a-button type="primary" size="small" @click="handleUpdate"
            >Update</a-button
          >
        </div>
      </template>
      <div class="px-2 py-1 rounded-lg hover:bg-white hover:border">
        <p class="mb-0 text-sm tracking-wide text-gray-400">Description</p>
        <p class="mb-0 text-dark-400" v-if="description">
          {{ description }}
        </p>
        <p class="mb-0 text-dark-400" v-else>No description available</p>
      </div>
    </a-popover>

    <div class="px-2 mt-3">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Rows/Columns</p>
      <p class="mb-0 text-dark-400">
        <span class="font-bold tracking-wide">{{ rowCount(item, true) }}</span>
        rows,
        <span class="font-bold tracking-wide cursor-pointer text-primary-500">{{
          columnCount(item, true)
        }}</span>
        cols
      </p>
    </div>

    <a-popover
      placement="left"
      overlayClassName="inlinepopover"
      trigger="click"
    >
      <template #content>
        <a-input
          placeholder="Status"
          :class="$style.borderless"
          style="width: 300px"
        >
        </a-input>
        <a-radio-group>
          <a-radio>Status</a-radio>
        </a-radio-group>
      </template>
      <div
        class="px-2 py-1 mt-3 border-gray-300 rounded-lg  hover:bg-white hover:border"
      >
        <p class="mb-0 text-sm tracking-wide text-gray-400">Status</p>
        <StatusBadge
          :status="status(item)"
          :showNoStatus="true"
          :showLabel="true"
        ></StatusBadge>
      </div>
    </a-popover>

    <!-- <div class="px-4 py-1 mt-2 hover:bg-gray-50 hover:rounded">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Owners</p>
      <StatusBadge :status="status(item)"></StatusBadge>
    </div> -->

    <div class="px-4 py-1 mt-2 hover:bg-gray-50 hover:rounded">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Terms</p>
      <StatusBadge :status="status(item)"></StatusBadge>
    </div>

    <div class="px-4 py-1 mt-2 hover:bg-gray-50 hover:rounded">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Classifications</p>
      <StatusBadge :status="status(item)"></StatusBadge>
    </div>
  </div>
</template>
            
<script lang="ts">
import { computed, defineComponent, ref, WritableComputedRef } from "vue";
import AssetMixin from "~/mixins/asset";
import { Components } from "~/api/atlas/client";

import StatusBadge from "@common/badge/status/index.vue";
import updateAsset from "~/composables/asset/updateAsset";

export default defineComponent({
  mixins: [AssetMixin],
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
    const localDescription = ref("");
    const entities = ref({
      entities: [
        {
          guid: props.item.guid,
          typeName: props.item.typeName,
          attributes: {
            qualifiedName: props.item.attributes?.qualifiedName,
            name: props.item.attributes?.name,
            userDescription: "asdasdasd",
            tenantId: props.item.attributes?.tenantId,
          },
        },
      ],
    });
    const { execute, isReady } = updateAsset(entities, {
      immediate: false,
    });

    const description: WritableComputedRef<string> = computed({
      get(): string {
        return (
          props.item?.attributes?.userDescription ||
          props.item?.attributes?.description
        );
      },
      set(newValue: string): void {
        localDescription.value = newValue;
      },
    });

    const handleUpdate = () => {
      execute();
    };

    return {
      handleUpdate,
      isReady,
      description,
    };
  },
});
</script>
  
  
     
<style lang="less" module>
.borderless {
  @apply border-none shadow-none !important;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  &:global(.ant-input-affix-wrapper-focused) {
    @apply border-none shadow-none;
  }
}
</style>
          