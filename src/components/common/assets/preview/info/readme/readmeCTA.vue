<template>
    <a-tooltip
        placement="left"
        :title="
            disabledCTA
                ? 'You don’t have access to edit Readme for this asset'
                : ''
        "
        :mouse-enter-delay="0.5"
        color="#2A2F45"
    >
        <div
            class="flex items-center p-3 border rounded-md cursor-pointer hover:shadow-sm border-new-gray-300"
            :class="{
                'border-dashed': !readmeGuid(asset) && !hoverOnCTA,
                'cursor-not-allowed opacity-70 bg-gray-100 border-new-gray-500':
                    disabledCTA,
            }"
            @click="showReadmeModal"
            @mouseenter="hoverOnCTA = true"
            @mouseleave="hoverOnCTA = false"
        >
            <div
                class="p-2 mr-2 rounded-md"
                :class="
                    hoverOnCTA && !disabledCTA
                        ? 'bg-new-blue-100'
                        : 'bg-new-gray-100'
                "
            >
                <AtlanIcon
                    icon="Readme"
                    class="w-5 h-5"
                    :class="
                        hoverOnCTA && !disabledCTA
                            ? 'text-new-blue-500'
                            : 'text-new-gray-800'
                    "
                />
            </div>
            <div v-if="readmeGuid(asset)" class="flex flex-col text-sm">
                <span
                    class="font-medium"
                    :class="
                        hoverOnCTA && !disabledCTA
                            ? 'text-new-blue-500'
                            : 'text-new-gray-800'
                    "
                    >View Readme</span
                >
                <div
                    v-if="
                        readme(asset)?.attributes?.__modifiedBy &&
                        readme(asset)?.attributes?.__modificationTimestamp
                    "
                    class="flex items-center text-sm text-new-gray-600"
                >
                    Updated
                    {{
                        useTimeAgo(
                            new Date(
                                readme(
                                    asset
                                )?.attributes?.__modificationTimestamp
                            )
                        ).value
                    }}
                    <span class="mx-2 dot"></span
                    >{{ readme(asset)?.attributes?.__modifiedBy }}
                </div>
            </div>

            <div v-else class="flex flex-col text-sm">
                <span
                    class="font-medium"
                    :class="
                        hoverOnCTA && !disabledCTA
                            ? 'text-new-blue-500'
                            : 'text-new-gray-800'
                    "
                    >+ Add Readme</span
                >
                <span class="text-new-gray-600">
                    Enrich your
                    {{ assetTypeLabel(asset) || asset.typeName }}
                    with Readme
                </span>
            </div>
        </div></a-tooltip
    >

    <a-modal
        v-model:visible="readmeVisible"
        :footer="null"
        :closable="false"
        :destroy-on-close="true"
        width="1000px"
    >
        <div
            v-if="isReadmeLoading"
            class="flex items-center justify-center w-full"
            style="height: 155px"
        >
            <AtlanLoader class="h-9" />
        </div>
        <ReadmeContent
            v-else
            :readme-asset="readmeAsset"
            :selected-asset="asset"
            :edit-permission="editPermission"
            :load-edit-mode="loadEditMode"
        />
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, PropType, computed } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useAssetAttributes } from '~/composables/discovery/useCurrentUpdate'
    import ReadmeContent from './readmeContent.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        components: { ReadmeContent },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default() {
                    return {}
                },
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
        },

        setup(props) {
            const { asset, editPermission } = toRefs(props)

            const { title, readmeGuid, readme, assetTypeLabel } = useAssetInfo()

            const readmeAttribute = ref(['readme'])

            const {
                asset: readmeAsset,
                mutate: mutateReadme,
                isReady: isReadmeReady,
                isLoading: isReadmeLoading,
            } = useAssetAttributes({
                id: asset.value?.guid,
                attributes: readmeAttribute,
            })

            const readmeVisible = ref<boolean>(false)

            const disabledCTA = computed(
                () => !editPermission.value && !readmeGuid(asset.value)
            )

            const hoverOnCTA = ref(false)

            const loadEditMode = ref(false)

            const showReadmeModal = () => {
                if (!disabledCTA.value) {
                    mutateReadme()
                    readmeVisible.value = true

                    const properties = {
                        asset_type: asset.value?.typeName,
                    }

                    useAddEvent(
                        'discovery',
                        'asset_sidebar',
                        'readme_previewed',
                        properties
                    )

                    if (!readmeGuid(asset.value)) {
                        loadEditMode.value = true
                        setTimeout(() => {
                            loadEditMode.value = false
                        }, 5000)
                    }
                }
            }

            return {
                title,
                showReadmeModal,
                readmeGuid,
                useTimeAgo,
                readme,
                assetTypeLabel,
                readmeVisible,
                readmeAsset,
                isReadmeLoading,
                hoverOnCTA,
                disabledCTA,
                loadEditMode,
            }
        },
    })
</script>

<style lang="less" scoped>
    .dot {
        height: 4px;
        width: 4px;
        @apply text-new-gray-300 inline-block rounded-full bg-new-gray-300;
    }
</style>
