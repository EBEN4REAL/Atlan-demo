<template>
    <div
        class="flex flex-col p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-primary hover:shadow-lg hover:translate-y-2"
        :class="isSelected ? 'border-primary shadow-lg' : ''"
    >
        <div class="flex items-center mb-2" v-if="item.metadata.annotations">
            <div
                class="relative w-10 h-10 p-2 mr-2 bg-white border border-gray-200 rounded-full"
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
                        <AtlanIcon icon="Verified" class="ml-1"></AtlanIcon>
                    </a-tooltip>
                </div>
            </div>
            <div class="flex flex-col w-2/3">
                <div class="text-sm font-bold truncate overflow-ellipsis">
                    {{
                        item.metadata.annotations[
                            'orchestration.atlan.com/name'
                        ]
                    }}
                </div>
                <div class="flex text-sm truncate overflow-ellipsis">
                    By
                    {{
                        item.metadata.annotations['package.argoproj.io/author']
                    }}
                </div>
            </div>
        </div>

        <div class="text-sm line-clamp-3">
            <span>
                {{
                    item.metadata.annotations['package.argoproj.io/description']
                }}</span
            >
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'

    export default defineComponent({
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
        emits: ['loadMore'],
        setup(props, { emit }) {
            const { item, selectedItem } = toRefs(props)
            const isSelected = computed(
                () =>
                    item.value?.metadata.name ===
                    selectedItem.value?.metadata.name
            )
            return {
                item,
                isSelected,
            }
        },
        components: { AtlanIcon },
    })
</script>

<style lang="less" scoped></style>
