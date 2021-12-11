<template>
    <div class="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <a-popover
            placement="leftBottom"
            :overlay-class-name="$style.categoryPopover"
            :trigger="['click']"
            @visibleChange="onPopoverClose"
        >
            <template #content>
                <GlossaryTree
                    v-model:checkedKeys="checkedKeys"
                    :checkable="true"
                    @check="onCheck"
                />
            </template>
            <a-button
                v-if="!readOnly"
                shape="circle"
                :disabled="disabled"
                size="small"
                class="text-center shadow hover:bg-primary-light hover:border-primary"
            >
                <span><AtlanIcon icon="Add" class="h-3"></AtlanIcon></span
            ></a-button>
        </a-popover>
        <div class="flex flex-wrap gap-1 text-sm">
            <template v-for="term in list" :key="term.guid">
                <div
                    class="flex items-center py-0.5 pl-1 pr-2 text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-purple hover:border-purple group hover:shadow hover:text-white"
                >
                    <AtlanIcon
                        :icon="icon(term)"
                        class="group-hover:text-white text-purple mb-0.5"
                    ></AtlanIcon>

                    <div class="ml-1 group-hover:text-white">
                        {{ term.attributes?.name ?? term.displayText }}
                    </div>
                </div>
            </template>
            <span
                v-if="readOnly && list?.length < 1"
                class="-ml-1 text-gray-500"
                >No linked terms</span
            >
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { assetInterface } from '~/types/assets/asset.interface'

    import GlossaryTree from '~/components/glossary/index.vue'

    export default defineComponent({
        name: 'TermsWidget',
        components: { GlossaryTree },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            readOnly: {
                type: Boolean,
                required: false,
                default: false,
            },
            disabled: {
                type: Boolean,
                default: false,
                required: false,
            },
            modelValue: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { selectedAsset } = toRefs(props)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const checkedKeys = ref(
                modelValue.value.map((category) => category.guid)
            )

            const hasBeenEdited = ref(false)
            const list = computed(() => localValue.value)
                    //             {
                    //     "guid": "a70c8fd9-9456-49ea-923d-efbf20a6b401",
                    //     "typeName": "AtlasGlossaryCategory",
                    //     "attributes": {
                    //         "name": "cat1"
                    //     },
                    //     "uniqueAttributes": {
                    //         "qualifiedName": "xtRwr0OOOCeWaz37uXLc2@QhWrP2am5t3J4bbK5rdwh"
                    //     }
                    // },
            // Categories in modelValue and localValue
            // ref selectedKeys guids from modelValue
            // on change update modelValue,
            // computed list variable

            // composable
            // take parent guid
            // on mount or parent guid change fetch all categories and return data
            

            const onPopoverClose = (visible) => {
                if (!visible && hasBeenEdited.value) {
                    modelValue.value = localValue.value
                    emit('change', localValue.value)
                    hasBeenEdited.value = false
                }
            }

            const icon = (term) => {
                if (
                    term?.attributes?.certificateStatus?.toLowerCase() ===
                    'verified'
                ) {
                    return 'TermVerified'
                }
                if (
                    term?.attributes?.certificateStatus?.toLowerCase() ===
                    'draft'
                ) {
                    return 'TermDraft'
                }
                if (
                    term?.attributes?.certificateStatus?.toLowerCase() ===
                    'deprecated'
                ) {
                    return 'TermDeprecated'
                }
                return 'Term'
            }

            const onCheck = (checkedNodes) => {
                localValue.value = []
                checkedNodes.forEach((term) => {
                    localValue.value.push(term)
                })
                hasBeenEdited.value = true
            }

            /* Adding this when parent data change, sync it with local */
            watch(modelValue, () => {
                localValue.value = modelValue.value
                checkedKeys.value = modelValue.value.map(
                    (term) => term.termGuid ?? term.guid
                )
            })

            return {
                list,
                icon,
                onCheck,
                onPopoverClose,
                localValue,
                checkedKeys,
            }
        },
    })
</script>
<style lang="less" module>
    .categoryPopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 350px !important;
        }
    }
</style>
