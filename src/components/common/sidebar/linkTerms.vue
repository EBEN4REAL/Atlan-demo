<template>
    <div class="text-sm text-gray-500">
        <p class="mb-1 text-sm">Terms</p>
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
                        class="flex items-center cursor-pointer  text-primary hover:text-primary hover:underline"
                    >
                        <span class="text-xs">Add Terms</span>
                    </div>
                </div>
            </div>
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
                                >Create</a-button
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
        reactive,
        ref,
        Ref,
        toRaw,
        UnwrapRef,
        watch,
        onMounted,
        toRefs,
    } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import useGtcSearch from '~/components/glossary/composables/useGtcSearch'
    import useLinkAssets from '~/components/glossary/composables/useLinkAssets'
    export default defineComponent({
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        components: { PillGroup },

        emits: ['update:selectedAsset'],
        setup(props, { emit }) {
            const { selectedAsset } = toRefs(props)
            const asset = computed(() => props.selectedAsset ?? {})
            const linkTermPopover = ref(false)
            const linkClassificationStatus = ref('')
            const showAll = ref(false)
            const showLinkTermPopover = ref(false)

            const showAddClassificationBtn = ref(false)
            const pillTerms = ref([...props.selectedAsset?.meanings])
            const isDrawerVisible = ref(false)
            const {
                terms,
                isLoading: searchLoading,
                fetchAssets: fetchCategories,
            } = useGtcSearch(undefined, ref(true), 'AtlasGlossaryTerm')

            const availableTerms = ref([])
            watch(
                terms,
                () => {
                    availableTerms.value = [...terms.value]
                },
                { immediate: true }
            )

            const assetLinkedTerms = computed(
                () => selectedAsset.value.meaningNames ?? []
            )

            const selectedTermForLink = ref([])
            const createErrorText = ref('')
            const createClassificationFormRef = ref()

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
            }

            const handleCancel = () => {
                showLinkTermPopover.value = false
                linkTermPopover.value = false
            }
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
                        pillTerms.value = [...pillTerms.value, ...termToBeAdded]
                        console.log(termToBeAdded[0])
                        selectedAsset.value.meanings.push({
                            displayText: termToBeAdded[0].displayText,
                            termGuid:
                                termToBeAdded[0].termGuid ||
                                termToBeAdded[0].guid,
                        })
                        console.log(selectedAsset.value?.meanings)

                        emit('update:selectedAsset', props.selectedAsset)
                    })
                })
            }
            const unLinkTerm = (term: any) => {
                const { unLinkAssets } = useLinkAssets()
                const { response: unlinkResponse, loading } = unLinkAssets(
                    term?.termGuid || term?.guid,
                    [props.selectedAsset]
                )
                pillTerms.value = pillTerms.value.filter((el) => {
                    if (term?.termGuid) {
                        console.log('termGuid called')
                        return el?.termGuid !== term?.termGuid
                    }
                    if (el?.guid) return el?.guid !== term?.guid
                    return el?.termGuid !== term?.guid
                })

                watch(unlinkResponse, (data) => {
                    // pillTerms.value.filter((el) => el?.termGuid !== term?.guid)
                    emit('update:selectedAsset', props.selectedAsset)
                })
            }

            watch(asset, () => {
                pillTerms.value = [...props.selectedAsset?.meanings]
            })

            return {
                asset,
                selectedAsset,
                createClassificationFormRef,
                showLinkTermPopover,
                linkClassificationStatus,
                selectedTermForLink,
                linkTermPopover,
                assetLinkedTerms,
                createErrorText,
                showAddClassificationBtn,
                handlePopoverVisibleChange,
                toggleLinkTermPopover,
                showAll,
                isDrawerVisible,
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
