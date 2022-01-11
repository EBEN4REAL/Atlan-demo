<template>
    <div class="flex flex-col">
        <p
            class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
        >
            Category
        </p>
        <div class="px-5 uppercase">
            {{ attributes(selectedAsset)?.category }}
        </div>
    </div>

    <div
        v-if="!qualifiedName(selectedAsset).includes('powerbi')"
        class="flex flex-col"
        @click="handleOpenModal"
    >
        <p
            class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
        >
            SQL Query
        </p>

        <div class="px-5">
            <div
                class="flex flex-col p-4 border border-gray-200 rounded"
                :class="{ 'cursor-pointer hover:shadow': editPermission }"
            >
                <div class="flex items-center mb-3 gap-x-6">
                    <p class="flex items-center text-gray-500">
                        <AtlanIcon
                            icon="Approve"
                            class="mr-1"
                            v-if="allowQuery(selectedAsset)"
                        ></AtlanIcon>
                        <AtlanIcon
                            icon="Decline"
                            class="mr-1"
                            v-else
                        ></AtlanIcon>
                        Query
                    </p>

                    <p class="flex items-center text-gray-500">
                        <AtlanIcon
                            icon="Approve"
                            class="mr-1"
                            v-if="allowQueryPreview(selectedAsset)"
                        ></AtlanIcon>
                        <AtlanIcon
                            icon="Decline"
                            class="mr-1"
                            v-else
                        ></AtlanIcon>
                        Preview
                    </p>
                </div>

                <div class="flex items-center mb-3 gap-x-6">
                    <div class="flex flex-col">
                        <p
                            class="flex items-center justify-between mb-1 text-sm text-gray-500"
                        >
                            Credential
                        </p>
                        <div class="uppercase">
                            {{ attributes(selectedAsset)?.credentialStrategy }}
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <p
                            class="flex items-center justify-between mb-1 text-sm text-gray-500"
                        >
                            Row Limit
                        </p>
                        <div class="uppercase">
                            {{ connectionRowLimit(selectedAsset) }}
                        </div>
                    </div>
                </div>
            </div>
            <a-modal
                v-model:visible="visible"
                title="SQL Query Update"
                :destroyOnClose="true"
                :maskClosable="false"
            >
                <div class="flex flex-col p-4 text-gray-500">
                    <div class="flex items-center mb-3 gap-x-6">
                        <div class="flex flex-col">
                            <p class="mb-1 text-sm">Query</p>
                            <RadioButtons
                                v-model="localValue.allowQuery"
                                :list="radioList"
                            />
                        </div>

                        <div class="flex flex-col">
                            <p class="mb-1 text-sm">Preview</p>
                            <RadioButtons
                                v-model="localValue.allowQueryPreview"
                                :list="radioList"
                            />
                        </div>
                    </div>

                    <div class="flex items-center mb-3 gap-x-6">
                        <div class="flex flex-col">
                            <p class="mb-1 text-sm">Row Limit</p>
                            <a-input
                                v-model:value="localValue.connectionRowLimit"
                                placeholder="Input a number"
                                type="number"
                                :min="0"
                                required
                            />
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="handleCancel">Cancel</a-button>
                    <a-button type="primary" @click="handleUpdate"
                        >Update</a-button
                    >
                </template>
            </a-modal>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        toRefs,
        ref,
        PropType,
        watch,
    } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useVModels } from '@vueuse/core'
    import RadioButtons from '@common/radio/customRadioButtonSingle.vue'
    import { CheckboxArray } from '~/types'

    export default defineComponent({
        name: 'ConnectionDetails',
        components: { RadioButtons },
        props: {
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
            modelValue: {
                type: Object,
                required: false,
                default: () => {},
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { editPermission, selectedAsset } = toRefs(props)
            const visible = ref(false)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const radioList: CheckboxArray = [
                { id: true, label: 'Yes' },
                { id: false, label: 'No' },
            ]

            const {
                attributes,
                connectionRowLimit,
                allowQuery,
                allowQueryPreview,
                qualifiedName,
            } = useAssetInfo()

            const queryConfigJSON = computed(() => {
                if (attributes(selectedAsset.value)?.queryConfig) {
                    return JSON.parse(
                        attributes(selectedAsset.value)?.queryConfig
                    )
                }
                return {}
            })

            const handleOpenModal = () => {
                if (editPermission.value) {
                    visible.value = true
                }
            }

            const handleUpdate = () => {
                modelValue.value = localValue.value
                emit('change')
                visible.value = false
            }

            const resetInput = () => {
                localValue.value.allowQuery = allowQuery(selectedAsset.value)
                localValue.value.allowQueryPreview = allowQueryPreview(
                    selectedAsset.value
                )
                localValue.value.connectionRowLimit = connectionRowLimit(
                    selectedAsset.value
                )
            }

            const handleCancel = () => {
                visible.value = false
                resetInput()
            }

            watch(selectedAsset, () => {
                resetInput()
            })

            return {
                selectedAsset,
                attributes,
                queryConfigJSON,
                editPermission,
                handleOpenModal,
                qualifiedName,
                visible,
                handleCancel,
                handleUpdate,
                connectionRowLimit,
                allowQuery,
                allowQueryPreview,
                localValue,
                radioList,
            }
        },
    })
</script>
