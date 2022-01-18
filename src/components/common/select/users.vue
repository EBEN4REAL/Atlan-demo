<template>
    <a-select
        ref="inputRef"
        v-model:value="localValue"
        :placeholder="`Select user${multiple ? 's' : ''}`"
        class="w-full center-arrow"
        :show-search="true"
        :showArrow="true"
        :mode="multiple ? 'multiple' : null"
        :options="finalList"
        :allow-clear="true"
        :filter-option="() => true"
        @change="handleChange"
        @dropdownVisibleChange="handleOpen"
        @click="
            () => {
                if (finalList.length < 2) mutate()
            }
        "
        @select="resetFilter"
        @search="handleSearch"
    >
        <template #option="item">
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
        </template>

        <template #dropdownRender="{ menuNode: menu }">
            <v-nodes :vnodes="menu"> </v-nodes>
            <div class="px-2 pt-2">
                <div class="flex justify-center">
                    <AtlanLoader v-if="isLoading" />
                </div>
                <div class="flex items-end justify-between">
                    <span v-if="userList?.length" class="text-xs text-gray-500">
                        {{ userList?.length }} of {{ filterTotal }}
                    </span>
                    <span
                        v-if="userList?.length < filterTotal"
                        class="flex items-center text-xs justify-center py-0.5 cursor-pointer text-primary hover:underline"
                        @click="loadMore"
                        @mousedown="(e) => e.preventDefault()"
                    >
                        load more...
                    </span>
                </div>
            </div>
        </template>

        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" />
        </template>
    </a-select>
</template>

<script lang="ts">
    import {
        defineComponent,
        watch,
        computed,
        ref,
        toRefs,
        onBeforeUnmount,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import useFacetUsers from '~/composables/user/useFacetUsers'
    import Avatar from '~/components/common/avatar/index.vue'

    export default defineComponent({
        name: 'UsersSelector',
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

            const {
                userList,
                handleSearch,
                total,
                isLoading,
                filterTotal,
                loadMore,
                mutate,
                resetFilter,
                queryText: query,
            } = useFacetUsers({ immediate: false })

            watch(
                () => props.queryText,
                () => {
                    handleSearch(props.queryText)
                }
            )
            const fullName = (item) => {
                if (item.firstName) {
                    return `${item.firstName} ${item.lastName || ''}`
                }
                return `${item.username}`
            }

            const finalList = computed(() =>
                (userList?.value ?? []).map((u) => ({
                    ...u,
                    value: u.username,
                    key: u.id,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    username: u.username,
                    label: `${u.firstName ?? ''} ${u.lastName ?? ''}`,
                }))
            )

            const avatarUrl = (item) =>
                `${window.location.origin}/api/service/avatars/${item.username}`

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            const inputRef = ref()

            const focus = () => {
                inputRef.value.focus()
            }

            const handleOpen = (v) => {
                if (!v) {
                    query.value = ''
                    return
                }
                if (!finalList.value.length) mutate()
                else resetFilter()
            }

            return {
                handleOpen,
                query,
                inputRef,
                focus,
                resetFilter,
                mutate,
                finalList,
                loadMore,
                filterTotal,
                userList,
                fullName,
                avatarUrl,
                handleSearch,
                isLoading,
                total,
                localValue,
                handleChange,
            }
        },
    })
</script>

<style lang="less" scoped></style>
