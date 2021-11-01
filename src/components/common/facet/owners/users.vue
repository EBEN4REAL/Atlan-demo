<template>
    <div class="w-full overflow-y-auto h-44">
        <div
            v-if="userList.length < 1"
            class="flex flex-col items-center justify-center h-full"
        >
            <div class="flex flex-col items-center">
                <!-- <img
                    :src="emptyScreen"
                    alt="No logs"
                    class="w-2/5 m-auto mb-4"
                /> -->
                <span class="text-gray-500">No Users Found</span>
            </div>
        </div>
        <div class="flex flex-col w-full">
            <a-checkbox-group
                class="w-full px-4"
                v-model:value="localValue"
                @change="handleChange"
            >
                <template v-for="item in userList" :key="item.username">
                    <a-checkbox
                        :value="item.username"
                        class="inline-flex flex-row-reverse items-center w-full mb-3  atlan-reverse"
                    >
                        <div class="flex items-center">
                            <div class="flex flex-col">
                                <div
                                    class="mb-1 text-sm leading-none capitalize  text-gray"
                                >
                                    {{ fullName(item) }}
                                    <span
                                        class="text-sm text-gray-500"
                                        v-if="item.username === username"
                                    >
                                        (me)
                                    </span>
                                </div>
                                <!-- <div class="text-xs leading-none text-gray-500">
                                    {{ item.username }}
                                </div> -->
                            </div>
                        </div>
                    </a-checkbox>
                </template>
            </a-checkbox-group>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch, computed, ref } from 'vue'
    import useFacetUsers from '~/composables/user/useFacetUsers'
    import Avatar from '@/common/avatar/index.vue'
    import useUserData from '~/composables/user/useUserData'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'OwnersFilter',
        components: { Avatar },
        props: {
            queryText: {
                type: String,
                required: false,
                default: () => '',
            },
            modelValue: {
                required: false,
            },
        },
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const { list, handleSearch, total } = useFacetUsers()
            const { username, firstName, lastName } = useUserData()

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

            const avatarUrl = (item) => {
                return `${window.location.origin}/api/services/avatar/${item.username}`
            }

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                userList,
                fullName,
                avatarUrl,
                username,
                handleSearch,
                total,
                localValue,
                handleChange,
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.atlan-reverse > span:nth-child(2)) {
        @apply w-full pl-0;
    }
</style>
