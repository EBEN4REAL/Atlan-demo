<template>
    <a-select
        placeholder="Users"
        v-model:value="localValue"
        class="w-full"
        @change="handleChange"
    >
        <a-select-option :value="item.username" v-for="item in userList">
            {{ fullName(item) }}

            <!-- <div class="text-sm leading-none capitalize text-gray">
                {{ item }}
                <span
                    class="text-sm text-gray-500"
                    v-if="item.username === username"
                >
                    (me)
                </span>
            </div> -->
        </a-select-option>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, watch, computed, ref } from 'vue'
    import { useVModels } from '@vueuse/core'
    import useFacetUsers from '~/composables/user/useFacetUsers'
    import useUserData from '~/composables/user/useUserData'

    export default defineComponent({
        name: 'OwnersFilter',
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
        },
        emits: ['change', 'update:modelValue'],
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

            const avatarUrl = (item) =>
                `${window.location.origin}/api/services/avatar/${item.username}`

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