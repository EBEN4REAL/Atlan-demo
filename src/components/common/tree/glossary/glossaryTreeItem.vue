<template>
    <div class="flex items-center justify-between w-full py-0 m-0 group">
        <div
            v-if="item?.typeName === 'cta'"
            class="flex items-center space-x-2"
        >
            <AddGtcModal
                entityType="AtlasGlossaryTerm"
                :glossaryName="getAnchorName(item) || title(item)"
                :categoryName="title(item)"
                :categoryGuid="categoryId"
                :glossary-qualified-name="glossaryQualifiedName"
                @add="handleAdd"
            >
                <template #trigger>
                    <div class="flex items-center hover:underline text-primary">
                        <AtlanIcon icon="Term" class="m-0 mr-2" />
                        <p class="p-0 m-0">Add Term</p>
                    </div>
                </template>
            </AddGtcModal>
            <AddGtcModal
                entityType="AtlasGlossaryCategory"
                :glossaryName="getAnchorName(item) || title(item)"
                :categoryName="title(item)"
                :categoryGuid="categoryId"
                :glossary-qualified-name="glossaryQualifiedName"
                @add="handleAdd"
            >
                <template #trigger>
                    <div class="flex items-center hover:underline text-primary">
                        <AtlanIcon icon="Category" class="m-0 mr-2" />
                        <p class="p-0 m-0">Add Category</p>
                    </div>
                </template>
            </AddGtcModal>
        </div>
        <div
            v-else
            class="flex items-center justify-between w-full py-0 m-0 group"
        >
            <div class="flex items-center py-1 pr-2">
                <AtlanIcon
                    :icon="
                        getEntityStatusIcon(
                            item.typeName,
                            certificateStatus(item)
                        )
                    "
                    :style="iconSize"
                    class="self-center"
                />

                <span class="ml-1 text-sm" :class="textClass">{{
                    title(item)
                }}</span>
            </div>

            <div v-if="item.dataRef.isLoading">
                <a-spin
                    size="small"
                    icon="Loader"
                    class="w-auto h-4 mr-1 animate-spin"
                ></a-spin>
            </div>
            <div v-else-if="!item.dataRef.isLoading && item.dataRef.isError">
                <AtlanIcon icon="Error"></AtlanIcon>
            </div>
            <div v-else-if="!checkable" class="hidden group-hover:flex">
                <Actions
                    :treeMode="true"
                    :glossaryName="getAnchorName(item) || title(item)"
                    :categoryName="title(item)"
                    :categoryGuid="categoryId"
                    :entity="item"
                ></Actions>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    // library
    import { computed, defineComponent, PropType, toRefs, inject, ref } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import Actions from './actions.vue'
    import AddGtcModal from '@/glossary/modal/addGtcModal.vue'

    import {
        Glossary,
        Term,
        Category,
    } from '~/types/glossary/glossary.interface'
    import AtlanIcon from '../../icon/atlanIcon.vue'

    export default defineComponent({
        components: { Actions, AtlanIcon, AddGtcModal },
        props: {
            item: {
                type: Object as PropType<Glossary | Term | Category>,
                required: false,
                default: () => {},
            },
            checkable: {
                type: Boolean,
                required: false,
                default: false
            }
        },

        setup(props, { emit }) {
            // data
            const { item } = toRefs(props)
            const { getEntityStatusIcon } = useGlossaryData()
            const {
                certificateStatus,
                title,
                getAnchorQualifiedName,
                getAnchorName,
            } = useAssetInfo()

            const iconSize = computed(() => {
                if (item.value.typeName === 'AtlasGlossary') {
                    return 'height: 18px !important'
                }

                return 'height: 16px !important'
            })
            const glossaryQualifiedName = computed(() => {
                if (item.value.typeName === 'AtlasGlossary') {
                    return item.value?.attributes?.qualifiedName
                }
                if (item.value.typeName === 'cta') {
                    if (
                        item.value?.parentCategory?.typeName === 'AtlasGlossary'
                    )
                        return item.value?.parentCategory?.attributes
                            ?.qualifiedName
                    return getAnchorQualifiedName(item.value?.parentCategory)
                }
                return getAnchorQualifiedName(item.value)
            })
            const categoryId = computed(() => {
                if (props.entity?.typeName === 'AtlasGlossaryCategory')
                    return props.entity?.guid
                return ''
            })

            const textClass = computed(() => {
                if (item.value.typeName === 'AtlasGlossary') {
                    return 'text-sm text-gray-700'
                }
                if (item.value.typeName === 'AtlasGlossaryCategory') {
                    return 'text-sm text-gray-500'
                }

                return 'text-sm text-gray-700'
            })
            const addGTCNode = inject('addGTCNode')
            const handleAdd = (asset) => {
                addGTCNode(asset, item.value.parentCategory)
            }

            return {
                getEntityStatusIcon,
                certificateStatus,
                title,
                iconSize,
                textClass,
                getAnchorQualifiedName,
                getAnchorName,
                handleAdd,
                glossaryQualifiedName,
                categoryId,
            }
        },
    })
</script>
<style lang="less" module></style>
