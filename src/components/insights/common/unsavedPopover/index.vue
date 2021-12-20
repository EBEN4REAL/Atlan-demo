<template>
    <div class="p-4 rounded" style="width: 321px">
        <!-- <div @click="popUpClose()"></div> -->
        <div class="mb-6">
            <!-- <div > -->
            <p class="mb-2 text-base font-bold text-gray-700">
                You have unsaved changes
                <a-button
                    type="text"
                    class="float-right w-1 h-auto bg-transparent"
                    @click="popUpClose"
                    ><AtlanIcon
                        icon="Cancel"
                        class="h-3 text-gray-400"
                    ></AtlanIcon
                ></a-button>
            </p>

            <!-- </div> -->

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
                :loading="isSaving"
                @click="save"
                v-auth="[map.CREATE_COLLECTION]"
                >Save</a-button
            >
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, inject, PropType, toRefs } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import map from '~/constant/accessControl/map'

    export default defineComponent({
        components: {},
        emits: ['closeTab', 'saveTab', 'closePopup'],
        props: {
            unsavedPopover: {
                type: Object as PropType<{
                    key: string | undefined
                    show: boolean
                }>,
                required: true,
            },
            isSaving: {
                type: Boolean,
                required: true,
            },
        },
        setup(props, { emit }) {
            const { unsavedPopover, isSaving } = toRefs(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const close = () => {
                emit('closeTab', unsavedPopover.value.key)
            }
            const save = () => {
                emit('saveTab', unsavedPopover.value.key)
            }

            const popUpClose = () => {
                emit('closePopup')
            }
            return {
                isSaving,
                close,
                save,
                unsavedPopover,
                popUpClose,
                activeInlineTab,
                map,
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
