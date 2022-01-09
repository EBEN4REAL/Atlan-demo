<template>
    <div
        class="flex flex-col p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-primary hover:shadow-lg hover:translate-y-2"
        :class="isSelected ? 'border-primary shadow-lg' : ''"
    >
        <div
            class="flex items-center pb-2 mt-2 mb-2 border-b border-gray-200"
            v-if="packageObject.metadata?.annotations"
        >
            <div
                class="relative w-10 h-10 p-2 mr-2 bg-white border border-gray-200 rounded-full"
            >
                <img
                    v-if="
                        packageObject.metadata?.annotations[
                            'orchestration.atlan.com/icon'
                        ]
                    "
                    class="self-center w-6 h-6"
                    :src="
                        packageObject.metadata?.annotations[
                            'orchestration.atlan.com/icon'
                        ]
                    "
                />
                <span
                    v-else-if="
                        packageObject.metadata?.annotations[
                            'orchestration.atlan.com/emoji'
                        ]
                    "
                    class="self-center w-6 h-6"
                >
                    {{
                        packageObject.metadata?.annotations[
                            'orchestration.atlan.com/emoji'
                        ]
                    }}</span
                >
                <span v-else class="self-center w-6 h-6">
                    {{ '\ud83d\udce6' }}</span
                >

                <div
                    v-if="
                        packageObject.metadata?.labels[
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
                <div
                    class="flex items-center text-sm font-bold truncate overflow-ellipsis"
                >
                    {{
                        packageObject.metadata?.annotations[
                            'orchestration.atlan.com/name'
                        ]
                    }}
                    <a-tooltip
                        placement="bottomRight"
                        :title="
                            packageObject.metadata?.annotations[
                                'package.argoproj.io/description'
                            ]
                        "
                    >
                        <AtlanIcon icon="Info" class="ml-1"></AtlanIcon
                    ></a-tooltip>
                </div>
                <div class="flex text-gray-500">
                    {{ item.metadata.annotations['package.argoproj.io/name'] }}
                    ({{ item.metadata.labels['package.argoproj.io/version'] }})
                </div>
            </div>
        </div>

        <RunWidget :item="item" :runs="runs"></RunWidget>

        <div class="mt-2">
            {{ item.metadata.name }}
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, inject, toRefs } from 'vue'
    import RunWidget from './run.vue'

    export default defineComponent({
        components: { RunWidget },
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            packageObject: {
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
        setup(props, { emit }) {
            const { item, selectedItem, packageObject } = toRefs(props)
            const isSelected = computed(
                () =>
                    item.value?.metadata.name ===
                    selectedItem.value?.metadata.name
            )

            const runMap = inject('runMap')

            const runs = computed(() => {
                return runMap.value[item.value.metadata.name]
            })

            return {
                item,
                isSelected,
                packageObject,
                runMap,
                runs,
            }
        },
    })
</script>

<style lang="less" scoped></style>
