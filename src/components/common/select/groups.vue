<template>
    <a-select
        v-model:value="localValue"
        placeholder="Users"
        class="w-full center-arrow"
        :show-search="true"
        :mode="multiple ? 'multiple' : null"
        :options="finalList"
        :filter-option="() => true"
        @change="handleChange"
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
                    <AtlanIcon
                        v-if="isLoading"
                        icon="Loader"
                        class="animate-spin"
                    />
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

    <a-select
        v-model:value="localValue"
        placeholder="Groups"
        class="w-full"
        :show-search="true"
        :mode="multiple ? 'multiple' : null"
        @change="handleChange"
        @search="handleSearch"
    >
        <a-select-option v-for="(item, x) in list" :key="x" :value="item.alias">
            {{ item.alias || item.name }}
        </a-select-option>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, watch, ref, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'
    import useFacetGroups from '~/composables/group/useFacetGroups'

    export default defineComponent({
        name: 'GroupsSelect',
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
            multiple: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const { multiple } = toRefs(props)
            const localValue: any = ref(modelValue.value)

            // // set proper default value
            // if (multiple.value && !localValue.value) localValue.value = []
            // else if (!localValue.value) localValue.value = ''

            const { list, handleSearch, total } = useFacetGroups()

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

            return {
                list,

                handleSearch,
                total,
                localValue,
                handleChange,
            }
        },
    })
</script>
