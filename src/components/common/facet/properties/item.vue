<template>
    <div
        class="flex items-center justify-between px-2 py-1 mb-1 rounded hover:border-primary hover:bg-primary-menu"
        :class="
            activeProperty === attribute.name
                ? 'outline-primary bg-primary-menu'
                : ''
        "
    >
        <div
            class="w-full"
            :class="isApplied ? 'text-primary font-bold' : 'text-gray-700'"
        >
            <Truncate :tooltipText="attribute.displayName" :rows="2" />
        </div>
        <div :class="isApplied ? 'text-primary font-bold' : 'text-gray-500'">
            <AtlanIcon icon="CaretRight" class="h-3"></AtlanIcon>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed } from 'vue'
    import { defineComponent, toRefs } from 'vue'
    import Truncate from '@/common/ellipsis/index.vue'

    export default defineComponent({
        components: { Truncate },
        props: {
            attribute: {
                required: false,
                default() {
                    return {}
                },
            },
            activeProperty: {
                required: false,
                default() {
                    return ''
                },
            },
            condition: {
                required: false,
                default() {
                    return []
                },
            },
        },
        setup(props, { emit }) {
            const { attribute, activeProperty, condition } = toRefs(props)

            const isApplied = computed(() => {
                return !!condition.value?.find(
                    (i) => i.operand === attribute.value.name && i.value
                )
            })

            return {
                attribute,
                activeProperty,
                condition,
                isApplied,
            }
        },
    })
</script>
