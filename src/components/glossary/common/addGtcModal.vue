<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>
    <a-modal
        v-model:visible="visible"
        :closable="false"
        :class="$style.input"
        width="800px"
    >
        <template #title>
            <slot name="header" />
        </template>
        <template #footer>
            <div class="flex items-center justify-end space-x-3">
                <a-switch size="small" v-model:checked="isCreateMore" />
                <p class="p-0 m-0">Create more</p>
                <a-button @click="handleCancel">Cancel</a-button>
                <a-button type="primary" @click="handleOk">Add term</a-button>
            </div>
        </template>
        <div class="my-3">
            <a-input
                :ref="titleBar"
                v-model:value="title"
                placeholder="Title..."
                class="text-lg border-0 shadow-none outline-none"
            />
        </div>
        <a-input
            v-model:value="description"
            placeholder="Description..."
            class="border-0 shadow-none outline-none"
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
        Ref,
    } from 'vue'
    import useCreateGlossary from '~/components/glossary/composables/useCreateGlossary'

    export default defineComponent({
        props: {
            parentName: {
                type: String,
                required: true,
                default: '',
            },
            glossaryId: {
                type: String,
                required: true,
                default: '',
            },
            categoryId: {
                type: String,
                required: false,
                default: '',
            },
        },

        emits: ['onAddTerm'],
        setup(props, context) {
            const title = ref<String>('')
            const description = ref<String>('')
            const visible = ref<boolean>(false)
            const isCreateMore = ref<boolean>(false)
            const titleBar: Ref<null | HTMLInputElement> = ref(null)
            const { createTerm, createCategory } = useCreateGlossary()

            const parent = computed(() => props.parentName)

            const resetInput = () => {
                title.value = ''
                description.value = ''
            }
            const showModal = () => {
                resetInput()
                visible.value = true
            }

            const handleOk = () => {
                if (props.categoryId === '') {
                    createTerm(
                        props.glossaryId,
                        '',
                        title.value,
                        description.value
                    )
                } else console.log('glossary->', props.glossaryId)
                console.log('category->', props.categoryId)
                if (!isCreateMore.value) visible.value = false

                resetInput()
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
                parent,
                isCreateMore,
                titleBar,
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
            @apply shadow-none outline-none border-0 !important;
        }
    }
</style>
