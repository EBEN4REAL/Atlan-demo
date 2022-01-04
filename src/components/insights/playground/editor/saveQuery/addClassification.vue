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
            <AtlanIcon icon="Shield"></AtlanIcon>
            <span class="flex pl-0.5 text-xs text-gray-500 truncate mt-0.5">
                Classification
                <span
                    v-if="selectedValue?.classifications?.length"
                    class="ml-0.5"
                >
                    ({{ selectedValue?.classifications?.length }})</span
                >
            </span>
        </AtlanBtn>

        <template #overlay>
            <div class="popover-container" @mouseleave="closeDropdown">
                <div class="p-2 py-4">
                    <div style="">
                        <ClassificationFacet
                            v-model="selectedValue"
                            :show-none="false"
                            @change="handleChange"
                        ></ClassificationFacet>
                    </div>
                </div>
            </div>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, toRefs } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AtlanBtn from '~/components/UI/button.vue'
    import ClassificationFacet from '~/components/common/facet/classification/index.vue'

    export default defineComponent({
        components: {
            // Governance,
            AtlanBtn,
            ClassificationFacet,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            selectedClassifications: {
                type: Object,
                required: true,
            },
        },
        emits: ['update:selectedAsset', 'saveClassifications'],
        setup(props, { emit }) {
            const { selectedClassifications } = toRefs(props)
            const selectedValue = ref(selectedClassifications.value)

            const handleChange = () => {
                emit('saveClassifications', selectedValue)
                console.log('checked terms: ', selectedValue.value)
            }

            let dropdownVisible = ref(false)
            const toggleDropdown = () => {
                dropdownVisible.value = !dropdownVisible.value
            }

            const closeDropdown = () => {
                dropdownVisible.value = false
            }
            const showDropdown = () => {
                dropdownVisible.value = true
            }

            return {
                toggleDropdown,
                showDropdown,
                closeDropdown,
                dropdownVisible,
                selectedValue,
                handleChange,
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
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 4px 8px !important;

        min-width: 71px !important;
        height: 22px !important;

        box-sizing: border-box !important;
        border-radius: 4px !important;
    }
    .popover-container {
        // width: 295px*1.5;
        // height: 257px;

        width: 320px;
        // height: 420px;
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
