<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div
        class="flex mx-3 border"
        :class="
            isSelected
                ? 'border-primary rounded bg-primary-light'
                : 'bg-white border-transparent'
        "
    >
        <div
            class="flex items-start flex-1 px-3 py-4 border-b border-transparent w-96"
            :class="{ ' border-gray-200': !isSelected }"
        >
            <a-checkbox
                v-if="showCheckBox"
                class="self-center mr-6"
                :checked="isChecked"
                @click.stop
                @change="(e) => $emit('listItem:check', e, item)"
            />
            <div
                class="box-border flex flex-col flex-1 overflow-hidden gap-y-1 lg:pr-16"
            >
                <div class="flex items-center gap-x-3">
                    <div class="flex text-sm text-gray-500">
                        <div class="mr-2">
                            <!-- <img
                                src="/src/assets/images/source/snowflake.png"
                                class="flex-none w-auto h-3.5 mb-0.5"
                            /> -->
                        </div>
                        <span class="text-gray-500">Workflow</span>
                    </div>
                </div>
                <div class="flex items-center mb-0 overflow-hidden">
                    <router-link
                        :class="
                            cssClasses?.textSize
                                ? cssClasses?.textSize
                                : 'text-xl'
                        "
                        :to="`/workflows/${item.metadata.name}/setup`"
                        class="flex-shrink mb-0 overflow-hidden text-base font-bold truncate cursor-pointer text-primary hover:underline overflow-ellipsis whitespace-nowrap"
                    >
                        {{ item.metadata.name }}
                    </router-link>
                </div>
                <div class="flex items-center gap-x-3">
                    <div class="flex text-sm text-gray-500">
                        <span class="text-gray-500">
                            {{
                                item?.spec?.templates[0]?.dag?.tasks[0]
                                    ?.templateRef.name ?? '-'
                            }}</span
                        >
                    </div>
                    <div
                        v-if="
                            item?.metadata.labels[
                                'com.atlan.orchestration/created-by'
                            ]
                        "
                        style="color: rgb(196, 196, 196)"
                    >
                        •
                    </div>
                    <div
                        v-if="
                            item?.metadata.labels[
                                'com.atlan.orchestration/created-by'
                            ]
                        "
                        class="flex items-center text-sm text-gray-500 gap-x-1"
                    >
                        <AtlanIcon icon="User" />
                        <span>{{
                            item?.metadata.labels[
                                'com.atlan.orchestration/created-by'
                            ]
                        }}</span>
                    </div>
                    <!-- <div style="color: rgb(196, 196, 196)">•</div> -->
                    <!-- <div class="flex text-sm text-gray-500">
                        <span class="text-gray-500">Scheduled</span>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'RunListItem',
        components: {},
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            creator: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            isSelected: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            isChecked: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            cssClasses: {
                type: String,
                required: false,
                default: () => '',
            },

            showCheckBox: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        emits: ['listItem:check'],
        setup() {
            return {}
        },
    })
</script>
<style scoped>
    .hidden-scroll::-webkit-scrollbar {
        height: 0 !important;
        width: 0 !important;
    }
    .hidden-scroll {
        overflow: -moz-scrollbars-none;
        scrollbar-width: none;
    }
</style>
