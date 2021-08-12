<template>
    <div class="px-4 py-1 pb-3">
        <!-- <div>
            <p class="mb-1 text-xs text-gray-500">Users</p>

        </div> -->

        <a-input
            v-input-focus
            :placeholder="
                activeOwnerTabKey === '1'
                    ? `Search ${listUsers?.length} users`
                    : `Search ${listGroups?.length} groups`
            "
            class="rounded"
            @change="handleOwnerSearch"
        >
            <template #prefix>
                <fa icon="fal search" />
            </template>
        </a-input>
        <div class="relative w-full">
            <a-tabs
                v-model:activeKey="activeOwnerTabKey"
                :class="$style.previewtab"
            >
                <a-tab-pane key="1">
                    <template #tab>
                        <span
                            class="text-sm"
                            :class="activeOwnerTabKey == '1' ? 'font-bold' : ''"
                            >Users</span
                        >
                        <span
                            class="ml-2 chip"
                            v-if="selectedUsers.length > 0"
                            >{{ selectedUsers.length }}</span
                        >
                    </template>
                    <div class="h-48 overflow-y-auto">
                        <a-checkbox-group v-model:value="selectedUsers">
                            <div class="flex flex-col w-full">
                                <a-checkbox
                                    v-for="item in listUsers"
                                    :key="item.username"
                                    :value="item.username"
                                    class="mb-3"
                                >
                                    <span>
                                        {{ item.username }}
                                    </span>
                                </a-checkbox>
                            </div>
                        </a-checkbox-group>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2">
                    <template #tab>
                        <span
                            class="text-sm"
                            :class="activeOwnerTabKey == '2' ? 'font-bold' : ''"
                            >Groups</span
                        >
                        <span class="chip" v-if="selectedGroups.length > 0">{{
                            selectedGroups.length
                        }}</span>
                    </template>
                    <div class="h-48 overflow-y-auto">
                        <a-checkbox-group v-model:value="selectedGroups">
                            <div class="flex flex-col w-full space-y-1">
                                <a-checkbox
                                    v-for="item in listGroups"
                                    :key="item.name"
                                    :value="item.name"
                                    class="mb-3"
                                >
                                    {{ item.name }}
                                </a-checkbox>
                            </div>
                        </a-checkbox-group>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import Groups from '@common/selector/groups/index.vue'
    import Users from '@common/selector/users/index.vue'
    import { Collapse } from '~/types'
    import { Components } from '~/api/atlas/client'
    import fetchUserList from '~/composables/user/fetchUserList'
    import fetchGroupList from '~/composables/group/fetchGroupList'

    export default defineComponent({
        name: 'HelloWorld',
        components: {
            Groups,
            Users,
        },
        props: {
            item: {
                type: Object as PropType<Collapse>,
                required: false,
                default() {
                    return {}
                },
            },
            user: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            data: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            group: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            modelValue: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const now = ref(true)
            const userValue = ref('')
            userValue.value = props.user || props.data.userValue
            const groupValue = ref('')
            groupValue.value = props.group || props.data.groupValue
            const activeOwnerTabKey = ref('1')
            const selectedUsers: Ref<string[]> = ref([])
            const selectedGroups: Ref<string[]> = ref([])

            const handleUsersChange = (selectedValues: string) => {
                emit(
                    'update:modelValue',
                    { users: userValue.value, groups: groupValue.value },
                    props.item.id
                )
                handleChange()
            }
            const handleGroupsChange = (selectedValues: string) => {
                emit(
                    'update:modelValue',
                    { users: userValue.value, groups: groupValue.value },
                    props.item.id
                )
                handleChange()
            }
            const handleChange = () => {
                const criterion: Components.Schemas.FilterCriteria[] = []

                if (userValue.value) {
                    criterion.push({
                        attributeName: 'ownerUsers',
                        attributeValue: userValue.value,
                        operator: 'contains',
                    })
                }
                if (groupValue.value) {
                    criterion.push({
                        attributeName: 'ownerGroups',
                        attributeValue: groupValue.value,
                        operator: 'contains',
                    })
                }
                emit('change', {
                    id: props.item.id,
                    payload: {
                        condition: 'OR',
                        criterion,
                    } as Components.Schemas.FilterCriteria,
                })
            }

            const clear = () => {
                userValue.value = ''
                groupValue.value = ''
                handleChange()
            }
            const handleOwnerSearch = () => {}
            const {
                list: listUsers,
                total: totalUsersCount,
                filtered,
                state: userOwnerState,
                STATES,
                handleSearch: handleUserSearch,
            } = fetchUserList(now)

            const {
                list: listGroups,
                handleSearch: handleGroupSearch,
                total: totalGroupCount,
                state: groupOwnerState,
            } = fetchGroupList(now)
            const onSelectUser = (user: userInterface) => {
                // unselect if already selected
                if (selectedUsers.value.includes(user.username)) {
                    const index = selectedUsers.value.indexOf(user.username)
                    if (index > -1) {
                        selectedUsers.value.splice(index, 1)
                    }
                } else {
                    selectedUsers.value.push(user.username)
                }
            }
            const onSelectGroup = (group: groupInterface) => {
                // unselect if already selected
                if (selectedGroups.value.includes(group.name)) {
                    const index = selectedGroups.value.indexOf(group.name)
                    if (index > -1) {
                        selectedGroups.value.splice(index, 1)
                    }
                } else {
                    selectedGroups.value.push(group.name)
                }
            }
            function isOwner(username: string, owners: string[]) {
                return owners.includes(username)
            }

            return {
                onSelectGroup,
                isOwner,
                onSelectUser,
                selectedUsers,
                selectedGroups,
                listUsers,
                listGroups,
                handleOwnerSearch,
                activeOwnerTabKey,
                handleChange,
                handleUsersChange,
                handleGroupsChange,
                userValue,
                groupValue,
                clear,
            }
        },
        mounted() {},
    })
</script>

<style lang="less" scoped>
    ._bg-primary-light {
        background: rgba(34, 81, 204, 0.05);
    }
    .hover_bg-primary-light:hover {
        background: rgba(34, 81, 204, 0.05);
    }
    .owner-child {
        margin-top: 0.3rem;
        margin-bottom: 0.3rem;
    }
    // .owner-child:nth-child(2) {
    //     margin-top: 0.3rem;
    //     margin-bottom: 0.3rem;
    // }
</style>
<style lang="less" module>
    .previewtab {
        :global(.ant-tabs-tab) {
            @apply pb-3 px-1;
            @apply mx-2;
            @apply text-gray-description;
            @apply text-xs;
        }
    }
</style>
<style scoped>
    .chip {
        @apply px-1 pt-1 pb-0.5 mx-1;
        @apply rounded;
        @apply tracking-wide;
        @apply text-xs;
        @apply font-bold;
        @apply text-primary;
        @apply bg-primary-muted;
    }
</style>
