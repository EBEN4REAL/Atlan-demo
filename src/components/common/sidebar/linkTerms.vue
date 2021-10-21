<template>
    <div class="text-sm text-gray-500">
        <p class="mb-2 text-sm">Terms</p>
        <!-- shown in side bar  -->
        <div v-if="pillTerms.length > 0" class="flex flex-wrap items-center">
            <PillGroup
                :data="pillTerms"
                label-key="displayText"
                :read-only="!editPermission"
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
        <div v-if="pillTerms.length < 1">
            <div v-if="editPermission" @click.stop="toggleLinkTermPopover">
                <div
                    class="flex items-center cursor-pointer  text-primary hover:text-primary hover:underline"
                >
                    <span class="text-xs">Add terms</span>
                </div>
            </div>
            <div v-else>
                <div class="flex items-center text-gray-500 cursor-pointer">
                    <span class="text-xs">No terms</span>
                </div>
            </div>
        </div>
        <a-popover
            v-model:visible="linkTermPopover"
            placement="left"
            trigger="click"
        >
            <!-- popover content  -->
            <template #content>
                <div class="flex flex-col overflow-y-auto w-72">
                    <template v-if="!showLinkTermPopover">
                        <p class="mb-2 text-sm text-gray-700">Link Terms</p>
                        <!-- <a-select
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
                        </a-select> -->
                        <Governance
                            v-if="sendTerm"
                            :data="undefined"
                            :sendTerm="sendTerm"
                            @change="handleTermChange"
                        />
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
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import Governance from '@/common/facets/governance.vue'
    import { message } from 'ant-design-vue'

    export default defineComponent({
        components: { PillGroup, Governance },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
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
            const availableTerms = ref([]) // terms to show in popover
            const sendTerm = ref(false)

            const selectedTermForLink = ref([])
            const createErrorText = ref('')
            const createClassificationFormRef = ref()
            // methods

            const handlePopoverVisibleChange = () => {
                showLinkTermPopover.value = false
                selectedTermForLink.value = []
            }

            const toggleLinkTermPopover = () => {
                if (!linkTermPopover.value) {
                    linkTermPopover.value = true
                    sendTerm.value = true
                } else {
                    showLinkTermPopover.value = false
                    selectedTermForLink.value = []
                }
            }

            const handleCancel = () => {
                showLinkTermPopover.value = false
                linkTermPopover.value = false
                sendTerm.value = false
            }

            // link term on click ok
            const createTerm = () => {
                const { assignLinkedAssets } = useLinkAssets()
                selectedTermForLink.value.map((el) => {
                    const { response, loading } = assignLinkedAssets(el.guid, [
                        props.selectedAsset,
                    ])
                    watch(response, (data) => {
                        handleCancel()
                        const obj = {
                            displayText: el.name,
                            termGuid: el.guid,
                        }
                        pillTerms.value = [...pillTerms.value, obj]
                        selectedAsset.value.meanings.push(obj)
                        selectedAsset.value.meaningNames.push(obj.displayText)

                        // event for link term
                        useAddEvent(
                            'discovery',
                            'metadata',
                            'terms_updated',
                            undefined
                        )

                        emit('update:selectedAsset', props.selectedAsset)
                    })
                })
                handleCancel()
            }
            // unlink term on pill cross btn clicked
            const unLinkTerm = (term: any) => {
                const { unlinkAsset } = useLinkAssets()
                const { response: unlinkResponse, loading } = unlinkAsset(
                    term?.termGuid || term?.guid,
                    props.selectedAsset
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
                    useAddEvent(
                        'discovery',
                        'metadata',
                        'terms_updated',
                        undefined
                    )
                })
            }

            const isTermAlreadyLinked = (term) => {
                let isAvailable = true
                for (let index = 0; index < pillTerms.value.length; index++) {
                    const el = pillTerms.value[index]
                    if (el.termGuid !== term.guid) {
                        console.log('true')
                        isAvailable = true
                    } else {
                        console.log('false')
                        isAvailable = false
                        break
                    }
                }
                return isAvailable
            }

            const handleTermChange = (data) => {
                if (data) {
                    selectedTermForLink.value = data.filter((el) => {
                        if (isTermAlreadyLinked(el)) return true
                        message.info(`${el.name} already linked`)
                        return false
                    })
                }
            }

            watch(linkTermPopover, () => {
                if (linkTermPopover === false) sendTerm.value = false
            })
            watch(
                selectedAsset,
                () => {
                    pillTerms.value = [...props.selectedAsset?.meanings]
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
                createErrorText,
                handlePopoverVisibleChange,
                toggleLinkTermPopover,
                availableTerms,
                handleCancel,
                createTerm,
                pillTerms,
                unLinkTerm,
                handleTermChange,
                sendTerm,
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
