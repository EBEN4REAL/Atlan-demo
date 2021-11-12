<template>
    <div
        class="flex items-center justify-between px-2 py-1 rounded  hover:border-primary hover:bg-primary-light"
        :class="
            activeProperty === item.name
                ? 'outline-primary bg-primary-light'
                : ''
        "
    >
        <div :class="isApplied ? 'text-primary font-bold' : 'text-gray-700'">
            {{ item.displayName }}
        </div>
        <div :class="isApplied ? 'text-primary font-bold' : 'text-gray-500'">
            <AtlanIcon icon="CaretRight" class="h-3"></AtlanIcon>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed } from 'vue'
    import { defineComponent, toRefs } from 'vue'

    export default defineComponent({
        components: {},
        props: {
            item: {
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
            const { item, activeProperty, condition } = toRefs(props)

            const isApplied = computed(() => {
                console.log(condition)
                return !!condition.value?.find(
                    (i) => i.operand === item.value.name && i.value
                )
            })

            return {
                item,
                activeProperty,
                condition,
                isApplied,
            }
        },
    })
</script>
