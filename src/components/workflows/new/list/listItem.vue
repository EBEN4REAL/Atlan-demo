<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div
        class="p-3"
        :class="
            isSelected
                ? 'border-primary rounded bg-primary-light'
                : 'bg-white border border-gray-200'
        "
    >
        <div class="box-border flex flex-col h-full">
            <div class="flex items-center mb-0 overflow-hidden">
                <div class="pr-3">
                    <img :src="item.icon" class="w-10 h-auto" />
                </div>
                <div class="flex flex-col">
                    <p
                        class="flex-shrink mb-0 overflow-hidden text-base font-bold truncate cursor-pointer  text-primary overflow-ellipsis whitespace-nowrap"
                    >
                        {{ item.display_name }}
                    </p>
                    <div class="leading-none text-gray-500 uppercase">
                        CONNECTOR
                    </div>
                </div>
            </div>
            <div class="flex items-center mb-0 overflow-hidden">
                <p class="text-gray-500">
                    {{ item.description }}
                </p>
            </div>
            <div class="flex items-end flex-grow gap-x-3">
                <div class="flex text-sm text-gray-500">
                    <span class="text-gray-500">
                        v{{ item.labels['org.argopm.package.version'] }}</span
                    >
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
