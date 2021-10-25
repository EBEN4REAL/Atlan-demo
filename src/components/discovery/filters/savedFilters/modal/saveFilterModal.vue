<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>
    <a-modal
        v-model:visible="visible"
        width="800px"
        :closable="false"
        :footer="null"
    >
        <template #title />
        <div class="flex flex-col items-stretch pb-4 gap-y-1">
            <p class="mb-2 text-base font-bold text-gray">Save Filters</p>
            <RaisedTab
                v-model:active="activeTab"
                class="mb-2 mr-auto"
                :data="tabConfig"
            />
            <template v-if="activeTab === 'new'">
                <input
                    ref="titleBar"
                    v-model="title"
                    placeholder="Saved filter name..."
                    type="text"
                    class="text-lg font-bold text-gray-700 clean-input"
                    @keyup.esc="$event?.target?.blur()"
                />

                <textarea
                    v-model="description"
                    class="text-sm text-gray-500 clean-input"
                    maxlength="140"
                    rows="2"
                    placeholder="Add description..."
                    @keyup.esc="$event?.target?.blur()"
                />
            </template>
            <EditSavedFilter
                v-if="activeTab === 'replace'"
                @replaceFilter="handleReplaceFilterSelection"
            />
        </div>
        <div class="flex items-center justify-end gap-x-4">
            <AtlanBtn color="secondary" padding="compact" @click="handleCancel"
                >Cancel</AtlanBtn
            >
            <AtlanBtn padding="compact" @click="handleOk">Save</AtlanBtn>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        onMounted,
        nextTick,
        watch,
        Ref,
        PropType,
        toRefs,
    } from 'vue'

    import { message } from 'ant-design-vue'
    import whoami from '~/composables/user/whoami'
    import { addSavedFilter, editSavedFilter } from '../useSavedFilters'
    import { Components } from '~/api/atlas/client'
    import EditSavedFilter from './editSavedFilter.vue'
    import RaisedTab from '@/UI/raisedTab.vue'
    import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        components: {
            EditSavedFilter,
            RaisedTab,
            AtlanBtn,
        },
        props: {
            appliedFilters: {
                type: Object as PropType<Components.Schemas.FilterCriteria[]>,
                required: true,
            },
        },
        emits: ['savedFilterAdded'],
        setup(props, { emit }) {
            const { username: myUsername } = whoami()
            const { appliedFilters } = toRefs(props)
            const title = ref<string>('')
            const description = ref<string | undefined>('')
            const replaceSelectedFilter = ref()
            const visible = ref<boolean>(false)

            const activeTab = ref('new')

            const tabConfig = [
                { key: 'new', label: 'New saved filter' },
                { key: 'replace', label: 'Replace existing' },
            ]

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
                tabConfig,
                handleReplaceFilterSelection,
            }
        },
    })
</script>

<style lang="less" scoped>
    .clean-input {
        @apply block bg-transparent border-0 shadow-none outline-none;

        &:focus {
            @apply outline-none;
        }
    }
</style>
