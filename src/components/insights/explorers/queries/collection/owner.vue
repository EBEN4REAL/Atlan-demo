<template>
    <div class="w-full bg-white">
        <a-dropdown
            :trigger="['click']"
            placement="bottomCenter"
            :visible="popoverVisible"
        >
            <div
                class="flex items-center justify-between bg-white"
                @click="() => showPopover(true)"
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
                        <div class="flex gap-1" :class="hideTabs ? 'hidden' : ''">
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

            <template #overlay>
                <div
                    :style="dropdownStyleObject"
                    class="pb-2 -mt-1 bg-white rounded-b shadow-2xl"
                    @mouseleave="() => showPopover(false)"
                >
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
                            :showLoggedInUser="showLoggedInUser"
                            v-model:selectedRecords="selectedRecords"
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
        </a-dropdown>
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

    import { useVModels, toRef, useTimeoutFn } from '@vueuse/core'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import Users from '@/common/facet/owners/users.vue'
    import Groups from '@/common/facet/owners/groups.vue'
    import noStatus from '~/assets/images/status/nostatus.svg'
    import { onClickOutside } from '@vueuse/core'

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
             selectedRecords: {
                type: Object,
                default: null,
                required: false
            },
            showLoggedInUser:{
                type: Boolean,
                default: false,
                required: false
            },
            dropdownStyleObject:{
                type: Object,
                default:{ width: '330px' },
                required: false
            },
            searchPlaceholder:{
                type: String,
                default: ''
            },
            hideTabs:{
                type: Boolean,
                default: false,
                required: false
            }
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue, selectedRecords } = useVModels(props, emit)
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
                // showPopover(true)
            }

            const handleUserClick = () => {
                componentType.value = 'users'
                // queryText.value = ''
                // showPopover(true)
            }

            const placeholder = computed(() => {
                if (!popoverVisible.value) {
                    return props?.searchPlaceholder || 'Search users and groups' 
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

            const target = ref(null)
            onClickOutside(target, (event) => showPopover(false))

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
                target,
                selectedRecords
                // handleUserChange,
            }
        },
    })
</script>
