<template>
    <div class="text-sm text-gray-500">
        <p class="mb-1 text-sm">Terms</p>
        <!-- shown in side bar  -->
        <div v-if="pillTerms.length > 0" class="flex flex-wrap items-center">
            <PillGroup
                :data="pillTerms"
                label-key="displayText"
                @add="toggleLinkTermPopover"
                @delete="unLinkTerm"
            >
                <template #pillPrefix>
                    <AtlanIcon
                        icon="Term"
                        class="text-primary group-hover:text-white"
                    />
                </template>
            </PillGroup>
        </div>
        <a-popover
            v-model:visible="linkTermPopover"
            placement="left"
            trigger="click"
        >
            <div v-if="pillTerms.length < 1">
                <div @click.stop="toggleLinkTermPopover">
                    <div
                        class="
                            flex
                            items-center
                            cursor-pointer
                            text-primary
                            hover:text-primary hover:underline
                        "
                    >
                        <span class="text-xs">Add Terms</span>
                    </div>
                </div>
            </div>
            <!-- popover content  -->
            <template #content>
                <div class="flex flex-col overflow-y-auto w-72">
                    <template v-if="!showLinkTermPopover">
                        <p class="mb-2 text-sm text-gray-700">Link Terms</p>
                        <a-select
                            v-model:value="selectedTermForLink"
                            mode="multiple"
                            :allow-clear="true"
                            :autofocus="true"
                            :show-search="true"
                            placeholder="Search for terms"
                            :loading="searchLoading"
                        >
                            <!-- term list -->
                            <template
                                v-for="term in availableTerms"
                                :key="term.guid"
                            >
                                <a-select-option :value="term.guid">{{
                                    term.displayText
                                }}</a-select-option>
                            </template>
                        </a-select>
                    </template>
                    <template v-else>
                        <p v-if="searchLoading">loading</p>

                        <p v-else class="mb-2 text-sm text-gray-700">No data</p>
                        <p
                            v-if="createErrorText"
                            class="mt-4 mb-0 text-sm text-red-500"
                        >
                            {{ createErrorText }}
                        </p>
                    </template>
                    <div class="flex items-center justify-end w-full mt-4">
                        <div class="space-x-4">
                            <a-button class="px-4" @click="handleCancel"
                                >Cancel</a-button
                            >
                            <a-button
                                type="primary"
                                class="px-4"
                                @click="createTerm"
                                >Link</a-button
                            >
                        </div>
                    </div>
                </div>
            </template>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        ref,
        watch,
        toRefs,
    } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import useGtcSearch from '~/components/glossary/composables/useGtcSearch'
    import useLinkAssets from '~/components/glossary/composables/useLinkAssets'

    export default defineComponent({
        components: { PillGroup },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        emits: ['update:selectedAsset'],
        setup(props, { emit }) {
            // data
            const { selectedAsset } = toRefs(props) // to update in cards
            const asset = computed(() => props.selectedAsset ?? {})
            const linkTermPopover = ref(false)
            const showLinkTermPopover = ref(false)

            const pillTerms = ref([...props.selectedAsset?.meanings]) // linked terms show in sidebar as pills
            const { terms, isLoading: searchLoading } = useGtcSearch(
                undefined,
                ref(true),
                'AtlasGlossaryTerm'
            ) // gets all the terms using basic search

            const availableTerms = ref([]) // terms to show in popover

            const assetLinkedTerms = computed(
                () => selectedAsset.value.meaningNames ?? []
            )

            const selectedTermForLink = ref([])
            const createErrorText = ref('')
            const createClassificationFormRef = ref()
            // methods

            // update avaible terms on link and unlink
            const updateAvailableTerms = () => {
                availableTerms.value = [...terms.value]
                availableTerms.value = availableTerms.value.filter(
                    (el) =>
                        !selectedAsset.value.meaningNames?.includes(
                            el?.displayText
                        )
                )
            }

            const handlePopoverVisibleChange = () => {
                showLinkTermPopover.value = false
                selectedTermForLink.value = []
            }

            const toggleLinkTermPopover = () => {
                if (!linkTermPopover.value) linkTermPopover.value = true
                else {
                    showLinkTermPopover.value = false
                    selectedTermForLink.value = []
                }
                updateAvailableTerms()
            }

            const handleCancel = () => {
                showLinkTermPopover.value = false
                linkTermPopover.value = false
            }

            // link term on click ok
            const createTerm = () => {
                const { assignLinkedAssets, unLinkAssets } = useLinkAssets()
                selectedTermForLink.value.map((el) => {
                    const { response, loading } = assignLinkedAssets(el, [
                        props.selectedAsset,
                    ])
                    watch(response, (data) => {
                        const termToBeAdded = terms.value.filter(
                            (term) => term.guid === el
                        )
                        handleCancel()
                        const obj = {
                            displayText: termToBeAdded[0].displayText,
                            termGuid:
                                termToBeAdded[0].termGuid ||
                                termToBeAdded[0].guid,
                        }
                        pillTerms.value = [...pillTerms.value, obj]
                        selectedAsset.value.meanings.push(obj)
                        selectedAsset.value.meaningNames.push(obj.displayText)

                        updateAvailableTerms()
                        emit('update:selectedAsset', props.selectedAsset)
                    })
                })
            }
            // unlink term on pill cross btn clicked
            const unLinkTerm = (term: any) => {
                const { unLinkAssets } = useLinkAssets()
                const { response: unlinkResponse, loading } = unLinkAssets(
                    term?.termGuid || term?.guid,
                    [props.selectedAsset]
                )
                pillTerms.value = pillTerms.value.filter((el) => {
                    if (term?.termGuid) {
                        return el?.termGuid !== term?.termGuid
                    }
                    if (el?.guid) return el?.guid !== term?.guid
                    return el?.termGuid !== term?.guid
                })
                selectedAsset.value.meaningNames =
                    selectedAsset.value?.meaningNames.filter(
                        (el) => el !== term?.displayText
                    )
                selectedAsset.value.meanings =
                    selectedAsset.value.meanings.filter((el) => {
                        if (term?.termGuid) {
                            return el?.termGuid !== term?.termGuid
                        }
                        return el?.termGuid !== term?.guid
                    })

                watch(unlinkResponse, (data) => {
                    // pillTerms.value.filter((el) => el?.termGuid !== term?.guid)
                    emit('update:selectedAsset', props.selectedAsset)
                    updateAvailableTerms()
                })
            }
            //  watchers
            watch(
                terms,
                () => {
                    updateAvailableTerms()
                },
                { immediate: true }
            )

            watch(
                selectedAsset,
                () => {
                    pillTerms.value = [...props.selectedAsset?.meanings]
                    updateAvailableTerms()
                },
                { deep: true }
            )

            return {
                asset,
                selectedAsset,
                createClassificationFormRef,
                showLinkTermPopover,
                selectedTermForLink,
                linkTermPopover,
                assetLinkedTerms,
                createErrorText,
                handlePopoverVisibleChange,
                toggleLinkTermPopover,
                terms,
                availableTerms,
                handleCancel,
                searchLoading,
                createTerm,
                pillTerms,
                unLinkTerm,
            }
        },
    })

    // typeName is name in classification
</script>

<style lang="less" module>
    .borderless {
        @apply border-none shadow-none px-4 !important;

        &:global(.ant-input-affix-wrapper-focused) {
            @apply border-none shadow-none;
        }
    }
    :global(.ant-form-item-label
            > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before) {
        @apply hidden;
    }
    // Aesterik in right side
    :global(.ant-form-item-label
            > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after) {
        display: inline-block;
        margin-left: 4px;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
    }
</style>
<style lang="less" scoped>
    ._bg-primary-light {
        background: rgba(34, 81, 204, 0.05);
    }
    .classification-cross-btn {
        height: 100%;
        right: 6px;
        @apply -top-0;
        background: linear-gradient(
            -90deg,
            rgba(82, 119, 215, 1) 60%,
            rgba(0, 0, 0, 0) 100%
        );
    }
    .classification-name-width {
        max-width: 12rem;
    }
</style>
