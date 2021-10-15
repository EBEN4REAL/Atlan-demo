<template>
    <a-tooltip 
    placement="topLeft" 
    :overlayClassName="`toolTips-badge ${status(data)?.toLowerCase()}`" 
    >
        <template #title>
            <div>
            <div v-if="data?.attributes?.description" class="description">{{data?.attributes?.description}}</div>
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