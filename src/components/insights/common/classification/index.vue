<template>
    <a-select
        placeholder="Select classification"
        :value="localValue.name"
        notFoundContent="No classifications found"
        @change="handleChange"
        style="width: 100%; border-radius: 8px"
        :class="$style.classification"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    >
        <template v-for="item in filteredList" :key="item.id">
            <a-select-option :value="item.name">
                <div class="flex items-center truncate">
                    <ClassificationIcon :color="item.options?.color" />
                    <span class="ml-1">
                        {{ item.displayName }}
                    </span>
                </div>
            </a-select-option>
        </template>

        <template #suffixIcon>
            <AtlanIcon
                icon="ChevronDown"
                class="h-4 -mt-0.5 -ml-1"
                color="#6F7590"
            />
        </template>
    </a-select>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        ref,
        ComputedRef,
        Ref,
        toRefs,
        PropType,
        watch,
    } from 'vue'
    import AssetSelector from '~/components/common/dropdown/assetSelector.vue'
    // import bodybuilder from 'bodybuilder'

    import noStatus from '~/assets/images/status/nostatus.svg'
    import { useTimeoutFn, useVModels } from '@vueuse/core'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import ClassificationIcon from '@/governance/classifications/classificationIcon.vue'

    export default defineComponent({
        name: 'ClassificationDropdown',
        components: { AssetSelector, ClassificationIcon },
        props: {
            modelValue: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            bgGrayForSelector: {
                type: Boolean,
                default: true,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const { classificationList } = useTypedefData()

            // for search if needed
            const queryText = ref('')
            const filteredList = computed(() =>
                classificationList.value.filter((i) =>
                    i.displayName
                        .toLowerCase()
                        .includes(queryText.value.toLowerCase())
                )
            )

            // watch(modelValue, () => {
            //     localValue.value = modelValue.value
            // })

            // let selected = ref(filteredList.value[0])

            const handleChange = (value) => {
                // modelValue.value = localValue.value
                localValue.value = value
                // emit('change')
                let selection = filteredList.value.find(
                    (item) => item.name === value
                )
                // selected.value = value

                // console.log('classification: ', { filteredList, selection })
                emit('change', selection)
            }

            // let selected = ref('')

            return {
                filteredList,
                localValue,
                noStatus,

                queryText,
                // showNone,
                // height,
                handleChange,
                // selected,
            }
        },
    })
</script>

<style lang="less" module>
    .classification {
        :global(.ant-select-selector) {
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05) !important;
            background-color: #fbfbfb !important;
            border: 1px solid #e9ebf1 !important;
            color: #6f7590 !important;
            border-radius: 8px !important;

            input::placeholder {
                color: #6f7590 !important;
            }
        }
        :global(.ant-select-selection-search) {
            input::placeholder {
                color: #6f7590 !important;
            }
        }
    }
</style>
