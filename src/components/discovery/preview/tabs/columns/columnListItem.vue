<template>
    <div class="flex items-center mb-1">
        <component
            :is="dataTypeImage(asset)"
            class="flex-none w-auto h-4 mr-2 text-gray"
        ></component>
        <span
            class="
                flex-shrink
                pt-0.5
                mr-2
                overflow-hidden
                text-xs
                font-bold
                align-middle
                text-gray
                overflow-ellipsis
                cursor-pointer
            "
            @click="() => (showColumnSidebar = true)"
        >
            {{ asset.displayText }}
        </span>
        <div v-if="asset.attributes?.isPrimary" class="chip">
            <AtlanIcon icon="PrimaryKey" />
        </div>
        <!--  <div v-if="asset.attributes.isPrimary" class="chip">
            <AtlanIcon icon="ForeignKey" />
        </div> -->
    </div>

    <Description :selected-asset="asset" :using-in-info="false" />
    <teleport to="#overAssetPreviewSidebar">
        <a-drawer
            v-model:visible="showColumnSidebar"
            placement="right"
            :mask="false"
            :get-container="false"
            :keyboard="false"
            :destroy-on-close="true"
            :closable="false"
        >
            <AssetPreview
                :selected-asset="asset"
                page="nonBiOverview"
                :show-cross-icon="true"
                @closeSidebar="handleCloseColumnSidebar"
                @asset-mutation="propagateToColumnList"
            />
        </a-drawer>
    </teleport>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRefs } from 'vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AssetPreview from '@/discovery/preview/assetPreview.vue'
    import Description from '@common/sidebar/description.vue'

    export default defineComponent({
        name: 'ColumnListItem',
        components: {
            AssetPreview,
            Description,
        },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        emits: ['assetMutation'],

        setup(props, { emit }) {
            const { dataTypeImage } = useAssetInfo()

            const showColumnSidebar = ref<boolean>(false)

            const handleCloseColumnSidebar = () => {
                showColumnSidebar.value = false
            }
            const propagateToColumnList = (updatedAsset: assetInterface) => {
                emit('assetMutation', updatedAsset)
            }

            return {
                dataTypeImage,
                handleCloseColumnSidebar,
                showColumnSidebar,
                propagateToColumnList,
            }
        },
    })
</script>

<style scoped>
    :global(.ant-drawer-content-wrapper) {
        width: 420px !important;
        background-color: white !important;
    }
    .chip {
        @apply px-1 py-0.5 mr-1;
        @apply rounded;
        @apply flex;
        @apply items-center;
        @apply text-xs;
    }
</style>
