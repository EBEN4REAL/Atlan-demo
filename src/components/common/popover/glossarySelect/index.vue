<template>
    <div class="tedt">
        <a-popover
            overlayClassName="glossarySelectPopover"
            :get-popup-container="(target) => target.parentNode"
            placement="bottomLeft"
            v-model:visible="isVisible"
            trigger="['click']"
        >
            <template #content>
                <div class="px-3 py-1 border-b">
                    <div
                        class="flex items-center p-1 cursor-pointer  hover:bg-primary-light grou"
                        @click="handleSelect('')"
                    >
                        <AtlanIcon
                            icon="Glossary"
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
                            class="flex items-center p-1 cursor-pointer  hover:bg-primary-light grou"
                            v-for="item in filteredList"
                            :key="item.guid"
                            @click="
                                handleSelect(item.attributes?.qualifiedName)
                            "
                        >
                            <AtlanIcon
                                icon="Glossary"
                                class="self-center pr-1"
                            ></AtlanIcon>
                            <div
                                class=" overflow-ellipsis group-hover:text-primary"
                            >
                                {{
                                    item?.attributes.displayName ||
                                    item.attributes.name
                                }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <div class="flex items-center cursor-pointer hover:text-primary">
                <AtlanIcon
                    icon="Glossary"
                    class="self-center h-4 mr-1"
                ></AtlanIcon>
                <p class="text-sm truncate">{{ displayText }}</p>
                <AtlanIcon
                    icon="ChevronDown"
                    class="self-center h-3 ml-1 text-primary"
                ></AtlanIcon>
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

    import SearchAdvanced from '@/common/input/searchAdvanced.vue'

    export default defineComponent({
        components: {
            SearchAdvanced,
        },
        props: {
            modelValue: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const localValue = ref(props.modelValue)

            const { glossaryList } = useGlossaryData()
            const queryText = ref('')
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

            const filteredList = computed(() =>
                glossaryList.value
                    .filter((i) => {
                        if (queryText?.value !== '') {
                            return (
                                i.attributes?.name
                                    ?.toLowerCase()
                                    .includes(queryText.value.toLowerCase()) ||
                                i.attributes?.displayName
                                    ?.toLowerCase()
                                    .includes(queryText.value.toLowerCase())
                            )
                        }
                        return true
                    })
                    .sort((a, b) =>
                        // eslint-disable-next-line no-nested-ternary
                        a.termsCount < b.termsCount
                            ? 1
                            : b.termsCount < a.termsCount
                            ? -1
                            : 0
                    )
            )

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
                queryText,
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
