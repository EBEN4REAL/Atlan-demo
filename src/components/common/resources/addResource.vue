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
                    <img :src="favicon" alt="" class="w-4 h-4" />
                    <a-input
                        v-model:value="linkText"
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
    import { defineComponent, PropType, ref } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {},
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const popoverVisible = ref(false)
            const { title } = useAssetInfo()
            const link = ref('')
            // FIXME: Add a link meta parser for title and favicon
            const favicon = 'https://vuejs.org/images/logo.svg'
            const linkText = ref('')

            function handleCancel() {
                popoverVisible.value = false
                link.value = ''
                linkText.value = ''
            }

            function handleAdd() {
                popoverVisible.value = false
                link.value = ''
                linkText.value = ''
            }
            return {
                linkText,
                link,
                favicon,
                title,
                popoverVisible,
                handleCancel,
                handleAdd,
            }
        },
    })
</script>
