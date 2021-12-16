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
                <template v-for="item in userList" :key="item[selectUserKey]">
                    <a-checkbox
                        :checked="map[item[selectUserKey]]"
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

                <template v-if="userList?.length < filterTotal">
                    <div class="flex justify-center">
                        <AtlanIcon
                            icon="Loader"
                            v-if="isLoading"
                            class="animate-spin"
                        />
                    </div>
                    <div
                        class="flex items-center justify-center py-0.5 cursor-pointer text-primary hover:underline"
                        @click="loadMore"
                    >
                        load more
                        <atlan-icon icon="ArrowDown" />
                    </div>
                </template>
            </div>
        </div>
        <p class="px-4 mt-1 text-xs text-gray-500">
            showing {{ userList.length }} of {{ filterTotal }} users
        </p>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch, computed, ref, toRefs, Ref } from 'vue'
    import { useVModels } from '@vueuse/core'
    import useFacetUsers from '~/composables/user/useFacetUsers'
    import useUserData from '~/composables/user/useUserData'

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
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const { selectUserKey } = toRefs(props)
            const localValue = ref(modelValue.value)
            const map = ref({})
            const updateMap = (localValue: Ref<any>) => {
                map.value = {}
                localValue.value.map((id) => {
                    map.value[id] = true
                })
            }
            updateMap(localValue)
            const {
                list,
                handleSearch,
                total,
                filterTotal,
                loadMore,
                isLoading,
            } = useFacetUsers()
            const { username, firstName, lastName, id } = useUserData()
            watch(
                () => props.queryText,
                () => {
                    handleSearch(props.queryText)
                }
            )
            const userList = computed(() => {
                if (props.queryText !== '') {
                    return [...list.value]
                }
                const tempList = list.value.filter(
                    (obj) => obj.username !== username
                )
                return [
                    {
                        username,
                        id,
                        firstName: firstName,
                        lastName: lastName,
                    },
                    ...tempList,
                ]
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
                username,
                handleSearch,
                total,
                localValue,
                filterTotal,
                handleChange,
            }
        },
    })
</script>
