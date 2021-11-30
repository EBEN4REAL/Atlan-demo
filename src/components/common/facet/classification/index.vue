<template>
    <div class="w-full" data-test-id="classifications-facet">
        <div class="flex items-center justify-between px-4">
            <SearchAdvanced
                ref="classificationSearchRef"
                v-model="queryText"
                placeholder="Search classifications"
                class="-mt-1.5"
                :allowClear="true"
            >
            </SearchAdvanced>
        </div>

        <div class="w-full mt-1 overflow-y-auto" :style="{ height: height }">
            <div
                v-if="filteredList.length == 0"
                class="flex flex-col items-center justify-center h-full"
            >
                <div class="flex flex-col items-center">
                    <span class="text-gray-500">No classifications found</span>
                </div>
            </div>
            <a-checkbox-group
                v-model:value="localValue.classifications"
                class="w-full px-3"
            >
                <div class="flex flex-col w-full">
                    <template v-for="item in filteredList" :key="item.id">
                        <div class="status">
                            <a-checkbox
                                :value="item.name"
                                :data-test-id="item.displayName"
                                :class="$style.atlanReverse"
                                class="inline-flex flex-row-reverse items-center w-full px-1 py-1 rounded  hover:bg-primary-light"
                            >
                                <div class="flex items-center">
                                    <AtlanIcon
                                        icon="Shield"
                                        :style="`color: ${getClassificationColorHex(item.options?.color)}`"
                                    ></AtlanIcon>
                                    <span class="mb-0 ml-1 text-gray">
                                        {{ item.displayName }}
                                    </span>
                                </div>
                            </a-checkbox>
                        </div>
                    </template>
                </div>
            </a-checkbox-group>
        </div>
        <div class="px-4 pt-1" v-if="showNone">
            <a-checkbox
                v-model:checked="localValue.empty"
                class="inline-flex flex-row-reverse items-center w-full  atlan-reverse"
            >
                <component
                    :is="noStatus"
                    class="inline-flex self-center w-auto h-4 mb-0.5"
                />
                <span class="mb-0 ml-1 text-gray-500">No Classification</span>
            </a-checkbox>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        Ref,
        ref,
        toRef,
        toRefs,
        watch,
    } from 'vue'

    import noStatus from '~/assets/images/status/nostatus.svg'
    import { useTimeoutFn, useVModels } from '@vueuse/core'
    import useTypedefData from '~/composables/typedefs/useTypedefData'

    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import getClassificationColorHex from '@/governance/classifications/utils/getClassificationColor';

    export default defineComponent({
        components: {
            SearchAdvanced,
        },
        props: {
            modelValue: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            showNone: {
                type: Boolean,
                default() {
                    return true
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const queryText = ref('')
            const { showNone } = toRefs(props)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const { classificationList } = useTypedefData()

            const filteredList = computed(() =>
                classificationList.value.filter((i) =>
                    i.displayName
                        .toLowerCase()
                        .includes(queryText.value.toLowerCase())
                )
            )

            const height = computed(() => {
                if (filteredList.value.length === 0) {
                    return `100px`
                }
                if (filteredList.value.length < 5) {
                    return `${filteredList.value.length * 40}px`
                }
                return '150px'
            })

            watch(
                () => localValue.value.classifications,
                (prev, cur) => {
                    if (!localValue.value.classifications) {
                        delete localValue.value.classifications
                    }
                    if (!localValue.value.empty) {
                        delete localValue.value.empty
                    }
                    if (localValue.value.classifications?.length === 0) {
                        delete localValue.value.classifications
                    }
                    modelValue.value = localValue.value
                    emit('change')
                }
            )

            const classificationSearchRef: Ref<null | HTMLInputElement> =
                ref(null)
            const { start } = useTimeoutFn(() => {
                if (classificationSearchRef.value?.forceFocus) {
                    classificationSearchRef.value?.forceFocus()
                }
            }, 100)

            const forceFocus = () => {
                start()
            }
            /* Adding this when parent data change, sync it with local */
            watch(modelValue, () => {
                localValue.value = modelValue.value
            })

            return {
                filteredList,
                localValue,
                noStatus,

                forceFocus,
                queryText,
                showNone,
                height,
                getClassificationColorHex
            }
        },
    })
</script>

<style lang="less" module>
    .atlanReverse {
        > span:nth-child(2) {
            @apply w-full pl-0;
        }

        :global(.ant-checkbox) {
            top: 0px !important;
        }
    }
</style>
