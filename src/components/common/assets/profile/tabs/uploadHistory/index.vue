<template>
    <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center h-full bg-white"
    >
        <a-spin
            size="small"
            icon="Loader"
            class="w-auto h-4 mr-1 animate-spin"
        ></a-spin>
    </div>
    <div v-else-if="!isLoading && runs?.length">
        <div v-for="run in runs" :key="item" class="m-5">
            <RunItem :run="run" />
        </div>
    </div>
    <div
        v-else
        class="flex flex-col items-center justify-center h-full bg-white"
    >
        <atlan-icon icon="EmptyUploads" class="h-28 mb-4" />
        <span class="font-bold text-base mb-2"
            >Your bulk uploads will appear here</span
        >
        <span class="text-gray-500 w-72 text-center">
            You will be able to view progress, monitor and debug various
            uploads</span
        >
        <BulkUploadModal :entity="selectedAsset">
            <template #trigger>
                <div
                    class="px-2 py-1 flex items-center border rounded-lg bg-white mt-4 cursor-pointer"
                >
                    <atlan-icon icon="Upload" class="mr-1 mb-0.5" />Bulk upload
                    terms
                </div>
            </template>
        </BulkUploadModal>
    </div>
</template>

<script lang="ts">
    import {
        watch,
        defineComponent,
        ref,
        PropType,
        computed,
        toRefs,
    } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    // composables
    import { useRunDiscoverList } from '~/workflowsv2/composables/useRunDiscoverList'
    import RunItem from '~/components/common/assets/profile/tabs/uploadHistory/item.vue'
    import BulkUploadModal from '@/glossary/modal/bulkUploadModal.vue'

    export default defineComponent({
        name: 'UploadHistoryTab',
        components: { RunItem, BulkUploadModal },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            // data
            const limit = ref(30)
            const offset = ref(0)
            const guid = ref(props.selectedAsset?.guid)
            const facets = computed(() => ({
                prefix: `atlan-gtc-bulk-upload-${guid.value?.slice(-8)}`,
                filterOut: [
                    'atlan-typedef-seeder',
                    'atlan', // atlan-upadate
                    'cloud-es-log-policy',
                    'cloud-backups',
                ],
            }))

            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })

            const {
                list: runs,
                quickChange,
                resetState,
                isLoading,
                data,
            } = useRunDiscoverList({
                facets,
                limit,
                offset,
                preference,
            })

            watch(runs, () => {
                console.log(runs.value)
                console.log(data.value)
            })
            return {
                runs,
                isLoading,
            }
        },
    })
</script>

<style lang="less" module>
    .glossaryTermsTab {
        :global(.ant-tabs-tab:first-child) {
            @apply ml-0 !important;
        }
    }
</style>
