<template>
    <a-tooltip
        v-if="!isEditing && localDescription.length > 0"
        :title="truncated ? tooltipText : undefined"
        :placement="placement"
        :destroy-tooltip-on-hide="true"
        :overlay-style="{ maxWidth: width }"
        :color="tooltipColor"
        :overlay-class-name="tooltipColor === 'white' ? 'tooltip-black' : ''"
    >
        <div
            :class="classes"
            :style="{ maxWidth: clampPercentage, 'line-break': 'anywhere' }"
        >
            <template v-if="routeTo">
                <router-link
                    :to="routeTo"
                    :target="shouldOpenInNewTab ? '_blank' : 'self'"
                >
                    <a-typography-paragraph
                        v-if="allowEditing"
                        class="cursor-text"
                        :class="classes"
                        :ellipsis="{
                            rows: rows,
                            onEllipsis: () => (truncated = !truncated),
                        }"
                        :content="localDescription"
                        @click.stop="handleEdit"
                    />
                    <a-typography-paragraph
                        v-else
                        class="cursor-text"
                        :class="classes"
                        :ellipsis="{
                            rows: rows,
                            onEllipsis: () => (truncated = !truncated),
                        }"
                        :content="localDescription"
                    />
                </router-link>
            </template>
            <template v-else>
                <a-typography-paragraph
                    v-if="allowEditing"
                    class="cursor-text"
                    :class="classes"
                    :ellipsis="{
                        rows: rows,
                        onEllipsis: () => (truncated = !truncated),
                    }"
                    :content="localDescription"
                    @click.stop="handleEdit"
                />
                <a-typography-paragraph
                    v-else
                    class="cursor-text"
                    :class="classes"
                    :ellipsis="{
                        rows: rows,
                        onEllipsis: () => (truncated = !truncated),
                    }"
                    :content="localDescription"
                />
            </template>
        </div>
    </a-tooltip>
    <div
        v-else-if="!isEditing && localDescription.length === 0"
        class="cursor-text text-transparent hover:text-gray-400"
        @click.stop="handleEdit"
    >
        <p>{{ allowEditing ? 'Add a description' : '' }}</p>
    </div>
    <div v-else @click.stop>
        <a-textarea
            ref="descriptionRef"
            v-model:value="localDescription"
            rows="1"
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
    import { defineComponent, nextTick, ref, toRefs, unref } from 'vue'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'

    export default defineComponent({
        name: 'EditableDescription',
        props: {
            assetItem: {
                type: Object,
                required: true,
            },
            tooltipText: {
                type: String,
                default: '',
            },
            rows: {
                type: Number,
                default: 1,
            },
            width: {
                type: String,
                default: 'initial',
            },
            classes: {
                type: String,
                default: 'initial',
            },
            placement: {
                type: String,
                default: 'topRight',
            },
            routeTo: {
                type: String,
                required: false,
            },
            tooltipColor: {
                type: String,
                required: false,
            },
            shouldOpenInNewTab: {
                type: Boolean,
                required: false,
                default: false,
            },
            clampPercentage: {
                type: String,
                required: false,
                default: '95%',
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
            const { tooltipText, allowEditing, assetItem } = toRefs(props)
            const descriptionRef = ref(null)
            const pressedEsc = ref(false)

            const { localDescription, handleChangeDescription } =
                updateAssetAttributes(assetItem, true)
            const originalDescription = ref(unref(localDescription))

            // A ref indicating if the description is being edited.
            const isEditing = ref(false)

            /**
             * A utility function to toggle on and off editing of the field.
             */
            const handleEdit = () => {
                if (allowEditing.value) {
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
                if (!event.getModifierState('Shift')) {
                    isEditing.value = false
                }
            }

            // The shortcut keys will change in accordance with this property.
            const isMac = window.navigator.userAgent.indexOf('Mac') !== -1

            return {
                tooltipText,
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

    .editable {
        :global(.ant-input) {
            @apply border-none bg-transparent shadow-none px-0 py-0 rounded-none !important;
            min-height: 22px !important;
        }
        :global(.ant-input:focus) {
            @apply border-none bg-white shadow-lg px-1 py-0 rounded-md !important;
        }
    }
</style>
