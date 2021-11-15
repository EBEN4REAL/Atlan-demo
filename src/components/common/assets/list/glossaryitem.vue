<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div
        class="mx-3 my-1 transition-all duration-300 hover:bg-primary-light"
        :class="isSelected ? 'outline-primary bg-primary-light shadow-sm' : ''"
        @click="handlePreview(item)"
    >
        <div class="flex flex-col">
            <div class="flex items-start flex-1 px-3 py-3">
                <div
                    class="box-border flex flex-col flex-1 overflow-hidden  gap-y-1 lg:pr-16"
                >
                    <div class="flex items-center mb-0 overflow-hidden">
                        <div
                            class="flex mr-1"
                            v-if="
                                ['atlasglossarycategory'].includes(
                                    item.typeName?.toLowerCase()
                                )
                            "
                        >
                            <AtlanIcon icon="Category" class="h-7"></AtlanIcon>
                        </div>
                        <div
                            class="flex mr-1"
                            v-if="
                                ['atlasglossaryterm'].includes(
                                    item.typeName?.toLowerCase()
                                )
                            "
                        >
                            <AtlanIcon icon="Term" class="h-7"></AtlanIcon>
                        </div>
                        <div class="flex flex-col">
                            <router-link
                                :to="assetURL(item)"
                                class="flex-shrink mb-0 mr-1 overflow-hidden font-bold truncate cursor-pointer  text-md text-primary hover:underline overflow-ellipsis whitespace-nowrap"
                            >
                                {{ title(item) }}
                            </router-link>
                            <div
                                class="flex items-center text-sm text-gray-500"
                            >
                                {{ getAnchorName(item) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'

    export default defineComponent({
        name: 'AssetListItem',
        components: {
            CertificateBadge,
        },
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            selectedGuid: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            preference: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            showThreeDotMenu: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['listItem:check', 'unlinkAsset', 'preview'],
        setup(props, { emit }) {
            const { preference, selectedGuid, item } = toRefs(props)

            const handlePreview = (item: any) => {
                emit('preview', item)
            }

            const isSelected = computed(() => {
                if (selectedGuid.value === item?.value?.guid) {
                    return true
                }
                return false
            })

            const assetURL = (asset) => ({
                path: `/glossary/${asset.guid}`,
            })

            const {
                title,
                assetType,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getAnchorName,
            } = useAssetInfo()

            return {
                title,

                assetType,

                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                isSelected,
                getAnchorName,
                preference,
                handlePreview,
                assetURL,
                selectedGuid,
            }
        },
    })
</script>
