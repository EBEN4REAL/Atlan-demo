<template>
    <a-popover
        v-model:visible="popoverVisible"
        placement="left"
        trigger="click"
    >
        <slot></slot>
        <template #content>
            <div class="flex flex-col gap-y-4 w-80">
                <div class="flex items-center text-gray-500 flex-nowrap">
                    <span class="overflow-hidden text-sm overflow-ellipsis">{{
                        title(asset)
                    }}</span>
                    <AtlanIcon icon="ChevronRight" class="flex-none" />
                    <span class="flex-none text-sm font-bold text-gray"
                        >New Resource</span
                    >
                </div>
                <a-input
                    v-model:value="link"
                    placeholder="Paste resource link"
                    allow-clear
                />
                <div v-if="link" class="flex items-center gap-x-2">
                    <img :src="faviconLink" alt="" class="w-4 h-4" />
                    <a-input
                        v-model:value="linkTitle"
                        placeholder="Resource title"
                        allow-clear
                    />
                </div>
                <div class="flex items-center justify-end w-full mt-4 gap-x-4">
                    <a-button @click="handleCancel" class="px-4"
                        >Cancel</a-button
                    >
                    <a-button type="primary" @click="handleAdd" class="px-4"
                        >Add</a-button
                    >
                </div>
            </div>
        </template>
    </a-popover>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        PropType,
        ref,
        toRefs,
        computed,
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
            const popoverVisible = ref(false)
            const { asset } = toRefs(props)

            const { title } = useAssetInfo()

            const link = ref('')
            const faviconLink = ref('')

            // FIXME: Add a link meta parser for title
            const linkTitle = ref('')

            function handleCancel() {
                popoverVisible.value = false
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
                popoverVisible.value = false
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
                popoverVisible,
                handleCancel,
                handleAdd,
            }
        },
    })
</script>
