<template>
    <div class="flex flex-wrap items-center gap-1 text-sm">
        <a-popover
            placement="leftBottom"
            overlayClassName="classificationPopover"
            @visibleChange="handleVisibleChange"
            :trigger="['click']"
            v-model:visible="isEdit"
        >
            <template #content>
                <ClassificationFacet
                    v-model="selectedValue"
                    ref="classificationFacetRef"
                    @change="handleSelectedChange"
                    :showNone="false"
                ></ClassificationFacet>
            </template>
            <a-button
                shape="circle"
                :disabled="disabled"
                size="small"
                class="text-center shadow  hover:bg-primary-light hover:border-primary"
            >
                <span><AtlanIcon icon="Add" class="h-3"></AtlanIcon></span
            ></a-button>
        </a-popover>

        <template v-for="classification in list" :key="classification.guid">
            <ClassificationPill
                :name="classification.name"
                :displayName="classification?.displayName"
                :isPropagated="isPropagated(classification)"
                :allowDelete="true"
                @delete="handleDeleteClassification"
            ></ClassificationPill>
        </template>
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

    export default defineComponent({
        components: {
            ClassificationFacet,
            ClassificationPill,
        },
        props: {
            guid: {
                type: String,
                required: false,
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
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            const { guid, disabled } = toRefs(props)
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

                emit('change')
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
                            propagate: false,
                            removePropagationsOnEntityDelete: false,
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
            })

            const activeElement = useActiveElement()
            const notUsingInput = computed(
                () =>
                    activeElement.value?.tagName !== 'INPUT' &&
                    activeElement.value?.tagName !== 'TEXTAREA'
            )
            const { t, Escape } = useMagicKeys()
            whenever(and(t, notUsingInput), () => {
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
                disabled,
                localValue,
                isPropagated,
                list,
                selectedValue,
                handleChange,
                handleVisibleChange,
                guid,
                handleSelectedChange,
                classificationFacetRef,
                isEdit,
                handleDeleteClassification,
            }
        },
    })
</script>
<style lang="less">
    .classificationPopover {
        .ant-popover-inner-content {
            @apply px-0 py-3;
            width: 250px !important;
        }
    }
</style>
