<template>
    <div data-test-id="classification-popover">
        <a-popover
            v-model:visible="isEdit"
            placement="leftTop"
            :overlay-class-name="$style.classificationPopover"
            :trigger="['click']"
            :destroy-tooltip-on-hide="destroyTooltipOnHide"
            @visibleChange="handleVisibleChange"
        >
            <template #content>
                <div
                    v-if="!editPermission && role !== 'Guest'"
                    class="px-3 py-2 mx-4 mb-3 bg-gray-100"
                >
                    You don't have edit access, suggest Classifications.<br />
                    <span class="text-primary cursor-pointer">
                        <a-popover placement="rightBottom">
                            <template #content>
                                <AdminList></AdminList>
                            </template>
                            <span>Admins</span>
                        </a-popover>
                    </span>
                    can review the requests.
                </div>

                <div>
                    <ClassificationFacet
                        ref="classificationFacetRef"
                        v-model="selectedValue"
                        :show-none="false"
                        @change="handleSelectedChange"
                    ></ClassificationFacet>
                </div>
                <div
                    v-if="!editPermission && role !== 'Guest'"
                    class="flex items-center justify-end mx-2 mt-5 space-x-2"
                >
                    <a-button @click="handleCancelRequest">Cancel</a-button>
                    <a-button
                        type="primary"
                        :loading="requestLoading"
                        @click="handleRequest"
                        class="bg-primary"
                        >Submit Request</a-button
                    >
                </div>
            </template>
        </a-popover>

        <div class="flex flex-wrap items-center gap-1 text-sm">
            <a-tooltip
                placement="left"
                :title="
                    !editPermission && role === 'Guest'
                        ? `You don't have permission to add owners to this asset`
                        : ''
                "
                :mouse-enter-delay="0.5"
            >
                <Shortcut
                    shortcut-key="t"
                    action="set classification"
                    placement="left"
                    :edit-permission="editPermission && showShortcut"
                >
                    <a-button
                        shape="circle"
                        :disabled="role === 'Guest' && !editPermission"
                        size="small"
                        class="text-center shadow"
                        :class="{
                            editPermission:
                                'hover:bg-primary-light hover:border-primary',
                        }"
                        @click="handleOpenPopover"
                    >
                        <span
                            ><AtlanIcon icon="Add" class="h-3"></AtlanIcon
                        ></span> </a-button
                ></Shortcut>
            </a-tooltip>
            <template v-for="classification in list" :key="classification.guid">
                <Popover
                    :classification="classification"
                    :entity-guid="guid"
                    :mouse-enter-delay="mouseEnterDelay"
                    @mouse-entered="enteredPill"
                >
                    <ClassificationPill
                        :name="classification.name"
                        :display-name="classification?.displayName"
                        :is-propagated="isPropagated(classification)"
                        :allow-delete="allowDelete"
                        :color="classification.options?.color"
                        @delete="handleDeleteClassification"
                        :created-by="classification?.createdBy"
                    />
                </Popover>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        Ref,
        ref,
        toRefs,
        watch,
        defineAsyncComponent,
    } from 'vue'
    import {
        and,
        useActiveElement,
        useMagicKeys,
        useVModels,
        whenever,
        PropType,
    } from '@vueuse/core'

    import { message } from 'ant-design-vue'
    import ClassificationFacet from '@/common/facet/classification/index.vue'
    import { mergeArray } from '~/utils/array'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import ClassificationPill from '@/common/pills/classification.vue'
    import Popover from '@/common/popover/classification/index.vue'
    import Shortcut from '@/common/popover/shortcut.vue'
    import { useCreateRequests } from '~/composables/requests/useCreateRequests'
    import { assetInterface } from '~/types/assets/asset.interface'
    import whoami from '~/composables/user/whoami.ts'
    import { useMouseEnterDelay } from '~/composables/classification/useMouseEnterDelay'

    export default defineComponent({
        name: 'ClassificationWidget',
        components: {
            ClassificationFacet,
            ClassificationPill,
            Popover,
            Shortcut,
            AdminList: defineAsyncComponent(
                () => import('@/common/info/adminList.vue')
            ),
        },
        props: {
            guid: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            modelValue: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            showShortcut: {
                type: Boolean,
                required: false,
                default: false,
            },
            disabled: {
                type: Boolean,
                default: false,
                required: false,
            },
            destroyTooltipOnHide: {
                type: Boolean,
                required: false,
                default: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
            allowDelete: {
                type: Boolean,
                required: false,
                default: null,
            },
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            const { guid, editPermission, selectedAsset } = toRefs(props)
            const localValue = ref(modelValue.value)
            const { role } = whoami()
            const selectedValue = ref({
                classifications: modelValue.value.map((i) => i.typeName),
            })
            const existingClassifications = computed(() =>
                modelValue.value.map((i) => i.typeName)
            )
            const requestLoading = ref()
            const newClassifications = ref([])

            const isEdit = ref(false)
            const classificationFacetRef: Ref<null | HTMLInputElement> =
                ref(null)

            const { classificationList } = useTypedefData()

            const isPropagated = (classification) => {
                if (!guid?.value) {
                    return false
                }
                return guid.value !== classification.entityGuid
            }

            const list = computed(() => {
                const { matchingIdsResult } = mergeArray(
                    classificationList.value,
                    localValue.value,
                    'name',
                    'typeName'
                )
                return matchingIdsResult
            })

            const handleChange = () => {
                if (props.editPermission) {
                    modelValue.value = localValue.value
                    emit('change', localValue.value)
                }
            }

            const handleDeleteClassification = (name) => {
                localValue.value = localValue.value.filter(
                    (i) => i.typeName !== name
                )
                selectedValue.value = {
                    classifications: localValue.value.map((i) => i.typeName),
                }
                handleChange()
            }

            const handleSelectedChange = () => {
                localValue.value = []
                selectedValue.value.classifications?.forEach((i) => {
                    if (
                        !localValue.value.find(
                            (l) => l.typeName === i && !l.propagate
                        )
                    ) {
                        localValue.value.push({
                            entityGuid: guid.value,
                            propagate: true,
                            removePropagationsOnEntityDelete: true,
                            typeName: i,
                        })
                    }
                })

                if (!props.editPermission) {
                    newClassifications.value = localValue.value
                    localValue.value = []
                }
            }

            const handleVisibleChange = (visible) => {
                if (isEdit.value) {
                    if (classificationFacetRef.value?.forceFocus) {
                        classificationFacetRef.value?.forceFocus()
                    }
                }
                if (!visible && props.editPermission) {
                    handleChange()
                }
            }
            /* Adding this when parent data change, sync it with local */
            watch(modelValue, () => {
                localValue.value = modelValue.value
                selectedValue.value = {
                    classifications: localValue.value.map((i) => i.typeName),
                }
            })

            const activeElement = useActiveElement()
            const notUsingInput = computed(
                () =>
                    activeElement.value?.tagName !== 'INPUT' &&
                    activeElement.value?.tagName !== 'TEXTAREA' &&
                    activeElement.value?.attributes?.contenteditable?.value !==
                        'true'
            )
            const { t, Escape } = useMagicKeys()
            whenever(and(t, notUsingInput, editPermission.value), () => {
                if (!isEdit.value) {
                    isEdit.value = true
                }
            })

            whenever(and(Escape), () => {
                if (isEdit.value) {
                    handleChange()
                    isEdit.value = false
                }
            })
            const classificationPopoverMouseEnterDelay = ref(1)
            const handleRequest = () => {
                console.log(selectedValue.value)
                console.log(localValue.value)
                console.log(newClassifications.value)
                console.log(existingClassifications.value)
                newClassifications.value = newClassifications.value?.filter(
                    (el) => {
                        if (
                            !existingClassifications.value?.find(
                                (i) => i?.typeName === el?.typeName
                            )
                        ) {
                            return el
                        }
                    }
                )

                console.log(newClassifications.value)
                const {
                    error: requestError,
                    isLoading: isRequestLoading,
                    isReady: requestReady,
                } = useCreateRequests({
                    assetGuid: selectedAsset.value?.guid,
                    assetQf: selectedAsset.value?.attributes?.qualifiedName,
                    assetType: selectedAsset.value?.typeName,
                    classifications: newClassifications.value,
                })
                whenever(requestError, () => {
                    if (requestError.value) {
                        message.error(`Request failed`)
                        isEdit.value = false
                        requestLoading.value = false
                    }
                })
                whenever(requestReady, () => {
                    if (requestReady.value) {
                        message.success(`Request raised`)
                        isEdit.value = false
                        requestLoading.value = false
                    }
                })
                requestLoading.value = isRequestLoading.value
            }

            const handleCancelRequest = () => {
                isEdit.value = false
            }
            const handleOpenPopover = () => {
                isEdit.value = true
                requestLoading.value = false
            }
            const { mouseEnterDelay, enteredPill } = useMouseEnterDelay()

            return {
                localValue,
                isPropagated,
                list,
                selectedValue,
                handleChange,
                handleVisibleChange,
                handleSelectedChange,
                classificationFacetRef,
                isEdit,
                handleDeleteClassification,
                classificationPopoverMouseEnterDelay,
                handleRequest,
                role,
                handleCancelRequest,
                handleOpenPopover,
                requestLoading,
                mouseEnterDelay,
                enteredPill,
            }
        },
    })
</script>
<style lang="less" module>
    .classificationPopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 250px !important;
        }
    }
</style>
