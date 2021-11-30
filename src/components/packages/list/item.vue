<template>
    <div
        class="flex flex-col p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-primary hover:shadow-lg hover:translate-y-2"
        :class="isSelected ? 'border-primary shadow-lg' : ''"
    >
        <div class="flex items-center mb-2" v-if="item.metadata.annotations">
            <img
                v-if="item.metadata.annotations['com.atlan.orchestration/icon']"
                class="self-center w-5 h-auto mr-2"
                :src="item.metadata.annotations['com.atlan.orchestration/icon']"
            />
            <div class="text-base font-bold truncate overflow-ellipsis">
                {{ item.metadata.annotations['workflows.argoproj.io/name'] }}
            </div>
        </div>

        <div class="flex-grow text-sm line-clamp-4">
            <span v-if="item.metadata.annotations">
                {{
                    item.metadata.annotations[
                        'workflows.argoproj.io/description'
                    ]
                }}</span
            >
        </div>
        <div
            class="flex content-end mt-3 text-gray-500"
            v-if="item.metadata.annotations"
        >
            <div class="text-sm truncate overflow-ellipsis">
                {{
                    item.metadata.annotations[
                        'com.atlan.orchestration/packageName'
                    ]
                }}
            </div>
            <div class="text-sm truncate overflow-ellipsis">
                (v{{ item.metadata.labels['org.argopm.package.version'] }})
            </div>
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
    })
</script>

<style lang="less" scoped></style>
