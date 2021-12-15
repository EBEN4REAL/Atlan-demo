<template>
    <a-select
        v-model:value="localValue"
        placeholder="Users"
        class="w-full"
        :show-search="true"
        :mode="multiple ? 'multiple' : null"
        @change="handleChange"
        @search="handleSearch"
    >
        <a-select-option
            v-for="(item, x) in userList"
            :key="x"
            :value="item.username"
        >
            <div class="">
                <div class="flex">
                    <Avatar
                        avatar-shape="circle"
                        :image-url="avatarUrl(item)"
                        :allow-upload="false"
                        :avatar-name="item.name || item.username || item.email"
                        :avatar-size="25"
                        class="mr-2"
                    />
                    <div class="">
                        <div>{{ fullName(item) }}</div>
                        <div class="text-xs text-gray-500">
                            @{{ item.username }}
                        </div>
                    </div>
                </div>
            </div>
        </a-select-option>

        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" />
        </template>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, watch, computed, ref, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'
    import useFacetUsers from '~/composables/user/useFacetUsers'
    import useUserData from '~/composables/user/useUserData'
    import Avatar from '~/components/common/avatar/index.vue'

    export default defineComponent({
        name: 'OwnersFilter',
        components: { VNodes: (_, { attrs }) => attrs.vnodes, Avatar },
        props: {
            queryText: {
                type: String,
                required: false,
                default: () => '',
            },
            multiple: {
                type: Boolean,
                required: false,
                default: false,
            },
            modelValue: {
                type: Array,
                required: false,
                default: () => undefined,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const { multiple } = toRefs(props)

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
                        firstName,
                        lastName,
                    },
                    ...tempList,
                ]
            })

            const fullName = (item) => {
                if (item.firstName) {
                    return `${item.firstName} ${item.lastName || ''}`
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
