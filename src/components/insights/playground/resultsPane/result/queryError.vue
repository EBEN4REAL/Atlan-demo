<template>
    <!-- Error on running a query -->
    <div
        class="flex flex-row items-center justify-between w-full h-full bg-new-gray-100"
        v-if="isQueryRunning === 'error'"
    >
            <!--  error body -->
            <!-- Image -->
            <div
                v-if="httpErrorCode(queryErrorObj?.errorCode)==='403'"
                class="error-img text-right"
            >
                <AtlanIcon icon="queryNoAccessIllus" class="h-full mr-12" />
            </div>
            <div
                v-else-if="queryErrorObj?.errorCode==='000'"
                class="error-img text-right"
            >
                <AtlanIcon icon="queryNoInternetIllus" class="h-full mr-10" />
            </div>
            <div v-else class="error-img text-right">
                <AtlanIcon icon="queryErrorIllus" class="h-full mr-12" />
            </div>

            <div class="error-message text-left">
                <!-- {{ queryErrorObj }} -->
                <!-- Which error -->
                <p
                    v-if="queryErrorObj?.errorCode"
                    class="mb-1 text-xl font-bold text-new-gray-700"
                >
                    {{ errorMessage(queryErrorObj) }}
                </p>

                <!-- If access error -->
                <div
                    v-if="
                        SOURCE_ACCESS_ERROR_NAMES.includes(queryErrorObj.errorName)
                    "
                >
                    <div
                        v-if="hekaErrorCode(queryErrorObj?.errorCode)==='002' || hekaErrorCode(queryErrorObj?.errorCode)==='003'"
                        class=" error-desc text-gray-500"
                    >
                        You can’t query on the connection, "<b>{{ queryErrorObj?.details?.asset?.connectionName }}</b>"
                    </div>
                    <div
                        v-else-if="hekaErrorCode(queryErrorObj?.errorCode)==='004' || hekaErrorCode(queryErrorObj?.errorCode)==='005'"
                        class="error-desc text-gray-500"
                    >
                        You can’t query on asset, "<b>{{ queryErrorObj?.details?.asset?.table }}</b>" because of “query denial” data policy.
                    </div>
                    <div
                        v-else class="error-desc text-gray-500"
                    >
                        You do not have query access to
                        {{ queryErrorObj?.details?.asset?.table }} table
                    </div>
                </div>

                <div v-else-if="queryErrorObj?.errorMessage">
                    <div class="error-desc text-gray-500">
                        {{ errorDescription(queryErrorObj) }}
                    </div>
                </div>

                <div v-if="hasHelperText(queryErrorObj)">
                    <div class="error-desc text-gray-500 mt-5">
                        {{ hasHelperText(queryErrorObj) }}
                    </div>
                </div>

                <!-- If can copy error logs -->
                <div
                    v-if="hasErrorAction(queryErrorObj) === 'copy'"
                    class="flex flex-col justify-center mt-5"
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
    import { defineComponent, computed, inject, Ref, toRefs } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useError } from '~/components/insights/playground/common/composables/UseError'
    import { copyToClipboard } from '~/utils/clipboard'
    import { message } from 'ant-design-vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

    export default defineComponent({
        components: { AtlanIcon },
        props: {
            isQueryRunning: {
                type: String,
                required: true,
            },
            queryErrorObj: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const { isQueryRunning, queryErrorObj } = toRefs(props)

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>

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
                errorDescription,
                SOURCE_ACCESS_ERROR_NAMES,
                hasErrorAction,
                hasErrorData,
                httpErrorCode,
                hekaErrorCode,
                hasHelperText
            } = useError()

            return {
                isQueryRunning,
                queryErrorObj,
                errorMessage,
                errorDescription,
                hasErrorAction,
                hasErrorData,
                hasHelperText,
                SOURCE_ACCESS_ERROR_NAMES,
                handleCopy,
                handleCopyQuery,
                httpErrorCode,
                hekaErrorCode
            }
        },
    })
</script>
<style lang="less" scoped>
    .error-img {
        height: 148px;
        flex: 2;
    }
    .error-message {
        flex: 3;
    }
    .error-desc {
        max-width: 460px;
    }
    .no-access-icon {
        height: 148px;
        width: 148px;
    }
    .no-internet-icon {
        height: 148px;
        width: 188px;
    }
</style>
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