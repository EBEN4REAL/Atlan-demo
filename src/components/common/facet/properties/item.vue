<template>
    <div
        class="flex items-center justify-between px-2 py-1 mb-1 border-0 rounded border-primary hover:bg-primary-menu hover:border-1"
        :class="selectedClass"
    >
        <div
            class="w-full cursor-default"
            :class="isApplied ? 'text-primary font-bold' : 'text-gray-700'"
        >
            <Truncate
                :tooltipText="attribute.displayName"
                :rows="2"
                :classes="appliedClasses"
            />
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

            const selectedClass = computed(() => {
                if (activeProperty.value === attribute.value.name)
                    return 'outline-primary bg-primary-menu'
                if (isApplied.value) return 'bg-primary-menu'
                return ''
            })
            const appliedClasses = computed(() => {
                if (
                    isApplied.value ||
                    activeProperty.value === attribute.value.name
                )
                    return 'text-primary font-semibold'
                return ''
            })

            return {
                attribute,
                activeProperty,
                condition,
                isApplied,
                selectedClass,
                appliedClasses,
            }
        },
    })
</script>
