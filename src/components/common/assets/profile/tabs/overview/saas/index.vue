<template>
    <div class="flex flex-col p-6 gap-y-4 max-profile-width">
        <Summary :asset="selectedAsset">
            <template #announcement>
                <AnnouncementWidget
                    :selected-asset="selectedAsset"
                    class="mb-4"
                ></AnnouncementWidget>
            </template>
            <div
                v-if="['SalesforceObject'].includes(selectedAsset.typeName)"
                class="flex flex-col w-full mt-4"
            >
                <FieldsPreview />
            </div>
        </Summary>
        <slot name="readme"></slot>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import Summary from '@common/widgets/summary/index.vue'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import FieldsPreview from './salesforceFieldsPreview.vue'

    export default defineComponent({
        name: 'SaasOverview',
        components: {
            AnnouncementWidget,
            Summary,
            FieldsPreview,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            readmeEditPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
    })
</script>

<style lang="less" scoped>
    .max-profile-width {
        max-width: calc(100vw - 480px);
    }
</style>
