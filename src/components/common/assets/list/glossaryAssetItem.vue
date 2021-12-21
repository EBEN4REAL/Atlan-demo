<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div
        class="mx-3 transition-all duration-300 hover:bg-primary-light"
        :class="isSelected ? 'outline-primary bg-primary-light shadow-sm' : ''"
        @click="onListItemClick(item)"
    >
        <div class="flex flex-col">
            <div
                class="flex items-start px-3 py-2"
                :class="checkable ? 'justify-between items-center' : ''"
            >
                <div class="flex items-center w-full">
                    <!-- Line 1: G or T or C -->
                    <AtlanIcon
                        v-if="
                            ['atlasglossarycategory'].includes(
                                item.typeName?.toLowerCase()
                            )
                        "
                        icon="Category"
                        class="w-4 h-5 mb-1 mr-1"
                    ></AtlanIcon>
                    <AtlanIcon
                        v-if="
                            ['atlasglossaryterm'].includes(
                                item.typeName?.toLowerCase()
                            )
                        "
                        icon="Term"
                        class="w-4 h-5 mb-1 mr-1"
                    ></AtlanIcon>
                    <div class="flex flex-col w-full ml-1">
                        <!-- <div class="flex items-center w-full">
                            <router-link
                                :to="assetURL(item)"
                                class="w-full mb-0 mr-1 font-bold cursor-pointer text-primary hover:underline"
                            >
                                <Tooltip
                                    :tooltip-text="`${title(item)}`"
                                    :classes="'w-full '"
                                />
                            </router-link>
                            <CertificateBadge
                                v-if="certificateStatus(item)"
                                :status="certificateStatus(item)"
                                :username="certificateUpdatedBy(item)"
                                :timestamp="certificateUpdatedAt(item)"
                                class="mb-1 ml-1"
                            ></CertificateBadge>
                        </div> -->
                        <div
                            class="flex items-center py-0 pr-2 font-bold cursor-pointer"
                            style="max-width: 80%"
                        >
                            <Tooltip
                                :tooltip-text="`${title(item)}`"
                                :classes="'text-primary'"
                                @click="handleClick"
                            />
                            <div class="w-4">
                                <CertificateBadge
                                    v-if="certificateStatus(item)"
                                    :status="certificateStatus(item)"
                                    :username="certificateUpdatedBy(item)"
                                    :timestamp="certificateUpdatedAt(item)"
                                    class="mb-1 ml-1"
                                ></CertificateBadge>
                            </div>
                        </div>

                        <div class="flex items-center">
                            <div
                                class="flex items-center text-xs text-gray-500"
                            >
                                {{ getAnchorName(item) }}
                            </div>
                        </div>
                    </div>
                </div>
                <a-checkbox
                    v-if="checkable && item.typeName === 'AtlasGlossaryTerm'"
                    :checked="isChecked"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed, ref } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        name: 'AssetListItem',
        components: {
            CertificateBadge,
            Tooltip,
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
            checkable: {
                type: Boolean,
                required: false,
                default: false,
            },
            checked: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['listItem:check', 'unlinkAsset', 'preview', 'check'],
        setup(props, { emit }) {
            const { preference, selectedGuid, item, checkable } = toRefs(props)
            const isChecked = ref(props.checked)

            const router = useRouter()
            const handlePreview = (item: any) => {
                emit('preview', item)
            }

            const onListItemClick = (item) => {
                if (checkable.value) {
                    isChecked.value = !isChecked.value
                    emit('check', item, isChecked.value)
                }
                handlePreview(item)
            }
            const isSelected = computed(() => {
                if (selectedGuid.value === item?.value?.guid) {
                    return true
                }
                return false
            })

            const assetURL = (asset) => ({
                path: `/glossary/${asset.guid}/overview`,
            })
            const handleClick = () => {
                if (!props.checkable) router.push(assetUrl)
                console.log('clicked')
            }
            const {
                title,
                assetType,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getAnchorName,
                description,
                categories,
                parentCategory,
                getEntityStatusIcon,
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
                description,
                categories,
                parentCategory,
                onListItemClick,
                isChecked,
                getEntityStatusIcon,
                handleClick,
            }
        },
    })
</script>
