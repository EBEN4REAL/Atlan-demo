<template>
    <div class="p-4 rounded" style="width: 321px">
        <div class="mb-6">
            <p class="mb-2 text-base font-bold text-gray-700">
                You have unsaved changes
            </p>
            <p class="mb-0 text-black">
                Do you want to save your changes before closing the tab?
            </p>
        </div>
        <div class="flex justify-end w-full">
            <a-button
                class="px-5 mr-4 text-sm border rounded"
                style="width: 100px"
                type="default"
                @click="close"
                >Close Tab</a-button
            >
            <a-button
                class="px-5 text-sm rounded"
                style="width: 100px"
                type="primary"
                @click="save"
                >Save</a-button
            >
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, inject, PropType, toRefs } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        components: {},
        emits: ['closeTab', 'saveTab'],
        props: {
            unsavedPopover: {
                type: Object as PropType<{
                    key: string | undefined
                    show: boolean
                }>,
                required: true,
            },
        },
        setup(props, { emit }) {
            const { unsavedPopover } = toRefs(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const close = () => {
                emit('closeTab', unsavedPopover.value.key)
            }
            const save = () => {
                emit('saveTab', unsavedPopover.value.key)
            }
            return {
                close,
                save,
                unsavedPopover,
                activeInlineTab,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .box {
        height: 90%;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
