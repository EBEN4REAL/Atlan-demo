<template>
    <div class="w-full" :class="listClass ? listClass : 'h-44'">
        <div
            v-if="list.length < 1"
            class="flex flex-col items-center justify-center h-full"
        >
            <div class="flex flex-col items-center">
                <span class="text-gray-500">No groups found</span>
            </div>
        </div>
        <div
            v-else
            class="flex flex-col w-full overflow-y-auto"
            :class="checkboxListClass ? checkboxListClass : 'h-40'"
        >
            <div class="w-full px-3">
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
                        :class="listItemClass"
                    >
                        <div class="flex items-center">
                            <a-avatar
                                v-if="showAvatar"
                                shape="circle"
                                :size="20"
                                class="mr-2 text-primary bg-primary-light"
                            >
                                <AtlanIcon icon="GroupStatic" class="w-3 h-3" />
                            </a-avatar>
                            <div class="flex flex-col">
                                <div
                                    class="text-sm leading-none capitalize text-gray"
                                >
                                    {{ item.alias || item.name }}
                                </div>
                            </div>
                        </div>
                    </a-checkbox>
                </template>
            </div>
            <div class="flex items-center justify-between px-4">
                <!-- <p class="text-xs text-gray-500">
                    {{ list.length }} of {{ total }} groups
                </p> -->
                <template v-if="list?.length < filterTotal">
                    <div class="flex justify-center ml-auto" v-if="isLoading || isEnriching">
                        <AtlanIcon icon="CircleLoader" class="text-primary animate-spin"></AtlanIcon>
                    </div>
                    <div
                        class="flex items-center ml-auto text-xs cursor-pointer text-primary hover:underline"
                        @click="loadMore"
                        v-else
                    >
                        load more...
                    </div>
                </template>
            </div>
        </div>
        <div>
            <p class="pl-4 text-xs text-gray-500">
                {{ list.length }} of {{ total }} groups
            </p>
        </div>
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

    import { useVModels, onKeyStroke } from '@vueuse/core'
    import useFacetGroups from '~/composables/group/useFacetGroups'
    import AtlanIcon from '../../icon/atlanIcon.vue'

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
            showAvatar: {
                type: Boolean,
                required: false,
            },
            listClass: {
                type: String,
                required: false,
            },
            checkboxListClass: {
                type: String,
                required: false,
            },
            listItemClass: {
                type: String,
                required: false,
            },
            userId: {
                type: String,
                required: false,
                default: '',
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue, disabledKeys } = useVModels(props, emit)
            const { selectGroupKey, userId } = toRefs(props)
            const localValue = ref(modelValue.value)
            // const map = ref({})
            // const updateMap = (localValue: Ref<any>) => {
            //     map.value = {}
            //     localValue.value.map((id) => {
            //         map.value[id] = true
            //     })
            //     console.log(map)
            // }
            // updateMap(localValue)
            const map = computed(() => {
                let data = {}
                modelValue?.value?.forEach((key) => {
                    data[key] = true
                })
                return data
            })
            const {
                list,
                handleSearch,
                total,
                filterTotal,
                isLoading,
                loadMore,
                isEnriching,
            } = useFacetGroups('name', [], true, userId)
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
                list.value.forEach((group) => {
                    if (group.hasUserAsMember) {
                        data[group[selectGroupKey.value]] = true
                    }
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

            onKeyStroke(['Enter'], (e) => {
                const { key } = e
                e.preventDefault()

                if (key === 'Enter') {
                    if (list.value.length === 1) {
                        // console.log('enter pressed')

                        let id = list.value[0][selectGroupKey.value]
                        if (!disabledKeyMap.value[id]) {
                            if (map.value[id]) {
                                delete map.value[id]
                            } else {
                                map.value[id] = true
                            }
                            modelValue.value = [...Object.keys(map.value)]
                        }
                    }
                }
            })

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
                isEnriching,
            }
        },
        components: { AtlanIcon },
    })
</script>
