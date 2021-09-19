<template>
    <div @click="showModal">
        <slot name="footer" @click="showModal" />
    </div>
    <a-modal
        v-model:visible="visible"
        :closable="false"
        :class="$style.input"
        width="800px"
    >
        <template #title>
            {{ parent }}
        </template>
        <template #footer>
            <a-button @click="handleOk">Cancel</a-button>
            <a-button type="primary" @click="handleOk">Add term</a-button>
        </template>
        <div class="my-4">
            <a-input
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
    import { defineComponent, ref, computed } from 'vue'

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
            const parent = computed(() => props.parentName)
            const showModal = () => {
                console.log('modal ')
                visible.value = true
            }

            const handleOk = () => {
                if (props.categoryId === '') console.log(props.glossaryId)
                else console.log('glossary->', props.glossaryId)
                console.log('category->', props.categoryId)
                visible.value = false
            }

            return { handleOk, description, title, showModal, visible, parent }
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
