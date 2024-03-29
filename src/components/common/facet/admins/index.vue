<template>
    <div class="w-full">
        <div class="flex items-center justify-between px-4">
            <SearchAdvanced
                ref="adminSearchRef"
                v-model="queryText"
                :placeholder="placeholder"
                class="-mt-1.5"
                :allow-clear="true"
                size="minimal"
            >
                <template #tab>
                    <div class="flex gap-1">
                        <a-tooltip title="users" placement="top">
                            <div
                                :class="
                                    !enableTabs.includes('users')
                                        ? hideDisabledTabs
                                            ? 'hidden'
                                            : 'pointer-events-none cursor-not-allowed'
                                        : ''
                                "
                            >
                                <AtlanIcon
                                    :class="
                                        componentType === 'users'
                                            ? 'text-primary font-bold '
                                            : ''
                                    "
                                    icon="User"
                                    class="mx-auto"
                                    @click="handleUserClick"
                                />
                            </div>
                        </a-tooltip>
                        <a-tooltip title="groups" placement="top">
                            <div
                                :class="
                                    !enableTabs.includes('groups')
                                        ? hideDisabledTabs
                                            ? 'hidden'
                                            : 'pointer-events-none cursor-not-allowed'
                                        : ''
                                "
                            >
                                <AtlanIcon
                                    :class="
                                        componentType === 'groups'
                                            ? 'text-primary font-bold'
                                            : ''
                                    "
                                    icon="GroupStatic"
                                    class="mx-auto"
                                    @click="handleGroupClick"
                                />
                            </div>
                        </a-tooltip>
                    </div>
                </template>
            </SearchAdvanced>
        </div>
        <div class="mt-1">
            <Users
                v-if="componentType == 'users'"
                ref="usersRef"
                v-model="localValue.adminUsers"
                :query-text="queryText"
                :select-user-key="selectUserKey"
                @change="handleChange"
            ></Users>
            <Groups
                v-if="componentType == 'groups'"
                ref="groupRef"
                v-model="localValue.adminGroups"
                :query-text="queryText"
                :select-group-key="selectGroupKey"
            ></Groups>
        </div>
        <div v-if="showNone" class="px-4 pt-1">
            <a-checkbox
                v-model:checked="localValue.empty"
                class="inline-flex flex-row-reverse w-full atlan-reverse"
            >
                <component
                    :is="noStatus"
                    class="inline-flex self-center w-auto h-4 mb-1"
                />
                <span class="mb-0 text-xs text-gray-500"> No Admins </span>
            </a-checkbox>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        ref,
        computed,
        Ref,
        toRefs,
        watch,
    } from 'vue'
    // import Groups from '@common/selector/groups/index.vue'
    // import Users from '@common/selector/users/index.vue'
    import { useVModels, toRef, useTimeoutFn } from '@vueuse/core'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import Users from '@/common/facet/admins/users.vue'
    import Groups from '@/common/facet/admins/groups.vue'
    import noStatus from '~/assets/images/status/nostatus.svg'

    // import { Collapse } from '~/types'

    // import { userInterface } from '~/types/users/user.interface'
    // import { groupInterface } from '~/types/groups/group.interface'
    // import useUserData from '~/services2/service/composable/useUserData'
    // import emptyScreen from '~/assets/images/empty_search.png'

    export default defineComponent({
        name: 'OwnersFilter',
        components: {
            Groups,
            Users,
            SearchAdvanced,
        },
        props: {
            modelValue: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            showNone: {
                type: Boolean,
                default: true,
            },
            selectUserKey: {
                type: String,
                required: false,
                default: () => 'username', // can be id/username
            },
            selectGroupKey: {
                type: String,
                required: false,
                default: () => 'name', // can be id/username
            },
            enableTabs: {
                type: Array as PropType<Array<any>>,
                default: () => ['users', 'groups'],
            },
            hideDisabledTabs: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const { showNone, enableTabs, selectUserKey, selectGroupKey } =
                toRefs(props)
            const componentType = ref('users')

            const usersRef = ref()
            const groupRef = ref()

            if (enableTabs.value.length < 2) {
                watch(
                    enableTabs,
                    () => {
                        componentType.value = enableTabs.value[0] as
                            | 'users'
                            | 'groups'
                    },
                    { immediate: true }
                )
            }

            const queryText = ref('')

            const handleGroupClick = () => {
                componentType.value = 'groups'
                queryText.value = ''
            }

            const handleUserClick = () => {
                componentType.value = 'users'
                queryText.value = ''
            }

            const placeholder = computed(() => {
                if (componentType.value === 'groups') {
                    return `Search ${groupRef?.value?.filterTotal ?? ''} groups`
                }
                return `Search ${usersRef?.value?.filterTotal ?? ''} users`
            })

            watch(localValue.value, (prev, cur) => {
                if (!localValue.value.adminUsers) {
                    delete localValue.value.adminUsers
                } else if (localValue.value.adminUsers?.length === 0) {
                    delete localValue.value.adminUsers
                }

                if (!localValue.value.adminGroups) {
                    delete localValue.value.adminGroups
                } else if (localValue.value.adminGroups?.length === 0) {
                    delete localValue.value.adminGroups
                }
                modelValue.value = localValue.value
                emit('change', localValue.value)
            })
            const adminSearchRef: Ref<null | HTMLInputElement> = ref(null)
            const { start } = useTimeoutFn(() => {
                if (adminSearchRef.value?.forceFocus) {
                    adminSearchRef.value?.forceFocus()
                }
            }, 100)
            /* Adding this when parent data change, sync it with local */
            watch(modelValue, () => {
                localValue.value = modelValue.value
            })

            const forceFocus = () => {
                start()
            }
            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }
            return {
                groupRef,
                usersRef,
                selectGroupKey,
                selectUserKey,
                enableTabs,
                handleGroupClick,
                componentType,
                handleUserClick,
                noStatus,
                placeholder,
                queryText,
                localValue,
                showNone,
                adminSearchRef,
                forceFocus,
                handleChange,
            }
        },
    })
</script>
