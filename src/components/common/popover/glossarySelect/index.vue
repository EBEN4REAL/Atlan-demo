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
                                    icon="Glossary"
                                    class="self-center"
                                ></AtlanIcon>
                            </div>
                            <Tooltip
                                :tooltip-text="`${
                                    item?.attributes.displayName ||
                                    item.attributes.name
                                }`"
                                :classes="'w-full '"
                            />
                        </div>
                    </div>
                </div>
            </template>
            <div
                class="flex items-center cursor-pointer hover:text-primary"
                style="max-width: 80%"
            >
                <div class="w-4 mr-2">
                    <AtlanIcon
                        :icon="
                            displayText === 'All Glossaries'
                                ? 'GlossaryGray'
                                : 'Glossary'
                        "
                        class="self-center h-5"
                    ></AtlanIcon>
                </div>
                <Tooltip
                    :tooltip-text="`${displayText}`"
                    :classes="' font-bold  hover:text-primary text-base '"
                />

                <div class="w-4 mr-1">
                    <AtlanIcon
                        icon="ChevronDown"
                        class="h-3 ml-2 text-primary"
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
    import useGlossaryData from '~/composables/glossary/useGlossaryData'
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
            showAllGlossary:{
                type:Boolean,
                required:false,
                default:true
            }
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const localValue = ref(props.modelValue)

            const { glossaryList } = useGlossaryData()
            const displayText = ref('')
            const isVisible = ref(false)

            const changeDisplayText = () => {
                const item = filteredList.value.find(
                    (i) => i.attributes.qualifiedName === localValue.value
                )
                console.log('change', item)
                if (!item) {
                    displayText.value = 'All Glossaries'
                } else {
                    displayText.value =
                        item?.attributes.name || 'All Glossaries'
                }
            }

            onMounted(() => {
                changeDisplayText()
            })

            const filteredList = computed(() => {
                const sortedList = glossaryList.value
                return sortedList.sort((a, b) =>
                    a?.displayText > b?.displayText ? 1 : -1
                )
            })

            const handleSelect = (key) => {
                localValue.value = key
                changeDisplayText()
                isVisible.value = false
                emit('update:modelValue', localValue.value)
                emit('change', localValue.value)
            }

            watch(
                () => props.modelValue,
                () => {
                    localValue.value = props.modelValue
                    changeDisplayText()
                }
            )

            return {
                filteredList,
                handleSelect,
                displayText,
                glossaryList,
                isVisible,
                changeDisplayText,
            }
        },
    })
</script>

<style lang="less">
    .glossarySelectPopover {
        .ant-popover-inner-content {
            width: 250px !important;
        }
    }
</style>
