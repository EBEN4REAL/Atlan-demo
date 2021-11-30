<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>
    <a-modal
        :closable="false"
        :visible="visible"
        :class="$style.input"
        centered
    >
        <template #title>
            <div class="flex items-center text-gray-500 flex-nowrap">
                <span class="overflow-hidden text-sm overflow-ellipsis">{{
                    title(asset)
                }}</span>
                <AtlanIcon icon="ChevronRight" class="flex-none" />
                <span class="flex-none text-sm font-bold text-gray"
                    >New Resource</span
                >
            </div></template
        >
        <template #footer>
            <div class="flex items-center justify-end w-full space-x-3">
                <a-button @click="handleCancel">Cancel</a-button>
                <a-button type="primary" @click="handleAdd">Add</a-button>
            </div>
        </template>
        <div class="px-4 pt-0 pb-4">
            <a-input
                ref="titleBar"
                v-model:value="link"
                placeholder="Paste resource link"
                class="text-lg font-bold text-gray-700"
                allow-clear
            />
            <div v-if="link" class="flex items-center gap-x-2">
                <img :src="faviconLink" alt="" class="w-5 h-5 mt-2" />
                <a-input
                    v-model:value="linkTitle"
                    placeholder="Resource title"
                    class="mt-3 text-lg font-bold text-gray-700"
                    allow-clear
                />
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        PropType,
        ref,
        toRefs,
        nextTick,
        watch,
    } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAddResource from '~/composables/resources/useAddResource'
    import { useDebounceFn } from '@vueuse/core'

    export default defineComponent({
        components: {},
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const visible = ref<boolean>(false)

            const titleBar: Ref<null | HTMLInputElement> = ref(null)

            const { asset } = toRefs(props)

            const { title } = useAssetInfo()

            const link = ref('')
            const faviconLink = ref('')

            // FIXME: Add a link meta parser for title
            const linkTitle = ref('')

            const showModal = async () => {
                visible.value = true
                await nextTick()
                titleBar.value?.focus()
            }

            function handleCancel() {
                visible.value = false
                link.value = ''
                linkTitle.value = ''
            }

            function handleAdd() {
                const { newResource } = useAddResource(
                    asset.value,
                    link.value,
                    linkTitle.value
                )

                newResource()
                visible.value = false
                link.value = ''
                linkTitle.value = ''
            }

            watch(
                link,
                useDebounceFn(() => {
                    faviconLink.value = `https://www.google.com/s2/favicons?domain=${link.value}`
                }, 500)
            )

            return {
                linkTitle,
                link,
                faviconLink,
                title,
                visible,
                handleCancel,
                handleAdd,
                showModal,
            }
        },
    })
</script>

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
</style>
