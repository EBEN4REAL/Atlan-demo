<template>
    {{ modelValue }}
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
    import {
        computed,
        defineComponent,
        PropType,
        toRefs,
        inject,
        ref,
        watch,
        onMounted,
        watchEffect,
    } from 'vue'
    import {
        and,
        useActiveElement,
        useMagicKeys,
        useTimeoutFn,
        useVModels,
        whenever,
    } from '@vueuse/core'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
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
        emits: ['update:isEditMode'],
        setup(props, { emit }) {
            // data
            const { enter } = useMagicKeys()
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(props.selectedAsset?.displayText)

            const { title, getAnchorQualifiedName, getAnchorName } =
                useAssetInfo()

            watchEffect(() => {
                if (enter.value && modelValue.value) {
                    console.log('done editing')
                    modelValue.value = false
                    // handleNameChange()
                }
            })
            const handleEditCancel = () => {
                console.log('esc')
                if (modelValue.value) {
                    modelValue.value = false
                }
            }

            return {
                title,
                getAnchorQualifiedName,
                getAnchorName,
                localValue,
                handleEditCancel,
            }
        },
    })
</script>
<style lang="less" module></style>
