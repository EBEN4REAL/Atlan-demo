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
    </a-modal>
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

    import whoami from '~/composables/user/whoami'

    export default defineComponent({
        components: {},
        props: {},
        emits: ['onAddGlossary'],
        setup(props, { emit }) {
            const { username: myUsername, name: myName } = whoami()

            const title = ref<string | undefined>('')
            const description = ref<string | undefined>('')
            const currentStatus = ref<string | undefined>('draft')
            const selectedCategories = ref<{ categoryGuid: string }[]>([])

            const visible = ref<boolean>(false)
            const isCreateMore = ref<boolean>(false)

            const titleBar: Ref<null | HTMLInputElement> = ref(null)

            const resetInput = () => {
                title.value = ''
                description.value = ''
                currentStatus.value = 'draft'
            }

            const showModal = async () => {
                resetInput()
                visible.value = true
                await nextTick()
                titleBar.value?.focus()
            }

            const handleOk = () => {}
            const handleMenuClick = (status) => {
                currentStatus.value = status.id
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
                selectedCategories,
                handleOk,
                handleCancel,
                description,
                title,
                showModal,
                visible,
                isCreateMore,
                titleBar,
                handleMenuClick,
                currentStatus,
                myUsername,
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
