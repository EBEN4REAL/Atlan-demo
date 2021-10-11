<template>
    <a-popover
        v-model:visible="showLinkTermPopover"
        placement="left"
        trigger="click"
    >
        <template #content>
            <LinkTermsDropdown
                ref="linkTermDropdownRef"
                @changeTerms="handleTermChange"
            />
            <div class="flex justify-end mt-4">
                <div class="space-x-4">
                    <a-button class="px-4" @click="handleCancel"
                        >Cancel</a-button
                    >
                    <a-button type="primary" class="px-4" @click="handleConfirm"
                        >Done</a-button
                    >
                </div>
            </div>
        </template>
        <div
            class="mb-3 text-xs text-gray-500"
            @click.stop="toggleLinkTermPopover"
        >
            <p class="mb-1 text-sm text-gray mb-2.5">Terms</p>
            <div class="flex">
                <!-- same terms for all selected assets -->
                <div
                    v-if="termsList && termsList.length"
                    class="flex flex-grow mr-1 text-sm"
                >
                    <PillGroup
                        :class="termsList && termsList.length ? '' : 'hidden'"
                        :data="formattedTermList"
                        label-key="displayText"
                        :read-only="true"
                    >
                        <template #pillPrefix>
                            <AtlanIcon
                                icon="Term"
                                class="text-primary group-hover:text-white"
                            />
                        </template>
                        <template #suffix>
                            <span
                                v-if="splitTerms.second.length > 0"
                                class="
                                    px-1
                                    py-0.5
                                    text-sm
                                    rounded
                                    text-primary
                                    mr-3
                                    cursor-pointer
                                "
                                @click.stop="() => toggleShowAll()"
                            >
                                {{
                                    showAll
                                        ? 'Show less'
                                        : `and ${splitTerms.second.length} more`
                                }}
                            </span>
                            <div
                                class="p-1.5 border rounded-full cursor-pointer"
                            >
                                <AtlanIcon icon="Pencil" />
                            </div>
                        </template>
                    </PillGroup>
                </div>
                <!-- Multiple terms -->
                <div
                    v-else-if="
                        termsList &&
                        !termsList.length &&
                        Object.keys(termFrequencyMap).length
                    "
                    class="flex"
                >
                    <div
                        class="
                            p-1.5
                            bg-secondary-light
                            rounded-sm
                            text-secondary
                            mr-1
                        "
                    >
                        <span class="text-sm">Multiple terms</span>
                    </div>
                    <div class="p-1.5 border rounded-full cursor-pointer">
                        <AtlanIcon icon="Pencil" />
                    </div>
                </div>
                <!-- No terms present -->
                <div
                    v-else-if="!Object.keys(termFrequencyMap).length"
                    class="p-1.5 border rounded-full cursor-pointer"
                >
                    <AtlanIcon icon="Pencil" />
                </div>
            </div>
            <div class="mt-2.5">
                <div v-if="changeLog.all.length">
                    {{ getTruncatedStringFromArray(changeLog.all, 20) }}
                    <span class="text-success">added</span>
                </div>
                <div v-if="changeLog.removed.length">
                    {{ getTruncatedStringFromArray(changeLog.removed, 20) }}
                    <span class="text-error">removed</span>
                </div>
            </div>
        </div>
    </a-popover>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch, inject, computed } from 'vue'
import useBulkSelect from '~/composables/asset/useBulkSelect'
import { Components } from '~/api/atlas/client'
import PillGroup from '~/components/UI/pill/pillGroup.vue'
import LinkTermsDropdown from '~/components/common/dropdown/linkTermsDropdown.vue'
import { splitArray, getTruncatedStringFromArray } from '~/utils/string'

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
        LinkTermsDropdown,
        PillGroup,
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
        const changeLog: Ref<Record<string, (string | undefined)[]>> = ref({
            all: [],
            partial: [],
            removed: [],
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
        const linkTermDropdownRef = ref()
        const showAll = ref(false)
        watch(
            originalTermsRef,
            () => {
                resetTerms(originalTermsRef, termsRef)
                localState.value = initialiseLocalState(
                    selectedAssets,
                    termFrequencyMap
                )
                changeLog.value = {
                    all: [],
                    removed: [],
                }
                linkTermDropdownRef?.value?.clearSelection()
            },
            { immediate: true }
        )
        const handleTermChange = (selectedTerms) => {
            localState.value.all = [...selectedTerms.value]
            console.log(localState.value)
        }
        const toggleLinkTermPopover = () => {
            showLinkTermPopover.value = !showLinkTermPopover.value
        }
        const handleConfirm = () => {
            changeLog.value.all = localState.value.all.map(
                (term) => term.displayText
            )
            changeLog.value.removed = localState.value.removed.map(
                (term) => term.displayText
            )
            changeLog.value.partial = localState.value.partial.map(
                (term) => term.displayText
            )
            updateTerms(termsRef, localState, originalTermsRef)
            toggleLinkTermPopover()
        }

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
        const splitTerms = computed(() => {
            const { a: first, b: second } = splitArray(5, termsList.value)
            return {
                first,
                second,
            }
        })
        const formattedTermList = computed(() =>
            showAll.value
                ? [...splitTerms.value.first, ...splitTerms.value.second]
                : [...splitTerms.value.first]
        )
        const toggleShowAll = () => {
            showAll.value = !showAll.value
        }
        const handleCancel = () => {
            resetTerms(originalTermsRef, termsRef)
            localState.value = initialiseLocalState(
                selectedAssets,
                termFrequencyMap
            )
            changeLog.value = {
                all: [],
                partial: [],
                removed: [],
            }
            linkTermDropdownRef?.value?.clearSelection()
            toggleLinkTermPopover()
        }

        return {
            termsRef,
            localState,
            handleConfirm,
            termsList,
            termFrequencyMap,
            handleTermChange,
            showLinkTermPopover,
            toggleLinkTermPopover,
            linkTermDropdownRef,
            changeLog,
            handleCancel,
            formattedTermList,
            toggleShowAll,
            splitTerms,
            showAll,
            getTruncatedStringFromArray,
        }
    },
})
</script>

<style>
</style>