<template>
    <div v-if="isLoading">
        <a-spin size="small" />
    </div>
    <div
        v-else
        class="flex flex-wrap items-center gap-1 text-sm"
        data-test-id="classification-popover"
    >
        <a-popover
            v-if="editPermission"
            v-model:visible="isEdit"
            placement="leftTop"
            :overlay-class-name="$style.classificationPopover"
            :trigger="['click']"
            :destroy-tooltip-on-hide="destroyTooltipOnHide"
            @visibleChange="handleVisibleChange"
        >
            <template #content>
                <div>
                    <ClassificationFacet
                        ref="classificationFacetRef"
                        v-model="selectedValue"
                        :show-none="false"
                        @change="handleSelectedChange"
                    ></ClassificationFacet>
                </div>
            </template>
            <a-button
                shape="circle"
                :disabled="disabled"
                size="small"
                class="text-center shadow hover:bg-primary-light hover:border-primary"
            >
                <span><AtlanIcon icon="Add" class="h-3"></AtlanIcon></span>
            </a-button>
        </a-popover>

        <template v-for="classification in list" :key="classification.guid">
            <Popover :classification="classification">
                <ClassificationPill
                    :name="classification.name"
                    :display-name="classification?.displayName"
                    :is-propagated="isPropagated(classification)"
                    :allow-delete="allowDelete"
                    :color="classification.options?.color"
                    @delete="handleDeleteClassification"
                />
            </Popover>
        </template>
        <span
            v-if="!editPermission && list?.length < 1"
            class="-ml-1 text-gray-500"
            >No linked classifications</span
        >
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, Ref, ref, toRefs, watch } from 'vue'
    import {
        and,
        useActiveElement,
        useMagicKeys,
        useVModels,
        whenever,
    } from '@vueuse/core'
    import ClassificationFacet from '@/common/facet/classification/index.vue'
    import { mergeArray } from '~/utils/array'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import ClassificationPill from '@/common/pills/classification.vue'
    import Popover from '@/common/popover/classification.vue'

    export default defineComponent({
        name: 'ClassificationWidget',
        components: {
            ClassificationFacet,
            ClassificationPill,
            Popover,
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
            isLoading: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            const { guid, editPermission, isLoading } = toRefs(props)
            const localValue = ref(modelValue.value)
            const selectedValue = ref({
                classifications: modelValue.value.map((i) => i.typeName),
            })

            const isEdit = ref(false)
            const classificationFacetRef: Ref<null | HTMLInputElement> =
                ref(null)

            const { classificationList } = useTypedefData()

            const isPropagated = (classification) => {
                if (!guid?.value) {
                    return false
                }
                if (guid.value === classification.entityGuid) {
                    return false
                }
                return true
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
                modelValue.value = localValue.value

                emit('change', localValue.value)
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
            }

            const handleVisibleChange = (visible) => {
                if (isEdit.value) {
                    if (classificationFacetRef.value?.forceFocus) {
                        classificationFacetRef.value?.forceFocus()
                    }
                }
                if (!visible) {
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
