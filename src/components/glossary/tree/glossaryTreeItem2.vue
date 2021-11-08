<template>
    <div class="flex items-center m-0">
        <AtlanIcon
            :icon="getEntityStatusIcon(item.typeName, certificateStatus(item))"
        />

        <span class="my-auto text-sm leading-5 text-gray-700">{{
            title(item)
        }}</span>
    </div>
</template>
<script lang="ts">
    // library
    import { defineComponent, PropType, toRefs } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useGlossaryInfo from '~/composables/glossary2/useGlossaryInfo'

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

            const { getEntityStatusIcon } = useGlossaryInfo()
            const { certificateStatus, title } = useAssetInfo()

            return { getEntityStatusIcon, certificateStatus, title }
        },
    })
</script>
<style lang="less" module></style>
