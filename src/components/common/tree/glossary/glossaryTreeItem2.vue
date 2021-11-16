<template>
    <div class="flex items-center py-0 m-0">
        <AtlanIcon
            :icon="getEntityStatusIcon(item.typeName, certificateStatus(item))"
            :style="iconSize"
        />

        <span class="ml-1 text-sm" :class="textClass">{{ title(item) }}</span>
    </div>
</template>
<script lang="ts">
    // library
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'

    import {
        Glossary,
        Term,
        Category,
    } from '~/types/glossary/glossary.interface'

    export default defineComponent({
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
            const { certificateStatus, title } = useAssetInfo()

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
            }
        },
    })
</script>
<style lang="less" module></style>
