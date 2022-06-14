<template>
    <div :class="{ 'freeze-clicks-outside-popover': isEditing }"></div>

    <Tooltip
        v-if="!isEditing && localDescription.length > 0"
        width="1000px"
        :tooltip-text="localDescription"
        :classes="allowEditing ? 'cursor-text' : ''"
        @click="handleEdit($event)"
    />
    <div
        v-else-if="!isEditing && localDescription.length === 0"
        class="text-transparent hover:text-gray-400"
        :class="{ 'cursor-text': allowEditing }"
        @click="handleEdit($event)"
    >
        <p>{{ allowEditing ? '+ Add a description' : '' }}</p>
    </div>
    <div v-else class="inline-editable" @click.stop>
        <a-textarea
            ref="descriptionRef"
            v-model:value="localDescription"
            rows="1"
            :autosize="{ minRows: 1, maxRows: 5 }"
            tabindex="0"
            @keydown.esc="
                () => {
                    pressedEsc = true
                    handleCancel()
                }
            "
            @blur="handleUpdate"
            @press-enter="handleEnter($event)"
        />
        <!--        <p-->
        <!--            v-if="descriptionRef !== null"-->
        <!--            class="mt-1 text-xs text-right text-gray-500"-->
        <!--        >-->
        <!--            <span class="font-bold">{{ isMac ? 'Return' : 'Enter' }}</span> to-->
        <!--            save-->
        <!--            <span class="ml-2">-->
        <!--                <span class="font-bold"-->
        <!--                    >Shift + {{ isMac ? 'Return' : 'Enter' }}</span-->
        <!--                >-->
        <!--                to add a new line-->
        <!--            </span>-->
        <!--        </p>-->
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        nextTick,
        ref,
        toRefs,
        unref,
        watch,
        PropType,
    } from 'vue'
    import Tooltip from '@common/ellipsis/index.vue'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'EditableDescription',
        components: { Tooltip },
        props: {
            assetItem: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
            tooltipText: {
                type: String,
                default: '',
            },

            allowEditing: {
                type: Boolean,
                default: false,
                required: false,
            },
        },
        emits: ['updatedDescription'],
        setup(props, { emit }) {
            const truncated = ref<boolean>(false)
            const { allowEditing, assetItem } = toRefs(props)
            const descriptionRef = ref(null)
            const pressedEsc = ref(false)

            const { description } = useAssetInfo()
            const { localDescription, handleChangeDescription } =
                updateAssetAttributes(assetItem, true)
            const originalDescription = ref(unref(localDescription))

            // A ref indicating if the description is being edited.
            const isEditing = ref(false)

            /**
             * A utility function to toggle on and off editing of the field.
             *
             * @param event The click event
             */
            const handleEdit = (event: PointerEvent) => {
                if (allowEditing.value) {
                    event.stopPropagation()
                    isEditing.value = !isEditing.value
                }

                if (isEditing.value) {
                    nextTick(() => {
                        descriptionRef.value?.focus()
                    })
                }
            }

            /**
             * A utility function for cancelling any changes made to the input.
             */
            const handleCancel = () => {
                if (isEditing.value) {
                    isEditing.value = false
                    localDescription.value = originalDescription.value
                }
            }

            /**
             * A utility function for handling updates to the field.
             */
            const handleUpdate = () => {
                if (pressedEsc.value === false) {
                    originalDescription.value = localDescription.value
                    isEditing.value = false
                    handleChangeDescription()
                    emit('updatedDescription')
                } else {
                    pressedEsc.value = false
                }
            }

            /**
             * A utility function for avoiding saving on pressing Shift + Enter.
             * @param event
             */
            const handleEnter = (event: KeyboardEvent) => {
                if (!event?.getModifierState?.('Shift')) {
                    isEditing.value = false
                }
            }

            // The shortcut keys will change in accordance with this property.
            const isMac = window.navigator.userAgent.indexOf('Mac') !== -1

            watch(assetItem, () => {
                localDescription.value = description(assetItem.value)
            })

            return {
                truncated,
                isEditing,
                handleEdit,
                handleCancel,
                handleUpdate,
                descriptionRef,
                handleEnter,
                localDescription,
                pressedEsc,
                isMac,
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(div.ant-typography, .ant-typography p) {
        margin-bottom: 0 !important;
    }
    :global(.tooltip-black .ant-tooltip-inner) {
        @apply p-3 text-gray-700 whitespace-pre-line;
    }
    :global(.ant-input) {
        z-index: 800 !important;
    }
</style>
