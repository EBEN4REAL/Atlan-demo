<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>
    <a-modal
        v-model:visible="visible"
        :class="$style.input"
        width="800px"
        :closable="false"
    >
        <template #title>
            <div class="font-bold text-gray-700">Save Filters</div>
        </template>
        <template #footer>
            <div class="flex items-center justify-end w-full">
                <a-button @click="handleCancel">Cancel</a-button>
                <a-button type="primary" @click="handleOk"> Save </a-button>
            </div>
        </template>
        <a-button-group class="mb-2 text-xs rounded shadow">
            <a-button
                :class="
                    activeTab === 'new'
                        ? 'text-primary font-bold'
                        : 'text-gray-500'
                "
                @click="setActiveTab('new')"
            >
                New saved filter
            </a-button>

            <a-button
                :class="
                    activeTab === 'replace'
                        ? 'text-primary font-bold'
                        : 'text-gray-500'
                "
                @click="setActiveTab('replace')"
                >Replace existing</a-button
            >
        </a-button-group>
        <div v-if="activeTab === 'new'">
            <a-input
                ref="titleBar"
                v-model:value="title"
                placeholder="Saved filter name..."
                class="text-lg font-bold text-gray-700 border-0 shadow-none outline-none "
                :class="$style.titleInput"
            />
            <a-textarea
                v-model:value="description"
                placeholder="Add description..."
                class="text-gray-500 border-0 shadow-none outline-none"
                :maxlength="140"
                :rows="2"
            />
        </div>
        <div v-if="activeTab === 'replace'">
            <keep-alive>
                <EditSavedFilter @replaceFilter="handleReplaceFilterSelection"
            /></keep-alive>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        defineAsyncComponent,
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
    import { addSavedFilter, editSavedFilter } from './useSavedFilters'
    import { Components } from '~/api/atlas/client'

    export default defineComponent({
        components: {
            EditSavedFilter: defineAsyncComponent(
                () => import('./editSavedFilter.vue')
            ),
        },
        props: {
            appliedFilters: {
                type: Object as PropType<Components.Schemas.FilterCriteria[]>,
                required: true,
            },
        },
        emits: ['savedFilterAdded'],
        setup(props, { emit }) {
            const { username: myUsername, name: myName, email } = whoami()
            const { appliedFilters } = toRefs(props)
            const title = ref<string>('')
            const description = ref<string | undefined>('')
            const replaceSelectedFilter = ref()
            const visible = ref<boolean>(false)
            const activeTab: Ref<'new' | 'replace'> = ref('new')

            function setActiveTab(tabName: 'new' | 'replace') {
                activeTab.value = tabName
            }

            const titleBar: Ref<null | HTMLInputElement> = ref(null)

            const resetInput = () => {
                title.value = ''
                description.value = ''
            }

            const showModal = async () => {
                resetInput()
                visible.value = true
                await nextTick()
                titleBar.value?.focus()
            }
            const handleReplaceFilterSelection = (payload) => {
                replaceSelectedFilter.value = payload
            }
            const handleOk = () => {
                if (activeTab.value === 'new') {
                    const { data, error, isLoading, isReady } = addSavedFilter(
                        title,
                        myUsername,
                        appliedFilters
                    )
                    watch([data, isReady, error, isLoading], () => {
                        if (isReady && !error.value && !isLoading.value) {
                            message.success('Saved filter added')
                        } else if (error && error.value) {
                            message.error(
                                'Failed to add the saved filter, try again later'
                            )
                        }
                    })
                } else {
                    const { data, error, isLoading, isReady } = editSavedFilter(
                        replaceSelectedFilter,
                        appliedFilters
                    )
                    watch([data, isReady, error, isLoading], () => {
                        if (isReady && !error.value && !isLoading.value) {
                            message.success('Saved filter replaced')
                        } else if (error && error.value) {
                            message.error(
                                'Failed to replace the saved filter, try again later'
                            )
                        }
                    })
                }
                resetInput()
                visible.value = false
                emit('savedFilterAdded')
            }

            const handleCancel = () => {
                resetInput()
                visible.value = false
            }

            onMounted(async () => {
                await nextTick()
                titleBar.value?.focus()
            })

            return {
                handleOk,
                handleCancel,
                description,
                title,
                showModal,
                visible,
                titleBar,
                myUsername,
                activeTab,
                setActiveTab,
                handleReplaceFilterSelection,
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
