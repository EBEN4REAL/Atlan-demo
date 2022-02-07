<template>
    <div class="flex flex-col p-6 gap-y-4">
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
                <RaisedTab
                    v-model:active="activePreviewTabKey"
                    class="flex-none flex-grow-0 mb-4 mr-auto"
                    :data="tabConfig"
                />

                <FieldsPreview />
            </div>
        </Summary>
        <Readme :asset="selectedAsset" :isEdit="readmeEditPermission" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, Ref } from 'vue'

    import Summary from '@common/widgets/summary/index.vue'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Readme from '@/common/widgets/readme/index.vue'
    import FieldsPreview from './salesforceFieldsPreview.vue'

    export default defineComponent({
        name: 'SaasOverview',
        components: { AnnouncementWidget, Readme, Summary, FieldsPreview },
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
        setup() {
            const activePreviewTabKey: Ref<'field'> = ref('field')
            const tabConfig = [{ key: 'field', label: 'Field Preview' }]
            return {
                activePreviewTabKey,
                tabConfig,
            }
        },
    })
</script>
