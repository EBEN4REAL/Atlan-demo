<template>
    <div class="p-4 rounded" style="width: 360px">
        <!-- <div @click="popUpClose()"></div> -->
        <div class="mb-6">
            <!-- <div > -->
            <p class="mb-2 text-base font-bold text-gray-700">
                You have unsaved changes
            </p>

            <p class="mb-0 text-black">
                Do you want to save your changes before closing the tab?
            </p>
        </div>

        <div class="flex w-full">
            <AtlanBtn
                size="sm"
                color="secondary"
                padding="compact"
                class="h-6 py-1 text-sm border-none rounded shadow-none cursor-pointer justify-self-start hover:text-primary"
                @click="close"
            >
                <span>Close Tab</span>
            </AtlanBtn>
            <div class="flex justify-end w-full">
                <AtlanBtn
                    size="sm"
                    color="secondary"
                    padding="compact"
                    style="width: 80px"
                    class="h-6 py-1 text-sm border-none rounded shadow-none cursor-pointer hover:text-primary"
                    @click="popUpClose"
                >
                    <span>Cancel</span>
                </AtlanBtn>

                <AtlanBtn
                    size="sm"
                    color="primary"
                    padding="compact"
                    style="width: 80px"
                    class="h-6 py-1 text-sm border-none rounded shadow-none cursor-pointer"
                    :loading="isSaving"
                    @click="save"
                    v-auth="[map.CREATE_COLLECTION]"
                >
                    <span>Save</span>
                </AtlanBtn>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, inject, PropType, toRefs } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import map from '~/constant/accessControl/map'
    import AtlanBtn from '~/components/UI/button.vue'

    export default defineComponent({
        components: { AtlanBtn },
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
