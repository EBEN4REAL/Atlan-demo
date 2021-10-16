<template>
    <div class="w-full pb-4">
        <span class="pb-4 text-base font-bold capitalize">
            {{ assetTypeLabel[entity?.typeName] }} Summary
        </span>
        <div
            v-if="entity?.typeName !== 'AtlasGlossaryTerm'"
            class="flex mt-4 space-x-48"
        >
            <div class="flex flex-col">
                <span class="mb-2 text-sm leading-5 text-gray-500">
                    Categories
                </span>
                <span class="p-0 m-0 text-sm leading-5 text-gray-700"
                    >{{ categoryCount }}
                </span>
            </div>
            <div class="flex flex-col">
                <span class="mb-2 text-sm leading-5 text-gray-500">
                    Terms
                </span>
                <span class="p-0 m-0 text-sm leading-5 text-gray-700"
                    >{{ termCount }}
                </span>
            </div>
        </div>
        <div class="flex flex-col mt-4">
            <Description
                v-if="entity.guid"
                :selected-asset="entity"
                :editPermission="userHasEditPermission"
                @update:selected-asset="refreshEntity"
            />
        </div>
        <div class="flex mt-4 space-x-48">
            <div class="flex flex-col">
                <Status
                    v-if="entity.guid"
                    :selected-asset="entity"
                    :editPermission="userHasEditPermission"
                    @update:selected-asset="updateEntityAndTree"
                />
            </div>
            <div class="flex flex-col">
                <Owners
                    v-if="entity.guid"
                    :selected-asset="entity"
                    :editPermission="userHasEditPermission"
                    @update:selected-asset="updateEntityAndTree"
                />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed, PropType, inject } from 'vue'
    import Owners from '@common/sidebar/owners.vue'
    import Description from '@common/sidebar/description.vue'
    import Status from '@common/sidebar/status.vue'
    import assetTypeLabel from '@/glossary/constants/assetTypeLabel'
    import { useAccessStore } from '~/services/access/accessStore'

    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: { Owners, Description, Status },
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
            },
        },
        setup(props) {
            const updateTreeNode = inject<any>('updateTreeNode')
            const shortDescription = computed(
                () => props.entity?.attributes?.shortDescription
            )
            const termCount = computed(() => {
                if (
                    props.entity?.typeName === 'AtlasGlossary' ||
                    props.entity.typeName === 'AtlasGlossaryCategory'
                ) {
                    return props.entity?.attributes?.terms?.length
                }
                return 0
            })
            const categoryCount = computed(() => {
                if (props.entity?.typeName === 'AtlasGlossary') {
                    return props.entity?.attributes?.categories?.length
                }
                return 0
            })
            const store = useAccessStore()
            const permissionMap = {
                AtlasGlossary: 'UPDATE_GLOSSARY',
                AtlasGlossaryCategory: 'UPDATE_CATEGORY',
                AtlasGlossaryTerm: 'UPDATE_TERM',
            }
            const userHasEditPermission = computed(() =>
                store.checkPermission(permissionMap[props.entity.typeName])
            )
            const updateEntityAndTree = (
                selectedAsset: Glossary | Category | Term
            ) => {
                if (updateTreeNode) {
                    updateTreeNode({
                        guid: selectedAsset.guid,
                        entity: selectedAsset,
                    })
                }
            }

            return {
                shortDescription,
                termCount,
                categoryCount,
                assetTypeLabel,
                updateEntityAndTree,
                userHasEditPermission,
            }
        },
    })
</script>
