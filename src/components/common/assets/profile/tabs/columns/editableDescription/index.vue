<template>
    <div v-if="isEditing" class="freeze-clicks-outside-popover"></div>

    <Tooltip
        v-if="!isEditing && localDescription.length > 0"
        width="1000px"
        :tooltip-text="localDescription"
        :classes="allowEditing ? 'cursor-text hover:underline' : ''"
        :rows="2"
        @click="handleEdit($event)"
    />
    <div
        v-else-if="!isEditing && localDescription.length === 0"
        class="flex items-center gap-x-2.5"
    >
        <p
            :class="{ 'cursor-text hover:underline': allowEditing }"
            style="color: #bfbfbf"
            @click="handleEdit($event)"
        >
            {{ allowEditing ? '+ Add a description' : '' }}
        </p>
        <transition
            v-if="similarList?.length > 0 && !localDescription"
            name="fade"
        >
            <Suggestion
                :button-between="false"
                :edit-permission="allowEditing"
                :list="similarList"
                :asset="assetItem"
                @apply="handleApplySuggestion"
            ></Suggestion>
        </transition>
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
    import Suggestion from './suggestion.vue'

    export default defineComponent({
        name: 'EditableDescription',
        components: { Tooltip, Suggestion },
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
            similarList: {
                type: Array,
                required: false,
                default() {
                    return []
                },
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

            const handleApplySuggestion = (obj) => {
                localDescription.value = obj.value
                handleChangeDescription()
            }

            /**
             * A utility function for avoiding saving on pressing Shift + Enter.
             * @param event
             */
            const handleEnter = (event: KeyboardEvent) => {
                if (!event.getModifierState('Shift')) {
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
                handleApplySuggestion,
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.tooltip-black .ant-tooltip-inner) {
        @apply p-3 text-gray-700 whitespace-pre-line;
    }
    :global(.ant-input) {
        z-index: 800 !important;
    }
</style>
