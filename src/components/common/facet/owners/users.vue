<template>
    <div class="w-full h-44">
        <div
            v-if="userList.length < 1"
            class="flex flex-col items-center justify-center h-full"
        >
            <div class="flex flex-col items-center">
                <span class="text-gray-500">No users found</span>
            </div>
        </div>
        <div class="flex flex-col w-full h-40 overflow-y-auto">
            <div class="w-full px-3">
                <div v-if="isEnriching" class="flex justify-center">
                    <a-spin size="small"></a-spin>
                </div>
                <div v-else>
                    <template v-for="item in userList" :key="item[selectUserKey]">
                    <a-checkbox
                        :checked="
                            map[item[selectUserKey]] ||
                            disabledKeyMap[item[selectUserKey]]
                        "
                        :disabled="
                            disabledKeyMap[item[selectUserKey]] &&
                            disabledKeyMap[item[selectUserKey]] === true
                        "
                        class="inline-flex flex-row-reverse items-center w-full px-1 py-1 rounded atlanReverse hover:bg-primary-light"
                        @change="
                            (checked) =>
                                handleChange(checked, item[selectUserKey])
                        "
                    >
                        <div class="text-sm leading-none capitalize text-gray">
                            {{ fullName(item) }}
                            <span
                                v-if="item.username === username"
                                class="text-sm text-gray-500"
                            >
                                (me)
                            </span>
                        </div>
                    </a-checkbox>
                </template>
                </div>
            </div>
            <div
                v-if="userList.length > 0"
                class="flex items-center justify-between px-4"
            >
                <p class="mt-1 text-xs text-gray-500">
                    {{ userList.length }} of {{ filterTotal }} users
                </p>
                <template v-if="userList?.length < filterTotal">
                    <div class="flex justify-center" v-if="isLoading">
                        <a-spin size="small"></a-spin>
                    </div>
                    <div
                        class="flex items-center text-xs justify-center py-0.5 cursor-pointer text-primary hover:underline"
                        @click="loadMore"
                        v-else
                    >
                        load more...
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch, computed, ref, toRefs, Ref } from 'vue'
    import { useVModels } from '@vueuse/core'
    import useFacetUsers from '~/composables/user/useFacetUsers'

    export default defineComponent({
        name: 'UsersFilter',
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
            selectUserKey: {
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
            groupId: {
                type: String,
                required: false,
                default: ""
            }
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue, disabledKeys } = useVModels(props, emit)
            const { selectUserKey, queryText, groupId } = toRefs(props)
            const localValue = ref(modelValue.value)

            const map = computed(() => {
                let data = {}
                modelValue?.value?.forEach((key) => {
                    data[key] = true
                })
                return data
            })

            const {
                userList,
                handleSearch,
                total,
                filterTotal,
                loadMore,
                isLoading,
                isEnriching,
                limit,
                offset
            } = useFacetUsers({
                groupId
            })

            // watch(userList, () => {
            //     modelValue.value = [
            //         ...modelValue.value,
            //         ...userList.value
            //             .slice(offset.value, offset.value + limit.value)
            //             .filter((user) => user.isPartOfGroup)
            //             .map((user) => user[selectUserKey.value])
            //     ]
            // })

            watch(
                () => queryText.value,
                () => {
                    handleSearch(queryText.value)
                }
            )

            const disabledKeyMap = computed(() => {
                let data = {}
                disabledKeys?.value?.forEach((key) => {
                    data[key] = true
                })
                userList.value.forEach((user) => {
                    if (user.isPartOfGroup) {
                        data[user[selectUserKey.value]] = true
                    }
                })
                // console.log('disabled keys: ', data)
                return data
            })

            const fullName = (item) => {
                if (item.firstName) {
                    return `${item.firstName} ${item.lastName || ''}`
                }
                return `${item.username}`
            }
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
                loadMore,
                isLoading,
                map,
                userList,
                fullName,
                handleSearch,
                total,
                localValue,
                filterTotal,
                handleChange,
                disabledKeyMap,
                isEnriching
            }
        },
    })
</script>
