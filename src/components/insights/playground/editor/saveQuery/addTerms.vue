<template>
    <a-dropdown
        trigger="click"
        placement="bottomLeft"
        :visible="dropdownVisible"
    >
        <!-- <AtlanBtn
            class="folderBtn"
            size="sm"
            color="secondary"
            padding="compact"
            @click="toggleDropdown"
        >
            <AtlanIcon icon="Term"></AtlanIcon>
            <span class="flex truncate">
                Term
                <span v-if="checkedTerms?.length" class="ml-0.5">
                    ({{ checkedTerms?.length }})</span
                >
            </span>
        </AtlanBtn> -->
        <div
            id="toggleDropdownBtn"
            class="flex btn-shadow"
            @click="toggleDropdown"
        >
            <AtlanIcon
                :icon="
                    checkedTerms?.length === 1
                        ? getEntityStatusIcon(
                              checkedTerms[0]?.dataRef.typeName,
                              certificateStatus(checkedTerms[0]?.dataRef)
                          )
                        : 'Term'
                "
                class="mr-1"
            ></AtlanIcon>
            <span class="flex truncate">
                <span v-if="checkedTerms?.length === 1">
                    {{ title(checkedTerms[0]?.dataRef) }}
                </span>
                <span v-else-if="checkedTerms?.length > 1">
                    {{ checkedTerms?.length }} Terms</span
                >
                <span v-else>Term</span>
            </span>
        </div>

        <template #overlay>
            <div class="popover-container">
                <div class="py-2">
                    <div>
                        <GlossaryTree
                            ref="glossaryTreeRef"
                            v-model:checkedGuids="checkedGuids"
                            :checkable="true"
                            @check="onCheck"
                            @searchItemCheck="onSearchItemCheck"
                        />
                    </div>
                </div>
            </div>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRefs } from 'vue'
    import { onClickOutside } from '@vueuse/core'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AtlanBtn from '~/components/UI/button.vue'
    import GlossaryTree from '~/components/glossary/index.vue'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        components: {
            AtlanBtn,
            GlossaryTree,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            selectedTerms: {
                type: Array,
                required: true,
            },
        },
        emits: ['update:selectedAsset', 'saveTerms'],
        setup(props, { emit }) {
            const { selectedTerms } = toRefs(props)
            const checkedTerms = ref(selectedTerms?.value)
            const { title, certificateStatus } = useAssetInfo()
            const { getEntityStatusIcon } = useGlossaryData()
            const checkedGuids = ref(
                checkedTerms.value.map((term) => term.guid)
            )

            const dropdownVisible = ref(false)
            const toggleDropdown = () => {
                dropdownVisible.value = !dropdownVisible.value
            }

            const closeDropdown = () => {
                dropdownVisible.value = false
            }
            const showDropdown = () => {
                dropdownVisible.value = true
            }

            // on click outside logic
            const glossaryTreeRef = ref(null)
            onClickOutside(glossaryTreeRef, (event) => {
                if (event?.path?.find((p) => p?.id === 'toggleDropdownBtn'))
                    return
                closeDropdown()
            })

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

                console.log('checked terms: ', checkedTerms.value)

                emit('saveTerms', checkedTerms)
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
                checkedTerms,
                toggleDropdown,
                showDropdown,
                closeDropdown,
                dropdownVisible,
                onCheck,
                onSearchItemCheck,
                title,
                certificateStatus,
                getEntityStatusIcon,
                glossaryTreeRef,
            }
        },
    })
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
    .folderBtn {
        // display: flex;
        // flex-direction: row;
        // align-items: center;
        // padding: 4px 8px !important;

        // min-width: 71px !important;
        // height: 22px !important;

        // box-sizing: border-box !important;
        // border-radius: 4px !important;
    }
    .popover-container {
        width: 295px;
        // max-height: 312px;
        background: #ffffff;

        box-shadow: 0px 9px 32px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        // overflow-y: scroll;
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
    .btn-shadow {
        box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.05);
    }
</style>
