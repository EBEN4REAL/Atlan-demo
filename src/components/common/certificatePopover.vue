<template>
  <a-tooltip
    placement="topLeft" 
    :overlayClassName="`toolTips-badge ${status(data)?.toLowerCase()}`" 
  >
    <template #title>
      <div>
        <div v-if="data?.attributes?.description" class="px-3 mb-3">
          {{data?.attributes?.description}}
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center icon-badge gap-1.5">
            <StatusBadge
              :key="data.guid"
              :show-no-status="false"
              :status-id="status(data)"
              class="flex-none mb-0.5 ml-1"
            />
            {{status(data)?.toLowerCase()}}
          </div>
          <div class="mr-4 icon-badge">
            {{data?.attributes?.certificateUpdatedBy}}
          </div>
        </div>
      </div>
    </template>
    <StatusBadge
      :key="data.guid"
      :show-no-status="false"
      :status-id="status(data)"
      class="flex-none mb-0.5 ml-1"
    />
  </a-tooltip>
</template>

<script setup lang="ts">
  import { PropType } from "vue"
  import StatusBadge from '@common/badge/status/index.vue'
  import useAssetInfo from '~/composables/asset/useAssetInfo'
  import { assetInterface } from '~/types/assets/asset.interface'
    
  defineProps<{
    data?: PropType<assetInterface>
  }>()

  const { status } = useAssetInfo()
</script>

<style lang="less">
  .toolTips-badge {
    .icon-badge  {
      border-radius: 4px;
      text-transform: capitalize;
    }
    .ant-tooltip-inner {
        font-size: 12px;
        transform: translateY(39px) translateX(-11px);
        color: #3E4359;
        padding: 8px;
        border-radius: 8px;
        border-top-left-radius: 18px;
        border-bottom-right-radius: 18px;
        min-width: 150px;
    }
    &.verified{
      .ant-tooltip-arrow-content {
        background-color: #EEFFEF!important;
      }
      .ant-tooltip-inner {
        background-color: #EEFFEF!important;
      }
    }
    &.draft{
      .ant-tooltip-arrow-content {
        background-color: #FFEEC6!important;
      }
      .ant-tooltip-inner {
        background-color: #FFEEC6!important;
      }
    }
    &.deprecated{
      .ant-tooltip-arrow-content {
        background-color: #FFD2B8!important;
      }
      .ant-tooltip-inner {
        background-color: #FFD2B8!important;
      }
    }
  }
</style>