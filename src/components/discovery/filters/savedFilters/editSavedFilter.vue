<template>
    <div v-if="isLoading" class="flex items-center justify-center mt-3">
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Fetching Saved Filters</span>
    </div>
    <div v-else>
        <a-select
            v-model:value="selectedFilter"
            show-search
            placeholder="Select a saved filter"
            style="width: 300px"
            @change="handleChange"
        >
            <a-select-option
                v-for="(filter, index) in list"
                :key="index"
                :value="filter"
                >{{ filter.name }}</a-select-option
            >
        </a-select>

        <div v-if="selectedFilter">
            <div class="mt-2 text-lg font-bold text-gray-700">
                {{ selectedFilter.name }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        computed,
        onMounted,
        nextTick,
        watch,
        Ref,
        inject,
        PropType,
        toRefs,
    } from 'vue'

    import { message } from 'ant-design-vue'
    import whoami from '~/composables/user/whoami'
    import { Components } from '~/api/atlas/client'
    import { getSavedFilters } from './useSavedFilters'
    import { SelectTypes } from 'ant-design-vue/es/select'

    export default defineComponent({
        emits: ['replaceFilter'],
        setup(_, { emit }) {
            const { username: myUsername, name: myName, email } = whoami()

            const selectedFilter = ref()
            const title = ref<string>('')
            const description = ref<string | undefined>('')

            const resetInput = () => {
                title.value = ''
                description.value = ''
            }

            const { data: list, isLoading } = getSavedFilters()

            const handleChange = () => {
                emit('replaceFilter', selectedFilter.value)
            }

            return {
                selectedFilter,
                handleChange,
                description,
                title,
                list,
                isLoading,
            }
        },
    })
</script>

<style lang="less" module>
    .input {
        :global(.ant-input:focus
                .ant-input:hover
                .ant-input::selection
                .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 bg-blue-600 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none px-0 border-0 !important;
        }
        :global(.ant-modal-header) {
            @apply border-0 border-t-0 border-b-0 px-4  !important;
        }

        :global(.ant-modal-footer) {
            @apply border-0 border-t-0 px-4 border-b-0  !important;
        }
        :global(.ant-modal-body) {
            @apply px-4 pt-0 pb-4 !important;
        }
    }
    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>
