<template>
    <div :class="$style.input">
        <a-input
            ref="nameRef"
            v-model:value="localValue"
            tabindex="0"
            :rows="4"
            @blur="handleBlur"
            @keyup.esc="handleEditCancel"
            class="p-0 m-0 border-0 outline-none bg-transparent"
            :class="classes"
        ></a-input>
    </div>
</template>
<script lang="ts">
    // library
    import { defineComponent, ref, watchEffect, watch, nextTick } from 'vue'
    import { useMagicKeys, useVModels, whenever, toRefs } from '@vueuse/core'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    export default defineComponent({
        name: 'EditName',
        props: {
            selectedAsset: {
                type: Object,
                required: true,
            },
            modelValue: {
                type: Boolean,
                required: true,
            },
            classes: {
                type: String,
                required: false,
                default: '',
            },
        },
        emits: ['update:isEditMode', 'update:modelValue', 'updateName'],
        setup(props, { emit }) {
            // data
            const { enter, escape } = useMagicKeys()
            const { modelValue } = useVModels(props, emit)
            const { selectedAsset } = toRefs(props)
            const nameRef = ref(null)
            const isCancelled = ref(false)
            const { handleChangeName, localName, error } =
                updateAssetAttributes(selectedAsset)

            const { title, getAnchorQualifiedName, getAnchorName } =
                useAssetInfo()

            const localValue = ref(title(props.selectedAsset))
            const handleNameChange = () => {
                console.log('name chnage ', localValue.value)
                if (localName.value !== localValue.value) {
                    localName.value = localValue.value
                    emit('updateName', localValue.value)
                    handleChangeName()
                }
            }
            const reset = () => {
                localValue.value = title(props.selectedAsset)
                emit('updateName', localValue.value)
            }
            const handleBlur = () => {
                console.log(escape.value)
                if (enter.value || escape.value) {
                    return
                }
                setTimeout(() => {
                    if (!isCancelled.value) {
                        handleNameChange()
                        handleEditCancel()
                    }
                }, 300)
            }

            const handleEditCancel = () => {
                console.log('esc')
                if (modelValue.value) {
                    modelValue.value = false
                    localValue.value = title(props.selectedAsset)
                }
            }
            watchEffect(() => {
                if (enter.value && modelValue.value) {
                    console.log('done editing')
                    modelValue.value = false
                    handleNameChange()
                }
            })
            watchEffect(async () => {
                if (modelValue.value) {
                    console.log(nameRef.value)
                    await nextTick()
                    nameRef?.value?.focus()
                    localValue.value = title(props.selectedAsset)
                    isCancelled.value = false
                }
            })

            whenever(escape, () => {
                if (escape.value) {
                    isCancelled.value = true
                    handleEditCancel()
                }
            })
            whenever(error, () => {
                reset()
            })
            return {
                title,
                getAnchorQualifiedName,
                getAnchorName,
                localValue,
                handleEditCancel,
                handleBlur,
                nameRef,
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
        :global(.ant-modal-content) {
            @apply rounded-md  !important;
        }
    }
</style>
