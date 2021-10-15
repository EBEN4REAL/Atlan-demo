<template>
    <a-tooltip
      placement="topLeft" 
      :overlayClassName="`toolTips-badge ${status(data)?.toLowerCase()}`" 
    >
        <template #title>
            <div>
            <div class="description">{{data?.attributes?.description}} “Table is ready for use”</div>
            <div class="footer">
            <div class="icon-badge">
                <StatusBadge
                    :key="data.guid"
                    :show-no-status="false"
                    :status-id="status(data)"
                    class="flex-none mb-0.5 ml-1"
                />
                {{status(data)?.toLowerCase()}}
            </div>
            <div class="icon-badge">
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

<script lang="ts">
    import { defineComponent, PropType } from "vue";
    import { Components } from '~/api/atlas/client'
    import StatusBadge from '@common/badge/status/index.vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    export default defineComponent({
        components: {
            StatusBadge
        },
        props: {
            data: {
                type: Object as PropType<Components.Schemas.AtlasEntityHeader>,
                required: false,
                default(): Components.Schemas.AtlasEntityHeader {
                    return {}
                },
            }
        },
        setup() {
            const {
                status
            } = useAssetInfo()
          
            return {
                status
            }
        }

    })
</script>

<style lang="less">
  .toolTips-badge {
    // transform: translateY(40px) translateX(-10px);
    // transition: none!important;
    .icon-badge{
      display: flex;
      align-items: center;
      gap: 5px;
      border-radius: 4px;
      text-transform: capitalize;
    }
    .footer{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .description{
      margin-bottom: 10px;
      padding: 0 6px;
      font-size: 12px;
    }
    .ant-tooltip-inner {
        font-size: 12px;
        transform: translateY(40px) translateX(-10px);
        color: #3E4359;
        padding: 8px;
        border-radius: 15px;
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