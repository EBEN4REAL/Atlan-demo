<template>
    <div class="w-full h-44" :class="listClass">
        <div
            v-if="userList.length < 1"
            class="flex flex-col items-center justify-center h-full"
        >
            <div class="flex flex-col items-center">
                <span class="text-gray-500">No users found</span>
            </div>
        </div>
        <div
            class="flex flex-col w-full h-40 overflow-y-auto"
            :class="checkboxListClass"
        >
            <div class="w-full px-3">
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
                        :class="listItemClass"
                        @change="
                            (checked) =>
                                handleChange(checked, item[selectUserKey])
                        "
                    >
                        <div class="flex items-center">
                            <Avatar
                                v-if="showAvatar"
                                avatar-shape="circle"
                                :image-url="imageUrl(item.username)"
                                :allow-upload="false"
                                :avatar-name="item.username"
                                :avatar-size="20"
                                class="mr-2"
                            />
                            <div
                                class="text-sm leading-none capitalize text-gray"
                            >
                                {{ fullName(item) }}
                                <span
                                    v-if="item.username === username"
                                    class="text-sm text-gray-500"
                                >
                                    (me)
                                </span>
                            </div>
                        </div>
                    </a-checkbox>
                </template>
            </div>
            <div
                class="flex items-center justify-between px-4"
                v-if="userList.length > 0"
            >
                <p class="text-xs text-gray-500">
                    {{ userList.length }} of {{ filterTotal }} users
                </p>
                <template v-if="userList?.length < filterTotal">
                    <div class="flex justify-center" v-if="isLoading">
                        <a-spin size="small"></a-spin>
                    </div>
                    <div
                        class="flex items-center justify-center text-xs cursor-pointer text-primary hover:underline"
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
    import { useVModels, onKeyStroke } from '@vueuse/core'
    import useFacetUsers from '~/composables/user/useFacetUsers'
    import Avatar from '~/components/common/avatar/avatar.vue'

    export default defineComponent({
        name: 'UsersFilter',
        components: {
            Avatar,
        },
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
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue, disabledKeys } = useVModels(props, emit)
            const { selectUserKey, queryText } = toRefs(props)
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
            } = useFacetUsers()
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

            onKeyStroke(['Enter'], (e) => {
                const { key } = e
                e.preventDefault()

                if (key === 'Enter') {
                    if (userList.value.length === 1) {
                        // console.log('enter pressed')

                        let id = userList.value[0][selectUserKey.value]
                        if (map.value[id]) {
                            delete map.value[id]
                        } else {
                            map.value[id] = true
                        }
                        modelValue.value = [...Object.keys(map.value)]
                    }
                }
            })

            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

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
                imageUrl,
            }
        },
    })
</script>
