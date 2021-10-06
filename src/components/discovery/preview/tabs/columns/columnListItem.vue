<template>
    <div
        class="flex px-3 py-2 -mx-3 -my-2 rounded hover:bg-primary-light group"
    >
        <div class="flex-grow overflow-hidden">
            <ColumnInfoCard :column-asset="asset">
                <div class="flex items-center mb-1">
                    <component
                        :is="dataTypeImage(asset)"
                        class="flex-none w-auto h-4 mr-2 text-gray-500"
                    ></component>
                    <span
                        class="
                            flex-shrink
                            pt-0.5
                            mr-2
                            overflow-hidden
                            text-sm
                            font-bold
                            align-middle
                            text-primary
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
            </ColumnInfoCard>
            <Description :selected-asset="asset" :using-in-info="false" />
            <ScrollStrip v-if="asset.classifications">
                <Pill
                    v-for="clsf in asset.classifications"
                    :key="clsf.typeName"
                    class="flex-none"
                    :label="clsf.typeName"
                    :has-action="false"
                    size="sm"
                >
                    <template #prefix>
                        <AtlanIcon icon="Shield" class="h-3 text-pink-400" />
                    </template>
                </Pill>
            </ScrollStrip>
        </div>
        <!-- <AtlanBtn
            class="flex-none opacity-0 group-hover:opacity-100"
            size="sm"
            color="secondary"
            padding="compact"
        >
            <AtlanIcon icon="KebabMenu" class="-mx-1"></AtlanIcon>
        </AtlanBtn> -->
        <ColumnListMenu :asset="asset" />
    </div>
    <teleport to="#overAssetPreviewSidebar">
        <a-drawer
            v-if="showColumnSidebar"
            v-model:visible="showColumnSidebar"
            placement="right"
            :mask="false"
            :get-container="false"
            :wrap-style="{ position: 'absolute', width: '100%' }"
            :keyboard="false"
            :destroy-on-close="true"
            :closable="false"
            width="100%"
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
    import { defineComponent, PropType, ref } from 'vue'
    import Description from '@common/sidebar/description.vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AssetPreview from '@/discovery/preview/assetPreview.vue'
    import ColumnInfoCard from './columnInfoCard.vue'
    import ColumnListMenu from './columnListMenu.vue'
    import AtlanBtn from '@/UI/button.vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import ScrollStrip from '@/UI/scrollStrip.vue'

    export default defineComponent({
        name: 'ColumnListItem',
        components: {
            AssetPreview,
            Description,
            ColumnInfoCard,
            ColumnListMenu,
            AtlanBtn,
            Pill,
            ScrollStrip,
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
    .chip {
        @apply px-1 py-0.5 mr-1;
        @apply rounded;
        @apply flex;
        @apply items-center;
        @apply text-xs;
    }
</style>
