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
        <template v-for="item in sortedList" :key="item.id">
            <a-select-option :value="item.name">
                <div class="flex items-center truncate">
                    <ClassificationIcon :color="item.options?.color" />
                    <span class="ml-1">
                        {{ item.displayName }}
                    </span>
                </div>
                <div
                    class="flex items-center truncate"
                    v-if="
                        countQueries &&
                        countFolders &&
                        Object.keys(countQueries) &&
                        Object.keys(countFolders)
                    "
                >
                    <span class="ml-5 text-xs">
                        Query:
                        {{
                            item.name in countQueries
                                ? countQueries[item.name]
                                : 0
                        }}
                        <!-- Folder:
                        {{
                            item.name in countFolders
                                ? countFolders[item.name]
                                : 0
                        }} -->
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
    import { computed, defineComponent, ref, onMounted } from 'vue'
    import AssetSelector from '~/components/common/dropdown/assetSelector.vue'
    // import bodybuilder from 'bodybuilder'

    import noStatus from '~/assets/images/status/nostatus.svg'
    import { useTimeoutFn, useVModels } from '@vueuse/core'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import ClassificationIcon from '@/governance/classifications/classificationIcon.vue'

    import useLoadClassification from '../../common/classification/composables/useLoadClassification'

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
            connector: {
                type: String,
                required: true,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            // let { countQueries, countFolders } = toRefs(props)
            const { modelValue, connector } = useVModels(props, emit)
            const { classificationList } = useTypedefData()

            let countQueries = ref({})
            let countFolders = ref({})

            const { getAssetCountOnClassification } = useLoadClassification({
                connector,
            })

            onMounted(async () => {
                let queryCount = await getAssetCountOnClassification('Query')
                let folderCount = await getAssetCountOnClassification(
                    'QueryFolder'
                )

                let query = {}
                let folder = {}
                if (queryCount.aggregations) {
                    let direct =
                        queryCount.aggregations?.group_by_direct_classifications
                            ?.buckets
                    let propogated =
                        queryCount.aggregations
                            ?.group_by_propagated_classifications?.buckets

                    direct.forEach((el) => {
                        query = {
                            ...query,
                            [el.key]: el.doc_count,
                        }
                    })
                    // console.log('aggregated: ', query)

                    propogated.forEach((el) => {
                        if (el.key in query) {
                            query[el.key] += el.doc_count
                        } else {
                            query = {
                                ...query,
                                [el.key]: el.doc_count,
                            }
                        }
                    })
                    countQueries.value = query
                }

                if (folderCount.aggregations) {
                    let direct =
                        folderCount.aggregations
                            ?.group_by_direct_classifications?.buckets
                    let propogated =
                        folderCount.aggregations
                            ?.group_by_propagated_classifications?.buckets

                    direct.forEach((el) => {
                        folder = {
                            ...folder,
                            [el.key]: el.doc_count,
                        }
                    })
                    // console.log('aggregated: ', folder)

                    propogated.forEach((el) => {
                        if (el.key in folder) {
                            folder[el.key] += el.doc_count
                        } else {
                            folder = {
                                ...folder,
                                [el.key]: el.doc_count,
                            }
                        }
                    })
                    countFolders.value = folder
                }

                // console.log('count folders: ', countFolders.value)

                // classificationList.value.forEach((el) => {
                //     if (el.name in countFolders.value) {
                //     } else {
                //         countFolders.value = {
                //             ...countFolders.value,
                //             [el.name]: 0,
                //         }
                //     }

                //     if (el.name in countQueries.value) {
                //     } else {
                //         countQueries.value = {
                //             ...countQueries.value,
                //             [el.name]: 0,
                //         }
                //     }
                // })
                // console.log('aggregated: ', { folder, query })
            })

            const sortedList = computed(() => {
                return classificationList.value.sort((a, b) => {
                    if (countQueries.value[a.name] > countQueries.value[b.name])
                        return -1
                    else return 1
                })
            })

            // const sortedList = computed(() => {
            //     return classificationList.value.sort((a, b) => {
            //         if (countQueries.value[a.name] > countQueries.value[b.name])
            //             return -1
            //         else return 1
            //     })
            // })
            const localValue = ref(sortedList.value[0])

            const handleChange = (value) => {
                localValue.value = value
                let selection = sortedList.value.find(
                    (item) => item.name === value
                )
                localValue.value = selection
                emit('change', selection)
            }

            // let selected = ref('')

            return {
                localValue,
                noStatus,
                handleChange,
                countQueries,
                countFolders,
                sortedList,
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
