<template>
    <div
        class="mb-3 text-xs text-gray-500"
        @click.stop="toggleLinkClassificationPopover"
    >
        <p class="mb-1 text-sm">Classifications</p>
        <div class="flex">
            <!-- same clsf for all selected assets -->
            <div
                v-if="classificationsList && classificationsList.length"
                class="flex flex-grow mr-1 text-sm"
            >
                <PillGroup
                    :class="
                        classificationsList && classificationsList.length
                            ? ''
                            : 'hidden'
                    "
                    :data="classificationsList"
                    label-key="typeName"
                    popover-trigger="hover"
                    :read-only="true"
                >
                    <template #pillPrefix>
                        <AtlanIcon
                            icon="Shield"
                            class="text-pink-400 group-hover:text-white"
                        />
                    </template>
                    <template #popover="{ item }">
                        <ClassificationInfoCard :classification="item"
                    /></template>
                    <template #suffix>
                        <div class="p-1.5 border rounded-full">
                            <AtlanIcon icon="Pencil" />
                        </div>
                        <!-- <span
                        v-if="splittedClassifications.b.length > 0"
                        class="
                            px-1
                            py-0.5
                            text-sm
                            rounded
                            text-primary
                            mr-3
                            cursor-pointer
                        "
                        @click="() => toggleAllClassifications()"
                    >
                        {{
                            showAll
                                ? 'Show less'
                                : `and ${splittedClassifications.b.length} more`
                        }}
                    </span>-->
                    </template>
                </PillGroup>
            </div>
            <!-- Multiple clsfs -->
            <div
                v-else-if="
                    classificationsList &&
                    !classificationsList.length &&
                    Object.keys(classificationFrequencyMap).length
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
                    <span class="text-sm">Multiple classifications</span>
                </div>
                <div class="p-1.5 border rounded-full">
                    <AtlanIcon icon="Pencil" />
                </div>
            </div>
            <!-- No clsf present -->
            <div
                v-else-if="!Object.keys(classificationFrequencyMap).length"
                class="p-1.5 border rounded-full"
            >
                <AtlanIcon icon="Pencil" />
            </div>
        </div>
        <div class="mt-2.5">
            <div v-if="changeLog.all.length">
                {{ changeLog.all.join(', ') }}
                <span class="text-success">added</span>
            </div>
            <div v-if="changeLog.removed.length">
                {{ changeLog.removed.join(', ') }}
                <span class="text-error">removed</span>
            </div>
        </div>
        <a-popover
            v-model:visible="showLinkClassificationPopover"
            placement="left"
            trigger="click"
        >
            <template #content>
                <LinkClassificationsDropdown
                    ref="linkClassificationDropdownRef"
                    @changeClassifications="handleClassificationChange"
                />
                <div class="flex justify-end">
                    <div class="space-x-4">
                        <a-button class="px-4" @click="handleCancel"
                            >Cancel</a-button
                        >
                        <a-button
                            type="primary"
                            class="px-4"
                            @click="handleConfirm"
                            >Link</a-button
                        >
                    </div>
                </div>
            </template>
        </a-popover>
    </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch, inject, computed } from 'vue'
import useBulkSelect, { LocalState } from '~/composables/asset/useBulkSelect'
import { Components } from '~/api/atlas/client'
import ClassificationInfoCard from '~/components/discovery/preview/hovercards/classificationInfo.vue'
import PillGroup from '~/components/UI/pill/pillGroup.vue'
import LinkClassificationsDropdown from '@/common/dropdown/linkClassificationsDropdown.vue'
import { useClassifications } from '~/components/admin/classifications/composables/useClassifications'

export default defineComponent({
    name: 'UpdateBulkClassifications',
    components: {
        ClassificationInfoCard,
        PillGroup,
        LinkClassificationsDropdown,
    },
    setup() {
        const {
            isClassificationInitializedInStore,
            initializeClassificationsInStore,
        } = useClassifications()
        if (!isClassificationInitializedInStore()) {
            initializeClassificationsInStore()
        }
        const localState: Ref<LocalState> = ref({
            all: [] as Components.Schemas.AtlasClassification[],
            partial: [] as Components.Schemas.AtlasClassification[],
            removed: [] as Components.Schemas.AtlasClassification[],
        })
        const changeLog: Ref<Record<string, (string | undefined)[]>> = ref({
            all: [],
            partial: [],
            removed: [],
        })
        const {
            resetClassifications,
            initialiseLocalState,
            updateClassifications,
        } = useBulkSelect()
        const classificationsRef = inject('classificationsRef')
        const originalClassificationsRef = inject('originalClassificationsRef')
        const selectedAssets = inject('selectedAssets')
        const classificationFrequencyMap = inject('classificationFrequencyMap')
        const publishedClassificationChangeLogRef = inject(
            'publishedClassificationChangeLogRef'
        )
        const showLinkClassificationPopover = ref(false)
        const linkClassificationDropdownRef = ref()

        watch(
            originalClassificationsRef,
            () => {
                resetClassifications(
                    originalClassificationsRef,
                    classificationsRef,
                    publishedClassificationChangeLogRef
                )
                localState.value = initialiseLocalState(
                    selectedAssets,
                    classificationFrequencyMap
                )
                changeLog.value = {
                    all: [],
                    partial: [],
                    removed: [],
                }
                linkClassificationDropdownRef?.value?.clearSelection()
            },
            { immediate: true }
        )
        const handleClassificationChange = (
            selectedClassificationsList,
            linkClassificationData
        ) => {
            // classifications from store don't have typeName property, instead have name, so adding typename so that the mapping is correct
            const modifiedClassificationList =
                selectedClassificationsList.value.map((clsf) => ({
                    ...clsf,
                    typeName: clsf.name,
                }))
            localState.value.all = [...modifiedClassificationList]
            // TODO: handle linkClassificationsData
        }
        const handleConfirm = () => {
            changeLog.value.all = localState.value.all.map(
                (clsf) => clsf.typeName
            )
            changeLog.value.removed = localState.value.removed.map(
                (clsf) => clsf.typeName
            )
            changeLog.value.partial = localState.value.partial.map(
                (clsf) => clsf.typeName
            )
            updateClassifications(
                classificationsRef,
                localState,
                originalClassificationsRef,
                publishedClassificationChangeLogRef
            )
        }
        const toggleLinkClassificationPopover = () => {
            showLinkClassificationPopover.value =
                !showLinkClassificationPopover.value
        }
        // To show classification tags if all assets have same classifications
        const classificationsList = computed(() => {
            /** we can have 3 cases:
             *  All selected assets have same classifications: in that case freq of each classification will be same as selectedAssets count in the freqMap; classificationList will be keys of freq map
             * No classifications present in any selectedAsset: No keys in freqMap, classificationList will be []
             * Different classifications for selected assets: freqMap will have keys, but classificationList will []
             */
            if (Object.keys(classificationFrequencyMap.value).length) {
                if (
                    !Object.keys(classificationFrequencyMap.value).some(
                        (key) =>
                            classificationFrequencyMap.value[key].frequency !==
                            selectedAssets.value.length
                    )
                ) {
                    const clsfList = [
                        ...Object.keys(classificationFrequencyMap.value).map(
                            (clsfName) => ({
                                ...classificationFrequencyMap.value[clsfName]
                                    .classification,
                            })
                        ),
                    ]

                    return clsfList
                }
            }
            return []
        })
        const handleCancel = () => {
            resetClassifications(
                originalClassificationsRef,
                classificationsRef,
                publishedClassificationChangeLogRef
            )
            localState.value = initialiseLocalState(
                selectedAssets,
                classificationFrequencyMap
            )
            changeLog.value = {
                all: [],
                partial: [],
                removed: [],
            }
            linkClassificationDropdownRef?.value?.clearSelection()
            toggleLinkClassificationPopover()
        }
        return {
            classificationsRef,
            localState,
            handleConfirm,
            classificationsList,
            classificationFrequencyMap,
            handleClassificationChange,
            showLinkClassificationPopover,
            toggleLinkClassificationPopover,
            linkClassificationDropdownRef,
            changeLog,
            handleCancel,
        }
    },
})
</script>

<style>
</style>