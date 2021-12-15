<template>
    <div class="w-full h-44">
        <div
            v-if="list.length < 1"
            class="flex flex-col items-center justify-center h-full"
        >
            <div class="flex flex-col items-center">
                <span class="text-gray-500">No groups found</span>
            </div>
        </div>
        <div class="flex flex-col w-full h-40 overflow-y-auto">
            <div class="w-full px-4">
                <template v-for="item in list" :key="item[selectGroupKey]">
                    <a-checkbox
                        :checked="
                            map[item[selectGroupKey]] ||
                            disabledKeyMap[item[selectGroupKey]]
                        "
                        :disabled="
                            disabledKeyMap[item[selectGroupKey]] &&
                            disabledKeyMap[item[selectGroupKey]] === true
                        "
                        @change="
                            (checked) =>
                                handleChange(checked, item[selectGroupKey])
                        "
                        class="inline-flex flex-row-reverse items-center w-full px-1 py-1 rounded atlanReverse hover:bg-primary-light"
                    >
                        <div class="flex items-center">
                            <div class="flex flex-col">
                                <div
                                    class="mb-1 text-sm leading-none capitalize text-gray"
                                >
                                    {{ item.alias || item.name }}
                                </div>
                            </div>
                        </div>
                    </a-checkbox>
                </template>
                <template v-if="list?.length < filterTotal">
                    <div class="flex justify-center">
                        <AtlanIcon
                            icon="Loader"
                            v-if="isLoading"
                            class="animate-spin"
                        />
                    </div>
                    <div
                        class="flex justify-end cursor-pointer text-primary hover:underline"
                        @click="loadMore"
                    >
                        load more
                    </div>
                </template>
            </div>
        </div>
        <p class="px-4 mt-1 text-xs text-gray-500">
            showing {{ list.length }} of {{ total }} groups
        </p>
    </div>
</template>

<script lang="ts">
    import {
        Ref,
        defineComponent,
        PropType,
        ref,
        computed,
        toRefs,
        watch,
    } from 'vue'

    import { useVModels } from '@vueuse/core'
    import useFacetGroups from '~/composables/group/useFacetGroups'

    export default defineComponent({
        name: 'OwnersFilter',

        props: {
            queryText: {
                type: String,
                required: false,
                default: () => '',
            },
            modelValue: {
                type: Array,
                required: false,
                default: () => [],
            },
            selectGroupKey: {
                type: String,
                required: false,
                default: () => 'username', // can be id/username
            },
            cacheKey: {
                type: String,
                required: false,
                default: () => 'DEFAULT_USERS',
            },
            disabledKeys: {
                type: Array,
                required: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue, disabledKeys } = useVModels(props, emit)
            const { selectGroupKey } = toRefs(props)
            const localValue = ref(modelValue.value)
            const map = ref({})

            const updateMap = (localValue: Ref<any>) => {
                map.value = {}
                localValue.value.map((id) => {
                    map.value[id] = true
                })
                console.log(map)
            }
            updateMap(localValue)
            const {
                list,
                handleSearch,
                total,
                filterTotal,
                isLoading,
                loadMore,
            } = useFacetGroups()

            watch(
                () => props.queryText,
                () => {
                    handleSearch(props.queryText)
                }
            )

            const disabledKeyMap = computed(() => {
                let data = {}
                disabledKeys?.value?.forEach((key) => {
                    data[key] = true
                })
                // console.log('disabled keys grp: ', data)
                return data
            })

            const handleChange = (checked, id) => {
                if (checked.target.checked) {
                    map.value[id] = true
                } else {
                    delete map.value[id]
                }
                modelValue.value = [...Object.keys(map.value)]
                emit('change')
            }

            return {
                map,
                list,
                handleChange,
                localValue,
                total,
                filterTotal,
                isLoading,
                loadMore,
                disabledKeyMap,
            }
        },
    })
</script>
