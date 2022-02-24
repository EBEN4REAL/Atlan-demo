<template>
    <div
        class="flex flex-col p-4 bg-white border border-gray-300 rounded-lg shadow-lg cursor-pointer hover:border-primary hover:shadow-lg hover:translate-y-2"
        :class="isSelected ? 'border-primary shadow-lg ' : ''"
    >
        <div v-if="item.metadata.annotations" class="flex items-center mb-2">
            <div
                class="relative flex-none w-10 h-10 p-2 mr-2 bg-white border border-gray-200 rounded-full"
            >
                <img
                    v-if="
                        item.metadata.annotations[
                            'orchestration.atlan.com/icon'
                        ]
                    "
                    class="self-center w-6 h-6"
                    :src="
                        item.metadata.annotations[
                            'orchestration.atlan.com/icon'
                        ]
                    "
                />
                <span
                    v-else-if="
                        item.metadata.annotations[
                            'orchestration.atlan.com/emoji'
                        ]
                    "
                    class="self-center w-6 h-6"
                >
                    {{
                        item.metadata.annotations[
                            'orchestration.atlan.com/emoji'
                        ]
                    }}</span
                >
                <span v-else class="self-center w-6 h-6">
                    {{ '\ud83d\udce6' }}</span
                >

                <div
                    v-if="
                        item.metadata.labels[
                            'orchestration.atlan.com/certified'
                        ] === 'true'
                    "
                    class="absolute -right-1 -top-2"
                >
                    <a-tooltip title="Certified" placement="left">
                        <span>
                            <AtlanIcon icon="Verified" class="ml-1"></AtlanIcon
                        ></span>
                    </a-tooltip>
                </div>
            </div>
            <div class="flex flex-col flex-1 overflow-hidden">
                <span
                    class="text-sm font-bold truncate cursor-pointer overflow-ellipsis text-primary"
                    @click="handleClick"
                >
                    {{
                        item.metadata.annotations[
                            'orchestration.atlan.com/name'
                        ]
                    }}
                </span>
                <div class="flex text-sm truncate overflow-ellipsis">
                    By
                    {{
                        item.metadata.annotations['package.argoproj.io/author']
                    }}
                </div>
            </div>
        </div>

        <span class="text-sm line-clamp-3">
            {{
                item.metadata.annotations['package.argoproj.io/description']
            }}</span
        >
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'

    export default defineComponent({
        name: 'PackageItem',
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            selectedItem: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['loadMore', 'select'],
        setup(props, { emit }) {
            const { item, selectedItem } = toRefs(props)
            const isSelected = computed(
                () =>
                    item.value?.metadata.name ===
                    selectedItem.value?.metadata.name
            )

            const handleClick = () => {
                emit('select', item.value)
            }

            return {
                item,
                isSelected,
                handleClick,
            }
        },
    })
</script>

<style lang="less" scoped></style>
