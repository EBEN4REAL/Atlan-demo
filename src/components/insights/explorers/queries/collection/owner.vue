<template>
    <div class="w-full">
        <a-popover
            trigger="click"
            placement="bottom"
            v-model:visible="popoverVisible"
        >
            <div
                class="flex items-center justify-between"
                @click="showPopover(true)"
            >
                <SearchAdvanced
                    v-model="queryText"
                    :placeholder="placeholder"
                    :allow-clear="true"
                    size="minimal"
                    class="border-b-0"
                    :autofocus="false"
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

            <template #content>
                <div style="width: 330px" class="pb-2">
                    <div>
                        <Users
                            v-if="componentType == 'users'"
                            ref="usersRef"
                            v-model="modelValue.ownerUsers"
                            v-model:disabledKeys="disabledModalValue.ownerUsers"
                            :query-text="queryText"
                            :select-user-key="selectUserKey"
                            @change="handleChange"
                            :show-avatar="true"
                            list-class="h-52"
                            checkbox-list-class="h-48 py-2"
                            list-item-class="h-8 my-0.5"
                            :showLoggedInUser="false"
                        ></Users>

                        <Groups
                            v-if="componentType == 'groups'"
                            ref="groupRef"
                            v-model="modelValue.ownerGroups"
                            v-model:disabledKeys="
                                disabledModalValue.ownerGroups
                            "
                            :query-text="queryText"
                            :select-group-key="selectGroupKey"
                            @change="handleChange"
                            :show-avatar="true"
                            list-class="h-52"
                            checkbox-list-class="h-48 py-2"
                            list-item-class="h-8 my-0.5"
                        ></Groups>
                    </div>
                    <div v-if="showNone" class="px-4 pt-1">
                        <a-checkbox
                            v-model:checked="localValue.empty"
                            class="inline-flex flex-row-reverse items-center w-full atlan-reverse"
                        >
                            <component
                                :is="noStatus"
                                class="inline-flex self-center w-auto h-4 mb-1"
                            />
                            <span class="mb-0 text-gray-500"> No Owners </span>
                        </a-checkbox>
                    </div>
                </div>
            </template>
        </a-popover>
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
    import Users from '@/common/facet/owners/users.vue'
    import Groups from '@/common/facet/owners/groups.vue'
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
            disabledModalValue: {
                type: Object,
                required: false,
                default: () => ({}),
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

            const popoverVisible = ref(false)
            const showPopover = (val) => {
                popoverVisible.value = val
            }

            const handleGroupClick = () => {
                componentType.value = 'groups'
                // queryText.value = ''
                showPopover(true)
            }

            const handleUserClick = () => {
                componentType.value = 'users'
                // queryText.value = ''
                showPopover(true)
            }

            const placeholder = computed(() => {
                if (!popoverVisible.value) {
                    return 'Search users and groups'
                }
                if (componentType.value === 'groups') {
                    return `Search ${groupRef?.value?.filterTotal ?? ''} groups`
                }
                return `Search ${usersRef?.value?.filterTotal ?? ''} users`
            })

            const ownerSearchRef: Ref<null | HTMLInputElement> = ref(null)

            watch(modelValue, () => {
                localValue.value = modelValue.value
            })

            const handleChange = () => {
                emit('change')
            }

            watch(queryText, () => {
                if (popoverVisible.value === false) {
                    showPopover(true)
                }
            })

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
                ownerSearchRef,
                // forceFocus,
                handleChange,
                showPopover,
                popoverVisible,
                // handleUserChange,
            }
        },
    })
</script>
