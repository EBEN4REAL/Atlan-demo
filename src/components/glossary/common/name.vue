<template>
    <a-input
        ref="nameRef"
        v-model:value="localValue"
        tabindex="0"
        :rows="4"
        @blur="handleBlur"
        @keyup.esc="handleEditCancel"
    ></a-input>
</template>
<script lang="ts">
    // library
    import { defineComponent, ref, watchEffect, watch ,nextTick} from 'vue'
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
        },
        emits: ['update:isEditMode','update:modelValue'],
        setup(props, { emit }) {
            // data
            const { enter, esc } = useMagicKeys()
            const { modelValue } = useVModels(props, emit)
            const { selectedAsset } = toRefs(props)
            const localValue = ref(props.selectedAsset?.displayText)
            const nameRef = ref(null)
            const { handleChangeName, localName } =
                updateAssetAttributes(selectedAsset)

            const { title, getAnchorQualifiedName, getAnchorName } =
                useAssetInfo()

            const handleNameChange = () => {
                console.log('name chnage ', localValue.value)
                localName.value = localValue.value
                handleChangeName()
            }

            const handleBlur = () => {
                if (enter.value) {
                    return
                }
                handleNameChange()
                handleEditCancel()
            }

            const handleEditCancel = () => {
                console.log('esc')
                if (modelValue.value) {
                    modelValue.value = false
                }
            }
            watchEffect(() => {
                if (enter.value && modelValue.value) {
                    console.log('done editing')
                    modelValue.value = false
                    handleNameChange()
                }
            })
            watchEffect(async() => {
                if (modelValue.value) {
                    console.log(nameRef.value)
                    await nextTick()
                    nameRef?.value?.focus()
                }
            })

            whenever(esc, () => {
                handleEditCancel()
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
<style lang="less" module></style>
