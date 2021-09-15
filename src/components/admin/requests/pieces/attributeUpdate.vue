<template>
    <span class="pr-2 text-gray-500">{{ attrLabel }}:</span>
    <span class="overflow-ellipsis text-gray">{{ value }}</span>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'

    export default defineComponent({
        props: {
            name: { type: String, required: true },
            value: { type: String, required: true },
        },
        setup(props) {
            const { name } = toRefs(props)
            const labelMap = {
                userDescription: 'DESC',
                assetStatus: 'STATUS',
            }

            const attrLabel = computed(() => labelMap[name.value] || 'ATTR')

            return { attrLabel }
        },
    })
</script>
