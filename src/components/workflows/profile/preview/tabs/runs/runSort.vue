<template>
    <a-popover trigger="click" placement="bottomRight">
        <template #content>
            <div
                class="flex flex-col py-1 rounded gap-y-3 preference-container"
            >
                <div class="flex items-center justify-between text-gray">
                    <span class="mr-6 text-sm text-gray">Order By</span>
                    <a-select
                        v-model:value="sortValue"
                        class="text-gray-500"
                        style="width: 135px"
                        @change="handeChangeSorting"
                    >
                        <a-select-option
                            v-for="item in sortOptions"
                            :key="item.value"
                            :value="item.value"
                            >{{ item.label }}</a-select-option
                        >
                    </a-select>
                </div>
            </div>
        </template>
        <a-button class="p-2 ml-2 rounded">
            <AtlanIcon :icon="dot ? 'FilterDot' : 'Filter'" class="w-4 h-4" />
        </a-button>
    </a-popover>
</template>

<script>
    import { ref, defineComponent } from 'vue'

    export default defineComponent({
        emits: ['change'],
        setup(props, { emit }) {
            const sortValue = ref('name')
            const sortOptions = [
                // TODO Confirm filter list and implement
                { label: 'Most recent', value: 'time' },
                { label: 'Least recent', value: '-time' },
            ]
            const handeChangeSorting = (value) => {
                emit('change', value)
            }
            return { sortValue, sortOptions, handeChangeSorting }
        },
    })
</script>
