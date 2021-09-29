<template>
    <a-checkbox-group
        v-model:value="data.checked"
        class="w-full px-4 py-1 pb-3"
        @change="$emit('change')"
    >
        <div class="flex flex-col w-full gap-y-3">
            <div
                v-for="item in list"
                :key="item.id"
                class="flex items-center justify-between"
            >
                <a-checkbox :value="item.id"
                    ><span class="mb-0 ml-1 text-gray">
                        {{ item.label }}
                    </span>
                </a-checkbox>

                <a-tooltip placement="right" color="white">
                    <AtlanIcon
                        icon="Overview"
                        class="opacity-50 hover:opacity-100"
                    />
                    <template #title>
                        <span class="text-gray-500">
                            {{ item.popoverText }}
                        </span>
                    </template>
                </a-tooltip>
            </div>
        </div>
    </a-checkbox-group>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import { List } from '~/constant/assetCategory'
    import { Collapse } from '~/types'

    export default defineComponent({
        props: {
            item: {
                type: Object as PropType<Collapse>,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
        },
        emits: ['change'],
        setup(props) {
            const list = computed(() => List)
            const { data } = toRefs(props)

            return {
                data,
                list,
            }
        },
    })
</script>

<style scoped>
    :global(.ant-tooltip-arrow) {
        display: none;
    }
</style>
