<template>
    <div class="p-6">
        <a-collapse
            v-model="activeKey"
            :bordered="false"
            expand-icon-position="right"
            class="bg-red"
        >
            <a-collapse-panel key="1" class="rounded-lg panel">
                <template #header>
                    <div class="px-3 py-1">
                        <div class="text-base font-bold text-gray-700">
                            Custom Metadata
                        </div>
                        <div class="mt-1 text-sm text-gray-500">
                            Select the custom metadata that should be visible to
                            Data consultant persona
                        </div>
                    </div>
                </template>
                <div class="p-4">
                    <div
                        class="flex justify-between p-3 border-b border-gray-200"
                    >
                        <span class="text-sm text-primary">DBT</span>
                        <a-switch class="ml-auro" default-checked />
                    </div>
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'

    export default defineComponent({
        name: 'Preferences',
        components: {},
        props: {},
        emits: [],
        setup(props) {
            const activeKey = ref('')
            return { activeKey }
        },
    })
</script>
<style lang="less">
    .panel {
        box-shadow: 0px 8px 24px 0px #1920380a;

        .ant-collapse-header {
            @apply bg-white;
        }
        .ant-collapse-content-box {
            @apply pb-0;
        }
    }
</style>
