<template>
    <div v-if="loading" class="flex items-center justify-center w-full h-full">
        <AtlanIcon icon="Loader" class="w-auto h-8 animate-spin" />
    </div>
    <div v-else class="flex flex-col pl-5 mb-3" ref="target">
        <div class="flex items-center justify-between pr-3 mt-4 mb-3 mr-2">
            <div class="font-semibold text-gray-500">{{ data.label }}</div>
            <div
                v-if="
                    selectedAssetUpdatePermission(
                        selectedAsset,
                        'ENTITY_UPDATE_BUSINESS_METADATA'
                    )
                "
            >
                <a-button v-if="readOnly" @click="() => (readOnly = false)">
                    <AtlanIcon icon="Edit" />
                    <span class="ml-1 text-gray-700">Edit</span>
                </a-button>
                <div v-else class="flex items-center gap-x-2">
                    <span
                        class="text-sm font-medium text-gray-500 cursor-pointer"
                        @click="handleCancel"
                    >
                        Cancel
                    </span>
                    <AtlanButton
                        :disabled="!isEdit"
                        size="sm"
                        padding="compact"
                        @click="handleUpdate"
                    >
                        Update
                    </AtlanButton>
                </div>
            </div>
        </div>
        <div
            class="flex flex-col flex-grow pr-5 overflow-auto gap-y-5 scrollheight"
        >
            <template
                v-for="(a, x) in readOnly
                    ? [...applicableList].sort(readOnlySort)
                    : applicableList"
                :key="x"
            >
                <div>
                    <div class="mb-2 font-normal text-gray-500">
                        <span class="">{{ a.displayName }}</span>
                        <a-tooltip>
                            <template #title>
                                <span>{{ a.options.description }}</span>
                            </template>
                            <AtlanIcon
                                v-if="a.options.description"
                                class="h-4 mb-1 ml-2 text-gray-400 hover:text-gray-500"
                                icon="Info"
                            />
                        </a-tooltip>
                    </div>

                    <ReadOnly v-if="readOnly" :attribute="a" />

                    <EditState
                        v-else-if="!readOnly"
                        v-model="a.value"
                        :index="x"
                        :attribute="a"
                        @change="handleChange(x, a.value)"
                    />
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        watch,
        PropType,
        inject,
        defineAsyncComponent,
        Ref,
        h,
        resolveComponent,
    } from 'vue'
    import {
        whenever,
        useMagicKeys,
        onKeyStroke,
        watchOnce,
        onClickOutside,
    } from '@vueuse/core'
    import { message, Modal } from 'ant-design-vue'
    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'
    import { Types } from '~/services/meta/types/index'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useFacetUsers from '~/composables/user/useFacetUsers'
    import useFacetGroups from '~/composables/group/useFacetGroups'
    import { useCurrentUpdate } from '~/composables/discovery/useCurrentUpdate'
    import AtlanButton from '@/UI/button.vue'
    import Confirm from '@/common/modal/confirm.vue'

    export default defineComponent({
        name: 'CustomMetadata',
        components: {
            ReadOnly: defineAsyncComponent(() => import('./readOnly.vue')),
            EditState: defineAsyncComponent(() => import('./editState.vue')),
            AtlanButton,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset, data } = toRefs(props)

            const readOnly = ref(true)
            const loading = ref(false)
            const guid = ref()

            const { title, selectedAssetUpdatePermission } = useAssetInfo()
            const {
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                getApplicableAttributes,
                getEnumOptions,
            } = useCustomMetadataHelpers()

            const applicableList = ref(
                getApplicableAttributes(
                    data.value,
                    selectedAsset.value.typeName
                )
            )
            const payload = ref({})

            const initializeAttributesList = () => {
                applicableList.value = []
                applicableList.value = getApplicableAttributes(
                    data.value,
                    selectedAsset.value.typeName
                )
            }

            /**
             * @desc parses all the attached bm from the asset payload and
             *  forms the initial attribute list
             */
            const setAttributesList = () => {
                initializeAttributesList()
                if (selectedAsset.value?.attributes) {
                    const bmAttributes = Object.keys(
                        selectedAsset.value.attributes
                    ).filter((attr) => attr.split('.').length > 1)

                    if (bmAttributes.length)
                        bmAttributes.forEach((ab) => {
                            if (data.value.id === ab.split('.')[0]) {
                                const attribute = ab.split('.')[1]

                                const value = selectedAsset.value.attributes[ab]
                                const attrIndex =
                                    applicableList.value.findIndex(
                                        (a) => a.name === attribute
                                    )
                                const options =
                                    applicableList.value[attrIndex]?.options

                                if (attrIndex > -1) {
                                    if (options?.multiValueSelect === 'true') {
                                        // value = JSON.parse(value)
                                    }

                                    applicableList.value[attrIndex].value =
                                        value
                                }
                            }
                        })
                }
            }

            // {"BM for facet 2":{"test for facet 2":"1","test for facet 2 date":1629294652575}}
            const payloadConstructor = () => {
                const mappedPayload = { [data.value.id]: {} }
                // ? handle current payload
                Object.keys(selectedAsset.value.attributes).forEach((k) => {
                    if (k.split('.').length > 1) {
                        const b = k.split('.')[0]
                        const a = k.split('.')[1]
                        const value = selectedAsset.value.attributes[k]
                        mappedPayload[b] = {
                            ...(mappedPayload[b] || {}),
                            [a]: value,
                        }
                    }
                })

                const checkIfDelete = (v, multiValue) => {
                    if (multiValue) return !v?.length
                    return v == null || v === ''
                }
                // ? handle new payload
                applicableList.value.forEach((at) => {
                    if (
                        checkIfDelete(
                            at.value,
                            at.options.multiValueSelect === 'true'
                        )
                    )
                        delete mappedPayload[data.value.id][at.name]
                    else mappedPayload[data.value.id][at.name] = at.value
                })

                return mappedPayload
            }

            const {
                asset,
                mutate: mutateUpdate,
                isReady: isUpdateReady,
            } = useCurrentUpdate({
                id: guid,
            })

            const isEdit = ref(false)

            const handleUpdate = () => {
                payload.value = payloadConstructor()

                const { error, isReady, isLoading } =
                    Types.updateAssetBMChanges(
                        selectedAsset.value?.guid,
                        payload.value
                    )
                loading.value = isLoading.value

                watch([() => isLoading, error, isReady], () => {
                    if (error.value) {
                        loading.value = false
                        message.error(
                            'Some error occured...Please try again later.'
                        )
                        setAttributesList()
                    } else if (isReady?.value) {
                        loading.value = false
                        message.success(
                            `${data.value?.label} attributes for ${title(
                                selectedAsset.value
                            )} updated`
                        )
                        guid.value = selectedAsset.value.guid

                        mutateUpdate()
                    }
                    isEdit.value = false
                })

                readOnly.value = true
            }

            const cancel = () => {
                applicableList.value.forEach((att) => {
                    // eslint-disable-next-line no-param-reassign
                    att.value = ''
                })
                setAttributesList()
                readOnly.value = true
                isEdit.value = false
            }

            const handleCancel = () => {
                if (isEdit.value) {
                    Modal.confirm({
                        title: () =>
                            h(
                                'span',
                                {
                                    class: ['font-bold'],
                                },
                                'Discard'
                            ),
                        content: () =>
                            h(Confirm, {
                                title: data.value.label,
                            }),
                        okType: 'danger',
                        autoFocusButton: null,
                        okButtonProps: {
                            type: 'primary',
                        },
                        okText: 'Discard',
                        onOk: cancel,
                    })
                } else cancel()
            }

            const handleChange = (index, value) => {
                if (!isEdit.value) isEdit.value = true
                applicableList.value[index].value = value
            }

            const updateList = inject('updateList') as Function
            whenever(isUpdateReady, () => {
                if (
                    asset.value.typeName !== 'AtlasGlossary' &&
                    asset.value.typeName !== 'AtlasGlossaryCategory' &&
                    asset.value.typeName !== 'AtlasGlossaryTerm'
                ) {
                    updateList(asset.value)
                }
            })

            watch(
                () => selectedAsset.value.guid,
                () => {
                    initializeAttributesList()
                },
                {
                    immediate: true,
                }
            )

            setAttributesList()

            const hasValue = (a) => {
                const isMultivalued =
                    a.options.multiValueSelect === 'true' ||
                    a.options.multiValueSelect === true
                const dataType = getDatatypeOfAttribute(a)

                if (
                    [
                        'url',
                        'text',
                        'int',
                        'float',
                        'number',
                        'decimal',
                        'users',
                        'groups',
                        'enum',
                    ].includes(dataType) &&
                    isMultivalued
                )
                    return !!a.value?.length
                if (
                    ['url', 'text', 'users', 'groups', 'enum'].includes(
                        dataType
                    )
                )
                    return !!a.value
                return !!formatDisplayValue(a.value?.toString() || '', dataType)
            }

            const readOnlySort = (a, b) =>
                hasValue(a) && !hasValue(b) ? -1 : 1

            onKeyStroke(['Enter'], (e) => {
                e.stopPropagation()
                if ((e.ctrlKey || e.metaKey) && isEdit.value && !readOnly.value)
                    handleUpdate()
            })

            return {
                readOnlySort,
                hasValue,
                isEdit,
                getDatatypeOfAttribute,
                isLink,
                formatDisplayValue,
                applicableList,
                readOnly,
                handleUpdate,
                handleCancel,
                getEnumOptions,
                handleChange,
                loading,
                selectedAssetUpdatePermission,
            }
        },
    })
</script>
<style scoped>
    .scrollheight {
        max-height: calc(100vh - 7rem);
    }
</style>
