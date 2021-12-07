<template>
    <div class="w-full overflow-y-auto h-44">
        <div
            v-if="userList.length < 1"
            class="flex flex-col items-center justify-center h-full"
        >
            <div class="flex flex-col items-center">
                <span class="text-gray-500">No users found</span>
            </div>
        </div>
        <div class="flex flex-col w-full">
            <div class="w-full px-3">
                <template v-for="item in userList" :key="item[selectUserKey]">
                    <a-checkbox
                        :checked="map[item[selectUserKey]]"
                        class="inline-flex flex-row-reverse items-center w-full px-1 py-1 rounded hover:bg-primary-light"
                        :class="$style.atlanReverse"
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
            <p class="px-4 mt-1 text-xs text-gray-500">
                showing {{ userList.length }} of {{ total }} users
            </p>
        </div>
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
            const { list, handleSearch, total, filterTotal } = useFacetUsers()
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
                        first_name: firstName,
                        last_name: lastName,
                    },
                    ...tempList,
                ]
            })

            const fullName = (item) => {
                if (item.first_name) {
                    return `${item.first_name} ${item.last_name || ''}`
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
                map,
                selectUserKey,
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

<style lang="less" module>
    .atlanReverse {
        > span:nth-child(2) {
            @apply w-full pl-0;
        }

        :global(.ant-checkbox) {
            top: 0px !important;
        }
    }
</style>
