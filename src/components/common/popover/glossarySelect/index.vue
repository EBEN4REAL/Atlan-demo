<template>
    <div class="w-full">
        <a-popover
            overlayClassName="glossarySelectPopover"
            :get-popup-container="(target) => target.parentNode"
            placement="bottomLeft"
            v-model:visible="isVisible"
            trigger="['click']"
        >
            <template #content>
                <div v-if="showAllGlossary" class="px-3 py-1 border-b">
                    <div
                        class="flex items-center py-1 cursor-pointer hover:bg-primary-light grou"
                        @click="handleSelect('')"
                    >
                        <AtlanIcon
                            icon="GlossaryGray"
                            class="self-center pr-1"
                        ></AtlanIcon>
                        <div class="overflow-ellipsis group-hover:text-primary">
                            All Glossaries
                        </div>
                    </div>
                </div>
                <div class="flex flex-col w-full">
                    <div
                        style="height: 200px; overflow-y: auto"
                        class="px-2 py-2"
                    >
                        <div
                            class="flex items-center p-1 cursor-pointer hover:bg-primary-light grou"
                            v-for="item in filteredList"
                            :key="item.guid"
                            @click="
                                handleSelect(item.attributes?.qualifiedName)
                            "
                        >
                            <div class="w-4 mr-1">
                                <AtlanIcon
                                    :icon="
                                        getEntityStatusIcon(
                                            item.typeName,
                                            certificateStatus(item)
                                        )
                                    "
                                    class="self-center align-text-bottom"
                                />
                            </div>
                            <Tooltip
                                :tooltip-text="`${
                                    item?.attributes.displayName ||
                                    item.attributes.name
                                }`"
                                :classes="'w-full '"
                                placement="right"
                                :mouseLeaveDelay="0"
                            />
                        </div>
                    </div>
                </div>
            </template>
            <div
                class="flex items-center cursor-pointer hover:text-primary"
                style="max-width: 80%"
            >
                <div class="w-4" :class="size === 'default' ? 'mr-2' : 'mr-1'">
                    <AtlanIcon
                        :icon="
                            selectedGlossary?.guid?.length
                                ? getEntityStatusIcon(
                                      'AtlasGlossary',
                                      certificateStatus(selectedGlossary)
                                  )
                                : 'GlossaryGray'
                        "
                        class="self-center"
                        :class="size === 'default' ? 'h-5' : 'h-4'"
                    ></AtlanIcon>
                </div>
                <Tooltip
                    ref="tooltipRef"
                    :tooltip-text="`${
                        selectedGlossary?.guid?.length
                            ? selectedGlossary?.attributes?.name ??
                              selectedGlossary?.displayText
                            : 'All Glossaries'
                    }`"
                    :mouseLeaveDelay="0"
                    :classes="`  hover:text-primary  align-text-bottom  ${
                        size === 'default'
                            ? 'text-base font-bold  mt-0.5'
                            : 'text-sm'
                    } ${tooltipRef?.truncated ? 'w-full' : ''}`"
                />

                <div
                    class="w-4 mr-1"
                    :classes="{ 'mt-0.5': size === 'default' }"
                >
                    <AtlanIcon
                        icon="ChevronDown"
                        class="h-3 ml-2 hover:text-primary"
                    ></AtlanIcon>
                </div>
            </div>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import {
        computed,
        defineComponent,
        PropType,
        ref,
        onMounted,
        watch,
    } from 'vue'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import Tooltip from '@/common/ellipsis/index.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'

    export default defineComponent({
        components: {
            SearchAdvanced,
            Tooltip,
        },
        props: {
            modelValue: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            showAllGlossary: {
                type: Boolean,
                required: false,
                default: true,
            },
            size: {
                type: String,
                required: false,
                default: () => 'default',
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const localValue = ref(props.modelValue)

            const { glossaryList, getEntityStatusIcon } = useGlossaryData()
            const displayText = ref('')
            const isVisible = ref(false)
            const sortedList = ref(glossaryList.value)
            const { certificateStatus } = useAssetInfo()
            const selectedGlossary = computed(() =>
                filteredList.value.find(
                    (i) => i.attributes.qualifiedName === localValue.value
                )
            )
            const filteredList = computed(() => {
                return sortedList.value.sort((a, b) => {
                    if (
                        a?.displayText?.toLowerCase() <
                        b?.displayText?.toLowerCase()
                    )
                        return -1
                    if (
                        a?.displayText?.toLowerCase() >
                        b?.displayText?.toLowerCase()
                    )
                        return 1
                    return 0
                })
            })

            const handleSelect = (key) => {
                localValue.value = key
                isVisible.value = false
                emit('update:modelValue', localValue.value)
                emit('change', localValue.value)
            }

            watch(
                () => props.modelValue,
                () => {
                    localValue.value = props.modelValue
                }
            )

            const tooltipRef = ref(null)
            return {
                filteredList,
                handleSelect,
                displayText,
                glossaryList,
                isVisible,
                getEntityStatusIcon,
                certificateStatus,
                selectedGlossary,
                tooltipRef,
            }
        },
    })
</script>

<style lang="less">
    .glossarySelectPopover {
        .ant-popover-inner-content {
            width: 300px !important;
        }
    }
</style>
