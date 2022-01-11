<template>
    <!-- Error on running a query -->
    <div
        class="flex flex-col items-center justify-center w-full h-full"
        v-if="isQueryRunning === 'error'"
    >
        <AtlanIcon icon="queryErorrIllus" class="w-36 h-28" />
        <div
            style="width: 300px"
            class="flex flex-col items-center justify-center mt-2"
        >
            <!-- {{ queryErrorObj }} -->
            <p
                class="mt-2 mb-0 text-base font-bold text-center text-gray-700"
                v-if="queryErrorObj?.errorCode"
            >
                {{ errorMessage(queryErrorObj) }}
            </p>

            <div
                v-if="
                    SOURCE_ACCESS_ERROR_NAMES.includes(queryErrorObj.errorName)
                "
            >
                <div
                    v-if="hasErrorData(queryErrorObj)"
                    class="text-center text-gray-500"
                >
                    User does not has access to the table
                    {{ queryErrorObj?.details?.asset.table }}
                </div>
            </div>
            <div v-else-if="queryErrorObj?.errorMessage">
                <div class="text-center text-gray-500">
                    {{ queryErrorObj?.errorMessage }}
                </div>
            </div>

            <div
                v-if="hasErrorAction(queryErrorObj) === 'copy'"
                class="flex flex-col items-center justify-center mt-2"
            >
                <a-dropdown-button
                    @click="handleCopy"
                    placement="topRight"
                    :class="$style.button"
                    :trigger="'click'"
                >
                    <div class="flex pl-2 pr-0.5 text-sm item-center">
                        <AtlanIcon
                            icon="CopyOutlined"
                            class="w-4 h-4 mr-1"
                            style="margin-top: 1px"
                        />
                        Copy error logs
                        <div
                            style="width: 1px"
                            class="ml-2 bg-gray-300 h-11/12"
                        ></div>
                    </div>

                    <template #overlay>
                        <a-menu class="py-1" :class="$style.ctaDropdown">
                            <a-menu-item key="1" @click="handleCopy">
                                <div class="flex items-center px-4 h-9">
                                    <span>Copy error logs</span>
                                </div>
                            </a-menu-item>
                            <a-menu-item key="2" @click="handleCopyQuery">
                                <div class="flex items-center px-4 h-9">
                                    <span>Copy error logs with query</span>
                                </div>
                            </a-menu-item>
                        </a-menu>
                    </template>
                    <template #icon>
                        <AtlanIcon
                            icon="ChevronDown"
                            class="w-4 h-4 text-gray-500 outline-none"
                        ></AtlanIcon>
                    </template>
                </a-dropdown-button>
            </div>
        </div>
    </div>
    <!-- ---------------------- -->
</template>

<script lang="ts">
    import { defineComponent, computed, inject, Ref } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useError } from '~/components/insights/playground/common/composables/UseError'
    import { copyToClipboard } from '~/utils/clipboard'
    import { message } from 'ant-design-vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

    export default defineComponent({
        components: { AtlanIcon },
        props: {},
        setup() {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>

            const isQueryRunning = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .isQueryRunning
            )
            const queryErrorObj = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .queryErrorObj
            )

            const handleCopy = () => {
                if (queryErrorObj.value) {
                    copyToClipboard(
                        `${JSON.stringify({
                            error: queryErrorObj.value,
                        })}`
                    )
                    message.success('Error log copied')
                }
            }

            const handleCopyQuery = () => {
                if (queryErrorObj.value) {
                    copyToClipboard(
                        `${JSON.stringify({
                            query: activeInlineTab.value.playground.editor.text,
                            error: queryErrorObj.value,
                        })}`
                    )
                    message.success('Error log copied')
                }
            }

            const {
                errorMessage,
                SOURCE_ACCESS_ERROR_NAMES,
                hasErrorAction,
                hasErrorData,
            } = useError()

            return {
                isQueryRunning,
                queryErrorObj,
                errorMessage,
                hasErrorAction,
                hasErrorData,
                SOURCE_ACCESS_ERROR_NAMES,
                handleCopy,
                handleCopyQuery,
            }
        },
    })
</script>
<style lang="less" scoped></style>
<style lang="less" module>
    .ctaDropdown {
        :global(.ant-dropdown-menu-item) {
            padding: 0;
        }
    }
    .button {
        :global(.ant-btn.ant-btn-default) {
            @apply border-gray-300;
            @apply text-gray-500;
            @apply px-0;
            @apply h-8;
            border-right: 0px;
            &:hover {
                @apply border-gray-300;
                border-right: 0px;
                @apply text-gray-500;
            }
            &:focus-visible {
                @apply border-gray-300;
                @apply text-gray-500;
                border-right: 0px;
            }
        }
        :global(.ant-btn.ant-btn-default.ant-dropdown-trigger.ant-btn-icon-only) {
            border-left: 0px !important;
            @apply h-8;
            border-right: 1px solid;
            @apply border-gray-300;
            &:hover {
                @apply border-gray-300;
            }
            &:focus-visible {
                @apply border-gray-300;
            }
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
