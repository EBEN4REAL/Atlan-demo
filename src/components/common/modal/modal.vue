<template>
    <a-modal
        :visible="modalVisible"
        :closable="false"
        :class="modalClass ? `${modalClass}` : `${$style.input}`"
        :width="modalWidth"
        :destroyOnClose="true"
    >
        <template #title>
            <div class="flex items-center justify-between w-full">
                <slot name="leftHeader"></slot>
                <slot name="rightHeader"></slot>
            </div>
        </template>

        <template #footer>
            <div class="flex items-center justify-between pb-1">
                <slot name="footerLeft"></slot>
                <div class="flex items-center justify-end w-full space-x-3">
                    <slot name="actionButtons"></slot>
                </div>
            </div>
        </template>

        <div class="px-4 pt-0 pb-3 -mt-2">
            <a-input
                ref="titleRef"
                v-model:value="title"
                :placeholder="titlePlaceholder"
                class="mt-1 text-lg font-bold text-gray-700 border-0 shadow-none outline-none"
                :class="titleClass"
            />
            <a-textarea
                v-model:value="description"
                :placeholder="descriptionPlaceholder"
                class="text-gray-500 border-0 shadow-none outline-none placeholder-color"
                :class="descriptionClass"
                :maxlength="descriptionWordLimit"
                :rows="3"
                :show-count="showDescriptionLimit"
            />
        </div>
    </a-modal>
</template>

<script lang="ts">
    import { watch, defineComponent, nextTick, ref, Ref, onMounted } from 'vue'
    import AtlanButton from '~/components/UI/button.vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'AtlanModal',
        components: { AtlanButton },
        props: {
            modalVisible: {
                type: Boolean,
                required: true,
                default: false,
            },
            modalWidth: {
                type: String,
                required: true,
                default: '576px',
            },
            title: {
                type: String,
                required: false,
                default: '',
            },
            titlePlaceholder: {
                type: String,
                required: false,
                default: '',
            },
            description: {
                type: String,
                required: false,
                default: '',
            },
            descriptionPlaceholder: {
                type: String,
                required: false,
                default: '',
            },
            showDescriptionLimit: {
                type: Boolean,
                default: false,
            },
            descriptionWordLimit: {
                type: Number,
                required: false,
                default: 140,
            },
            modalClass: {
                type: String,
                required: false,
                default: '',
            },
            titleClass: {
                type: String,
                required: false,
                default: '',
            },
            descriptionClass: {
                type: String,
                required: false,
                default: '',
            },
        },
        setup(props, { emit }) {
            const { title, description, modalVisible } = useVModels(props)
            const titleRef: Ref<null | HTMLInputElement> = ref(null)

            watch(modalVisible, async () => {
                if (modalVisible.value) {
                    await nextTick()
                    titleRef.value?.focus()
                }
            })

            return {
                titleRef,
                title,
                description,
            }
        },
    })
</script>

<style lang="less" scoped>
    .placeholder-color::placeholder {
        color: #6f7590 !important;
    }
</style>
<style lang="less" module>
    .input {
        :global(.ant-input:focus, .ant-input:hover, .ant-input::selection, .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input):focus,
        :global(.ant-input):hover {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none px-0 border-0 !important;
        }
    }

    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>
