<template>
    <div class="">
        <div class="flex items-center justify-between px-4 mb-2">
            <SearchAdvanced
                :placeholder="placeholder"
                :autofocus="true"
                v-model:value="queryText"
                class="-mt-1.5"
                size="minimal"
            >
                <template #tab>
                    <div class="flex gap-1">
                        <AtlanIcon
                            :class="
                                componentType === 'users'
                                    ? 'text-primary font-bold'
                                    : ''
                            "
                            icon="User"
                            class="mx-auto"
                            @click="handleUserClick"
                        />
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
                </template>
            </SearchAdvanced>
        </div>
        <div class="">
            <Users
                v-if="componentType == 'users'"
                v-model="localValue.ownerUsers"
                :query-text="queryText"
            ></Users>
            <Groups
                v-if="componentType == 'groups'"
                v-model="localValue.ownerGroups"
                :query-text="queryText"
            ></Groups>
        </div>
        <div class="px-4 pt-1">
            <a-checkbox
                :value="null"
                class="inline-flex flex-row-reverse items-center w-full  atlan-reverse"
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
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import Users from '@/common/facet/owners/users.vue'
    import Groups from '@/common/facet/owners/groups.vue'
    import noStatus from '~/assets/images/status/nostatus.svg'
    import { useVModels, toRef } from '@vueuse/core'

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
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const componentType = ref('users')

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
                    return 'Search groups'
                }
                return 'Search users'
            })

            watch(localValue.value, (prev, cur) => {
                if (!localValue.value.ownerUsers) {
                    delete localValue.value.ownerUsers
                }
                if (!localValue.value.ownerGroups) {
                    delete localValue.value.ownerGroups
                }
                modelValue.value = localValue.value
                emit('change')
            })

            return {
                handleGroupClick,
                componentType,
                handleUserClick,
                noStatus,
                placeholder,
                queryText,
                localValue,
            }
        },
    })
</script>
