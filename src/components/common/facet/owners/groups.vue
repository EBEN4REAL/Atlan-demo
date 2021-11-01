<template>
    <div class="w-full overflow-y-auto h-44">
        <div
            v-if="list.length < 1"
            class="flex flex-col items-center justify-center h-full"
        >
            <div class="flex flex-col items-center">
                <!-- <img
                    :src="emptyScreen"
                    alt="No logs"
                    class="w-2/5 m-auto mb-4"
                /> -->
                <span class="text-gray-500">No Groups Found</span>
            </div>
        </div>
        <div class="flex flex-col w-full">
            <a-checkbox-group
                class="w-full px-4"
                v-model:value="localValue"
                @change="handleChange"
            >
                <template v-for="item in list" :key="item.name">
                    <a-checkbox
                        :value="item.name"
                        class="inline-flex flex-row-reverse items-center w-full mb-3  atlan-reverse"
                    >
                        <!-- <div
                            v-if="item.username === myUsername"
                            class="inline-flex capitalize"
                        >
                            {{ item.username }}

                            <span class="font-bold">
                                {{ '&nbsp;(me)' }}
                            </span>
                        </div> -->
                        <div class="flex items-center">
                            <!-- <Avatar
                                :avatarName="item.alias"
                                avatarShape="circle"
                                class="mr-1"
                                avatarSize="12"
                            ></Avatar> -->
                            <div class="flex flex-col">
                                <div
                                    class="mb-1 text-sm leading-none capitalize  text-gray"
                                >
                                    {{ item.alias || item.name }}
                                </div>
                                <!-- <div class="text-xs leading-none text-gray-500">
                                    {{ item.name }}
                                </div> -->
                            </div>
                        </div>
                    </a-checkbox>
                </template>
            </a-checkbox-group>
        </div>
        <!-- <div v-else class="flex items-center justify-center mt-3">
            <a-spin size="small" class="mr-2 leading-none"></a-spin
            ><span>Fetching users</span>
        </div> -->
    </div>
    <!-- <div
        v-if="totalUsersCount - userList.length > 0 && queryText.length < 1"
        class="mt-2"
    >
        <div
            v-if="STATES.SUCCESS === userOwnerState && showMoreUsers"
            class="flex items-center w-auto mb-0 font-bold text-center cursor-pointer select-none outlined text-primary"
            @click="toggleShowMore"
        >
            {{ `Show ${totalUsersCount - userList.length} more` }}
        </div>
    </div> -->
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, watch } from 'vue'

    import Avatar from '@common/avatar/index.vue'

    import useFacetGroups from '~/composables/group/useFacetGroups'
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
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const { list, handleSearch } = useFacetGroups()

            watch(
                () => props.queryText,
                () => {
                    handleSearch(props.queryText)
                }
            )

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return { list, handleChange, localValue }
        },
    })
</script>

<style lang="less" scoped>
    :global(.atlan-reverse > span:nth-child(2)) {
        @apply w-full pl-0;
    }
</style>
