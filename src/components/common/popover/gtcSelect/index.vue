<template>
    <div class="tedt">
        <a-popover
            overlayClassName="gtcSelectPopover"
            :get-popup-container="(target) => target.parentNode"
            v-model:visible="isVisible"
            placement="bottomLeft"
            trigger="['click']"
        >
            <template #content>
                <div class="px-2 py-1">
                    <div
                        class="flex items-center p-1 cursor-pointer hover:bg-primary-light grou"
                        @click="handleSelect('AtlasGlossaryTerm')"
                    >
                        <AtlanIcon
                            icon="Term"
                            class="self-center pr-1"
                        ></AtlanIcon>
                        <div class="overflow-ellipsis group-hover:text-primary">
                            Term
                        </div>
                    </div>
                </div>
                <div class="px-2 py-1">
                    <div
                        class="flex items-center p-1 cursor-pointer hover:bg-primary-light grou"
                        @click="handleSelect('AtlasGlossaryCategory')"
                    >
                        <AtlanIcon
                            icon="Category"
                            class="self-center pr-1"
                        ></AtlanIcon>
                        <div class="overflow-ellipsis group-hover:text-primary">
                            Category
                        </div>
                    </div>
                </div>
            </template>
            <div class="flex items-center cursor-pointer hover:text-primary">
                <AtlanIcon
                    :icon="displayText"
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
        toRefs,
        watch,
    } from 'vue'
    import useGlossaryData from '~/composables/glossary/useGlossaryData'

    export default defineComponent({
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
            const { modelValue } = toRefs(props)

            const localValue = ref(modelValue.value)

            const { glossaryList } = useGlossaryData()
            const queryText = ref('')
            const displayText = ref('')
            const isVisible = ref(false)

            const changeDisplayText = () => {
                switch (localValue.value) {
                    case 'AtlasGlossaryTerm':
                        displayText.value = 'Term'
                        break
                    case 'AtlasGlossaryCategory':
                        displayText.value = 'Category'
                        break
                    case 'AtlasGlossary':
                        displayText.value = 'Glossary'
                        break
                    default:
                        displayText.value = ''
                }
            }

            onMounted(() => {
                changeDisplayText()
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
                queryText,
                handleSelect,
                displayText,
                glossaryList,
                isVisible,
                changeDisplayText,
                localValue,
            }
        },
    })
</script>

<style lang="less">
    .gtcSelectPopover {
        .ant-popover-inner-content {
            width: 120px !important;
        }
    }
</style>
