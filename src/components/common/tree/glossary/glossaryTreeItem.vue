<template>
    <div class="flex items-center justify-between w-full py-0 m-0 group">
        <div class="flex items-center">
            <AtlanIcon
                :icon="
                    getEntityStatusIcon(item.typeName, certificateStatus(item))
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

        <Actions
            v-else
            :treeMode="true"
            :glossaryName="getAnchorName(item) || title(item)"
            :categoryName="title(item)"
            :categoryGuid="item.guid"
            :entity="item"
        ></Actions>
    </div>
</template>
<script lang="ts">
    // library
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import Actions from './actions.vue'

    import {
        Glossary,
        Term,
        Category,
    } from '~/types/glossary/glossary.interface'
    import AtlanIcon from '../../icon/atlanIcon.vue'

    export default defineComponent({
        components: { Actions, AtlanIcon },
        props: {
            item: {
                type: Object as PropType<Glossary | Term | Category>,
                required: false,
                default: () => {},
            },
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

            const textClass = computed(() => {
                if (item.value.typeName === 'AtlasGlossary') {
                    return 'text-sm text-gray-700'
                }
                if (item.value.typeName === 'AtlasGlossaryCategory') {
                    return 'text-sm text-gray-500'
                }

                return 'text-sm text-gray-700'
            })

            return {
                getEntityStatusIcon,
                certificateStatus,
                title,
                iconSize,
                textClass,
                getAnchorQualifiedName,
                getAnchorName,
            }
        },
    })
</script>
<style lang="less" module></style>
