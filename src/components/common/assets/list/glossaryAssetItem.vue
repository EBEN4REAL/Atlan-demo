<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div
        class="mx-3 my-1 transition-all duration-300 hover:bg-primary-light"
        :class="isSelected ? 'outline-primary bg-primary-light shadow-sm' : ''"
        @click="onListItemClick(item)"
    >
        <div class="flex flex-col">
            <div class="flex items-start flex-1 px-3 py-3" :class="checkable ? 'justify-between items-center' : '' ">
                <div
                    class="box-border flex flex-col flex-1 overflow-hidden  gap-y-1 lg:pr-16"
                >
                    <div class="flex flex-col">
                        <div class="flex items-center">
                            <AtlanIcon
                                icon="Category"
                                class="h-4 mb-1 mr-1"
                                v-if="
                                    ['atlasglossarycategory'].includes(
                                        item.typeName?.toLowerCase()
                                    )
                                "
                            ></AtlanIcon>
                            <AtlanIcon
                                icon="Term"
                                class="h-4 mb-1 mr-1"
                                v-if="
                                    ['atlasglossaryterm'].includes(
                                        item.typeName?.toLowerCase()
                                    )
                                "
                            ></AtlanIcon>

                            <router-link
                                :to="assetURL(item)"
                                class="flex-shrink mb-0 mr-1 overflow-hidden text-base font-bold truncate cursor-pointer  text-primary hover:underline overflow-ellipsis whitespace-nowrap"
                            >
                                {{ title(item) }}
                            </router-link>
                        </div>
                        <div class="flex mt-0" v-if="description(item)">
                            <span class="text-sm text-gray-700">{{
                                description(item)
                            }}</span>
                        </div>

                        <div class="flex items-center mt-1">
                            <div
                                class="flex items-center mr-3 text-sm text-gray-500  gap-x-1"
                                v-if="categories(item)?.length > 0"
                            >
                                in
                                <div
                                    v-for="(cat, index) in categories(item)"
                                    class="flex"
                                    :key="cat.guid"
                                    v-if="
                                        ['atlasglossaryterm'].includes(
                                            item.typeName?.toLowerCase()
                                        )
                                    "
                                >
                                    <AtlanIcon
                                        icon="Category"
                                        class="h-4 mt-0.5 mr-1"
                                    ></AtlanIcon>
                                    {{ cat.attributes?.name }}
                                    <span
                                        v-if="
                                            index ===
                                                categories(item).length - 2 &&
                                            categories(item).length > 1
                                        "
                                        class="ml-1"
                                    >
                                        and
                                    </span>
                                    <span
                                        v-else-if="
                                            index !==
                                            categories(item).length - 1
                                        "
                                        >,</span
                                    >
                                </div>
                            </div>
                            <div
                                class="flex items-center mr-3 text-sm text-gray-500  gap-x-1"
                                v-if="parentCategory(item)"
                            >
                                in
                                <div
                                    class="flex"
                                    :key="parentCategory(item).guid"
                                    v-if="
                                        ['atlasglossarycategory'].includes(
                                            item.typeName?.toLowerCase()
                                        )
                                    "
                                >
                                    <AtlanIcon
                                        icon="Category"
                                        class="h-4 mt-0.5 mr-1"
                                    ></AtlanIcon>
                                    {{ parentCategory(item).attributes?.name }}
                                </div>
                            </div>
                            <div
                                class="flex items-center text-sm text-gray-500"
                            >
                                <AtlanIcon
                                    icon="Glossary"
                                    class="h-4 mr-1"
                                ></AtlanIcon>
                                {{ getAnchorName(item) }}
                            </div>
                        </div>
                    </div>
                </div>
                <a-checkbox v-if="checkable" :checked="isChecked" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed, ref } from 'vue'
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
            checkable: {
                type: Boolean,
                required: false,
                default: false,
            },
            checked: {
                type: Boolean,
                required: false,
                default: false,
            }
        },
        emits: ['listItem:check', 'unlinkAsset', 'preview', 'check'],
        setup(props, { emit }) {
            const { preference, selectedGuid, item, checkable } = toRefs(props)
            const isChecked = ref(props.checked)

            const handlePreview = (item: any) => {
                emit('preview', item)
            }

            const onListItemClick = (item) => {
                if(checkable) {
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
                description,
                categories,
                parentCategory,
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
                isChecked
            }
        },
    })
</script>
