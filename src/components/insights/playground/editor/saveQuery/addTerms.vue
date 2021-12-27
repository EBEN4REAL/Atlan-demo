<template>
    <a-dropdown
        trigger="hover"
        placement="bottomLeft"
        :visible="dropdownVisible"
    >
        <AtlanBtn
            class="folderBtn"
            size="sm"
            color="secondary"
            padding="compact"
            @click="toggleDropdown"
        >
            <AtlanIcon icon="FolderClosed"></AtlanIcon>
            <span class="flex pl-0.5 text-xs text-gray-500 truncate mt-0.5">
                Term
            </span>
        </AtlanBtn>

        <template #overlay>
            <div class="popover-container" @mouseleave="closeDropdown">
                <div class="p-2 py-4">
                    <div>
                        <GlossaryTree
                            v-model:checkedGuids="checkedGuids"
                            :checkable="true"
                            @check="onCheck"
                            @searchItemCheck="onSearchItemCheck"
                        />
                    </div>

                    <div
                        class="flex items-center justify-end w-full px-4 mt-3"
                        style=""
                    >
                        <div class="space-x-4">
                            <a-button class="px-4" @click="closeDropdown"
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
            </div>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import {
        // computed,
        defineComponent,
        PropType,
        ref,
        watch,
        toRefs,
    } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AtlanBtn from '~/components/UI/button.vue'
    import GlossaryTree from '~/components/glossary/index.vue'

    export default defineComponent({
        components: {
            // Governance,
            AtlanBtn,
            GlossaryTree,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        emits: ['update:selectedAsset', 'saveTerms'],
        setup(props, { emit }) {
            // data
            const sendTerm = ref(true)
            let checkedTerms = ref([])

            const checkedGuids = ref(
                checkedTerms.value.map((term) => term.termGuid)
            )
            // link term on click ok
            const createTerm = () => {
                emit('saveTerms', checkedTerms)
                console.log('checked terms: ', checkedTerms.value)
                closeDropdown()
            }

            const handleTermChange = (data) => {
                console.log('term data: ', data.value)
                if (data) {
                    checkedTerms.value = data.value
                    console.log('checked terms: ', checkedTerms.value)
                }
            }

            let dropdownVisible = ref(false)
            const toggleDropdown = () => {
                // checkedTerms.value = []
                dropdownVisible.value = !dropdownVisible.value
            }

            const closeDropdown = () => {
                // checkedTerms.value = []
                dropdownVisible.value = false
            }
            const showDropdown = () => {
                dropdownVisible.value = true
            }

            const onCheck = (checkedNodes) => {
                checkedNodes.forEach((term) => {
                    if (
                        !checkedTerms.value.find(
                            (localTerm) =>
                                (localTerm.guid ?? localTerm.termGuid) ===
                                term.guid
                        )
                    )
                        checkedTerms.value.push(term)
                })
                checkedTerms.value = checkedTerms.value.filter((term) =>
                    checkedGuids.value.includes(term.termGuid ?? term.guid)
                )
            }

            const onSearchItemCheck = (checkedNode, checked) => {
                if (checked) {
                    checkedTerms.value.push(checkedNode)
                } else {
                    checkedTerms.value = checkedTerms.value?.filter(
                        (localTerm) =>
                            (localTerm.guid ?? localTerm.termGuid) !==
                            checkedNode.guid
                    )
                }
            }

            return {
                checkedGuids,
                handleTermChange,
                sendTerm,
                checkedTerms,
                toggleDropdown,
                showDropdown,
                closeDropdown,
                dropdownVisible,
                onCheck,
                onSearchItemCheck,
                createTerm,
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
    .ant-tree li span.ant-tree-switcher {
        position: relative;
        margin-top: -3px !important;
        margin-bottom: 2px !important;
    }
</style>
<style lang="less" scoped>
    .popover-container {
        // width: 295px*1.5;
        // height: 257px;

        width: 320px;
        background: #ffffff;

        box-shadow: 0px 9px 32px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        overflow-y: scroll;
        padding: 0px !important;
    }
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
