<template>
    <div class="flex flex-col gap-y-1" :key="index">
        <div class="flex items-center gap-x-1">
            <a-select class="flex-1"></a-select>
            <a-button size="small">
                <AtlanIcon
                    icon="Trash"
                    class="h-3 text-gray-500"
                    @click="handleRemove"
                ></AtlanIcon
            ></a-button>
        </div>

        <DynamicInput :dataType="property.typeName"></DynamicInput>
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { defineComponent, PropType, toRefs, ref } from 'vue'

    import DynamicInput from '@/common/input/dyanmicInput.vue'

    export default defineComponent({
        name: 'TermPopover',
        components: { DynamicInput },
        props: {
            property: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            condition: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            index: {
                required: false,
            },
        },
        emits: ['clear'],
        setup(props, { emit }) {
            const { condition } = useVModels(props)

            const localCondition = ref(condition.value)

            const handleRemove = () => {
                emit('clear')
            }

            return {
                localCondition,
                handleRemove,
            }
        },
    })
</script>

<style lang="less" module></style>
