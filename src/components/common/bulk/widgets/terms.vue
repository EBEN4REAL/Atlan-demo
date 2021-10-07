<template>
    <div class="mb-3 text-xs text-gray-500" @click.stop="toggleLinkTermPopover">
        <p class="mb-1 text-sm">Terms</p>
        <div>{{ termsRef }}</div>
        <div>{{ localState }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch, inject, computed } from 'vue'
import useBulkSelect from '~/composables/asset/useBulkSelect'
import { Components } from '~/api/atlas/client'
import ClassificationInfoCard from '~/components/discovery/preview/hovercards/classificationInfo.vue'
import PillGroup from '~/components/UI/pill/pillGroup.vue'
import LinkClassificationsDropdown from '@/common/dropdown/linkClassificationsDropdown.vue'

interface LocalState {
    all:
        | Components.Schemas.AtlasGlossaryTerm[]
        | Components.Schemas.AtlasTermAssignmentHeader[]
    partial:
        | Components.Schemas.AtlasGlossaryTerm[]
        | Components.Schemas.AtlasTermAssignmentHeader[]
    removed:
        | Components.Schemas.AtlasGlossaryTerm[]
        | Components.Schemas.AtlasTermAssignmentHeader[]
}
export default defineComponent({
    name: 'UpdateBulkTerms',
    components: {
        ClassificationInfoCard,
        PillGroup,
        LinkClassificationsDropdown,
    },
    setup() {
        const localState: Ref<LocalState> = ref({
            all: [] as
                | Components.Schemas.AtlasGlossaryTerm[]
                | Components.Schemas.AtlasTermAssignmentHeader[],
            partial: [] as
                | Components.Schemas.AtlasGlossaryTerm[]
                | Components.Schemas.AtlasTermAssignmentHeader[],
            removed: [] as
                | Components.Schemas.AtlasGlossaryTerm[]
                | Components.Schemas.AtlasTermAssignmentHeader[],
        })
        const {
            resetTerms,
            initialiseLocalStateTerms: initialiseLocalState,
            updateTerms,
        } = useBulkSelect()
        const termsRef = inject('termsRef')
        const originalTermsRef = inject('originalTermsRef')
        const selectedAssets = inject('selectedAssets')
        const termFrequencyMap = inject('termFrequencyMap')
        const showLinkTermPopover = ref(false)
        const linkClassificationDropdownRef = ref()

        watch(
            originalTermsRef,
            () => {
                resetTerms(originalTermsRef, termsRef)
                localState.value = initialiseLocalState(
                    selectedAssets,
                    termFrequencyMap
                )
                linkClassificationDropdownRef?.value?.clearSelection()
            },
            { immediate: true }
        )
        const handleTermChange = (selectedTerms) => {
            localState.value.all = [...selectedTerms]
            console.log(localState.value)
        }
        const handleConfirm = () => {
            updateTerms(termsRef, localState, originalTermsRef)
        }
        const toggleLinkTermPopover = () => {
            showLinkTermPopover.value = !showLinkTermPopover.value
        }
        setTimeout(() => {
            const test = localState.value.all[0]
            test.termGuid = '90884386'
            localState.value.all = [...localState.value.all, test]

            handleConfirm()
        }, 3000)
        // To show term tags if all assets have same terms
        const termsList = computed(() => {
            /** we can have 3 cases:
             *  All selected assets have same terms: in that case freq of each term will be same as selectedAssets count in the freqMap; termList will be keys of freq map
             * No terms present in any selectedAsset: No keys in freqMap, termList will be []
             * Different terms for selected assets: freqMap will have keys, but termList will []
             */
            if (Object.keys(termFrequencyMap.value).length) {
                if (
                    !Object.keys(termFrequencyMap.value).some(
                        (key) =>
                            termFrequencyMap.value[key].frequency !==
                            selectedAssets.value.length
                    )
                ) {
                    const termList = [
                        ...Object.keys(termFrequencyMap.value).map(
                            (termGuid) => ({
                                ...termFrequencyMap.value[termGuid].term,
                            })
                        ),
                    ]

                    return termList
                }
            }
            return []
        })

        return {
            termsRef,
            localState,
            handleConfirm,
            termsList,
            termFrequencyMap,
            handleTermChange,
            showLinkTermPopover,
            toggleLinkTermPopover,
            linkClassificationDropdownRef,
        }
    },
})
</script>

<style>
</style>