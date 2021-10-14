<template>
    <div class="px-5 pb-5 pt-3.5">
        <div class="sidebar_widget_wrapper">
            <div class="mb-3">
                <div
                    v-if="selectedAssets && selectedAssets.length"
                    class="mb-1 text-xl font-bold text-primary"
                >
                    {{ selectedAssets.length }}
                    {{ selectedAssets.length === 1 ? `Asset` : `Assets` }}
                    Selected
                </div>
                <div>
                    <span
                        v-for="(key, index) in Object.keys(assetTypeMap)"
                        :key="key"
                    >
                        {{ pluralizeString(key, assetTypeMap[key], true)
                        }}<span
                            v-if="
                                index !== Object.keys(assetTypeMap).length - 1
                            "
                            >,
                        </span>
                    </span>
                </div>
            </div>
            <Status :existing-status="existingStatus" class="mb-5"></Status>
            <Owners class="mb-5"></Owners>
            <Classifications class="mb-5" />
            <Terms class="mb-5" />
        </div>
        <div class="flex gap-x-4">
            <a-button
                class="flex-1 bg-gray-300 border-0 hover:text-gray"
                @click="handeCancel"
                >Cancel</a-button
            >
            <a-button
                type="primary"
                class="flex-1 border-0"
                :disabled="
                    !(
                        didOwnersUpdate ||
                        didStatusUpdate ||
                        didClassificationsUpdate ||
                        didTermsUpdate
                    )
                "
                @click="updateAssets(selectedAssets)"
                >Make Changes</a-button
            >
        </div>
    </div>
</template>

<script>
import { provide, toRefs, watch } from 'vue'
import useBulkSelect from '~/composables/asset/useBulkSelect'
import Status from '@/common/bulk/widgets/status.vue'
import Owners from '@/common/bulk/widgets/owners.vue'
import Classifications from '@/common/bulk/widgets/classifications.vue'
import Terms from '@/common/bulk/widgets/terms.vue'
import { pluralizeString } from '~/utils/string'

export default {
    name: 'BulkSidebar',
    components: {
        Status,
        Owners,
        Classifications,
        Terms,
    },
    props: {
        bulkSelectedAssets: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['closeBulkMode'],
    setup(props, { emit }) {
        const { bulkSelectedAssets: selectedAssets } = toRefs(props)
        const {
            existingOwners,
            existingStatus,
            existingClassifications,
            existingTerms,
            updatedStatus,
            updatedStatusMessage,
            publishedStatusChangeLog: publishedStatusChangeLogRef,
            updateAssets,
            updateSelectedAssets,
            classifications: classificationsRef,
            originalClassifications: originalClassificationsRef,
            publishedClassificationChangeLog:
                publishedClassificationChangeLogRef,
            classificationFrequencyMap,
            terms: termsRef,
            originalTerms: originalTermsRef,
            termFrequencyMap,
            publishedTermChangeLog: publishedTermChangeLogRef,
            didTermsUpdate,
            state,
            owners: ownersRef,
            originalOwners: originalOwnersRef,
            ownerFrequencyMap,
            publishedChangeLog: publishedOwnerChangeLogRef,
            didOwnersUpdate,
            didStatusUpdate,
            didClassificationsUpdate,
            assetTypeMap,
        } = useBulkSelect()
        /** PROVIDERS */
        provide('selectedAssets', selectedAssets)
        /** STATUS PROVIDERS */
        provide('updatedStatus', updatedStatus)
        provide('updatedStatusMessage', updatedStatusMessage)
        provide('publishedStatusChangeLogRef', publishedStatusChangeLogRef)
        /** CLASSIFICATION PROVIDERS */
        provide('classificationsRef', classificationsRef)
        provide('originalClassificationsRef', originalClassificationsRef)
        provide('classificationFrequencyMap', classificationFrequencyMap)
        provide(
            'publishedClassificationChangeLogRef',
            publishedClassificationChangeLogRef
        )
        /** TERMS PROVIDERS */
        provide('termsRef', termsRef)
        provide('originalTermsRef', originalTermsRef)
        provide('termFrequencyMap', termFrequencyMap)
        provide('publishedTermChangeLogRef', publishedTermChangeLogRef)
        /** OWNERS PROVIDERS */
        provide('ownersRef', ownersRef)
        provide('originalOwnersRef', originalOwnersRef)
        provide('ownerFrequencyMap', ownerFrequencyMap)
        provide('publishedOwnerChangeLogRef', publishedOwnerChangeLogRef)
        watch(
            selectedAssets,
            () => {
                updateSelectedAssets(selectedAssets)
            },
            {
                immediate: true,
            }
        )
        const handeCancel = () => {
            emit('closeBulkMode')
        }
        return {
            selectedAssets,
            existingOwners,
            existingStatus,
            existingClassifications,
            existingTerms,
            updateAssets,
            handeCancel,
            state,
            termsRef,
            didOwnersUpdate,
            didStatusUpdate,
            didClassificationsUpdate,
            didTermsUpdate,
            assetTypeMap,
            pluralizeString,
        }
    },
}
</script>

<style lang="less">
.sidebar_widget_wrapper {
    height: calc(100vh - 7.5rem);
    overflow-y: auto;
}
</style>