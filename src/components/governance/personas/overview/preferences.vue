<template>
    <div class="p-6 overflow-y-scroll container-preferences">
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
                        v-for="meta in finalBusinessMetadataList"
                        :key="meta.guid"
                        class="flex justify-between p-3 border-b border-gray-200"
                    >
                        <div class="flex">
                            <CustomMetadataAvatar
                                class="mr-2"
                                :metadata="meta"
                                :internal="
                                    ['true', true].includes(
                                        meta?.options?.isLocked
                                    )
                                "
                                size="16px"
                            />

                            <span class="text-sm text-primary">{{
                                meta.displayName
                            }}</span>
                        </div>
                        <a-switch class="ml-auro" default-checked />
                    </div>
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import useBusinessMetadata from '@/governance/custom-metadata/composables/useBusinessMetadata'
    import CustomMetadataAvatar from '@/governance/custom-metadata/CustomMetadataAvatar.vue'

    export default defineComponent({
        name: 'Preferences',
        components: { CustomMetadataAvatar },
        props: {},
        emits: [],
        setup(props) {
            const activeKey = ref('')
            const { finalBusinessMetadataList } = useBusinessMetadata()
            return { activeKey, finalBusinessMetadataList }
        },
    })
</script>
<style lang="less">
    .container-preferences {
        max-height: 70vh;
    }
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
