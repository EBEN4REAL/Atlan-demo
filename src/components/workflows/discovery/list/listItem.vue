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
            class="flex items-start flex-1 px-3 py-4 border-b border-transparent  w-96"
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
                class="box-border flex flex-col flex-1 overflow-hidden  gap-y-1 lg:pr-16"
            >
                <div class="flex items-center flex-none">
                    <span
                        class="pl-1 text-sm tracking-wider text-gray-700 uppercase "
                        >WORKFLOW</span
                    >
                </div>

                <div class="flex items-center mb-0 overflow-hidden">
                    <router-link
                        :class="
                            cssClasses?.textSize
                                ? cssClasses?.textSize
                                : 'text-md'
                        "
                        :to="`/workflows/${item.metadata.name}/monitor`"
                        class="flex-shrink mb-0 overflow-hidden text-base font-bold truncate cursor-pointer  text-primary hover:underline overflow-ellipsis whitespace-nowrap"
                    >
                        {{ item.metadata.name }}
                    </router-link>
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
